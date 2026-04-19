"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useCustomizerStore } from "@/stores/customizer-store";
import { getColourway } from "@/lib/print-catalog";

// ─── Print-image cache: one load per SKU, reused across renders ─────────────
const printImageCache = new Map<string, HTMLImageElement>();

function loadPrintImage(url: string): Promise<HTMLImageElement> {
  const cached = printImageCache.get(url);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve(cached);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      printImageCache.set(url, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function hexToRgb(hex: string) {
  const num = parseInt(hex.replace("#", ""), 16);
  return { r: (num >> 16) & 0xff, g: (num >> 8) & 0xff, b: num & 0xff };
}

function isLight(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}

function createRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

// ── Slender Emirati mikhwar proportions — flowing, tall, elegant ──
// Shoulders ≈ body width (no cap-sleeve puff). Sleeves hang straight and
// flare only at the cuff. Body drops in a gentle column with moderate A-line.
function getKaftanGeometry(w: number, h: number) {
  const cx = w / 2;
  return {
    cx,
    // Neckline V — deep and narrow
    neckTopY: h * 0.04,
    vPointY: h * 0.23,
    shoulderY: h * 0.065,
    shoulderLX: cx - w * 0.185,
    shoulderRX: cx + w * 0.185,
    collarW: w * 0.042,
    // Sleeve — narrow at shoulder, gentle flare only at cuff
    sleeveTopY: h * 0.085,
    sleeveTopX: w * 0.195,
    sleeveMidY: h * 0.33,
    sleeveMidX: w * 0.22,     // barely wider than shoulder — hangs down
    sleeveCuffY: h * 0.56,     // long sleeve reaching mid-hip
    sleeveCuffOuterX: w * 0.30, // modest flare at cuff
    sleeveCuffInnerX: w * 0.18, // cuff opening, narrower than outer
    underarmY: h * 0.31,
    underarmX: w * 0.17,        // body width at armpit
    // Bodice — column shape, no dramatic cinch
    waistY: h * 0.48,
    waistX: w * 0.165,          // minimal waist suggestion, not hourglass
    // Hip — slight flare begins
    hipY: h * 0.60,
    hipX: w * 0.20,
    // Skirt — moderate A-line, floor-length
    midSkirtY: h * 0.80,
    midSkirtX: w * 0.30,
    hemY: h * 0.985,
    hemX: w * 0.40,             // moderate flare, not extreme
  };
}

// Backwards-compat alias for neckline-embroidery code that imports this name.
const getNeckGeometry = getKaftanGeometry;

// ── Slender mikhwar silhouette — flowing vertical column with gentle cuff flare ──
function drawJalabiyaPath(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = getKaftanGeometry(w, h);
  const { cx, neckTopY, vPointY, shoulderY, shoulderLX, shoulderRX, collarW } = g;

  ctx.beginPath();

  // ── Neckline: deep V with narrow collar band ──
  ctx.moveTo(shoulderLX + collarW * 0.5, neckTopY);
  ctx.quadraticCurveTo(shoulderLX + collarW * 1.2, neckTopY + (vPointY - neckTopY) * 0.4, cx, vPointY);
  ctx.quadraticCurveTo(shoulderRX - collarW * 1.2, neckTopY + (vPointY - neckTopY) * 0.4, shoulderRX - collarW * 0.5, neckTopY);

  // ── Right shoulder seam — flat, no cap ──
  ctx.lineTo(shoulderRX, shoulderY);

  // ── Right sleeve: narrow at top, falls straight, flares only near cuff ──
  // Outer sleeve edge — 3-point bezier for natural drape
  ctx.bezierCurveTo(
    cx + g.sleeveTopX + w * 0.008, g.sleeveTopY,           // just below shoulder
    cx + g.sleeveMidX - w * 0.005, g.sleeveMidY,            // mid-sleeve hangs down
    cx + g.sleeveCuffOuterX, g.sleeveCuffY                  // cuff outer corner
  );

  // Cuff opening — curved arc (mouth of the sleeve, slight droop)
  ctx.quadraticCurveTo(
    cx + (g.sleeveCuffOuterX + g.sleeveCuffInnerX) / 2, g.sleeveCuffY + h * 0.016,
    cx + g.sleeveCuffInnerX, g.sleeveCuffY - h * 0.004
  );

  // Inner sleeve edge — gentle curve up to underarm
  ctx.bezierCurveTo(
    cx + g.underarmX + w * 0.02, g.sleeveCuffY - h * 0.15,  // sleeve inner mid
    cx + g.underarmX + w * 0.012, g.underarmY + h * 0.03,    // approaching armpit
    cx + g.underarmX, g.underarmY                            // armpit
  );

  // ── Right body: column drop with minimal waist suggestion ──
  ctx.quadraticCurveTo(cx + g.underarmX - w * 0.008, h * 0.40, cx + g.waistX, g.waistY);
  ctx.quadraticCurveTo(cx + g.waistX + w * 0.005, (g.waistY + g.hipY) / 2, cx + g.hipX, g.hipY);

  // ── Skirt: moderate A-line flare to floor ──
  ctx.bezierCurveTo(
    cx + w * 0.23, h * 0.70,
    cx + g.midSkirtX, g.midSkirtY,
    cx + g.hemX, g.hemY
  );

  // ── Hem: gentle floor curve ──
  const hemDipY = g.hemY + h * 0.006;
  ctx.quadraticCurveTo(cx + g.hemX * 0.5, hemDipY, cx, hemDipY);
  ctx.quadraticCurveTo(cx - g.hemX * 0.5, hemDipY, cx - g.hemX, g.hemY);

  // ── Left side — mirror of right ──
  ctx.bezierCurveTo(
    cx - g.midSkirtX, g.midSkirtY,
    cx - w * 0.23, h * 0.70,
    cx - g.hipX, g.hipY
  );
  ctx.quadraticCurveTo(cx - g.waistX - w * 0.005, (g.waistY + g.hipY) / 2, cx - g.waistX, g.waistY);
  ctx.quadraticCurveTo(cx - g.underarmX + w * 0.008, h * 0.40, cx - g.underarmX, g.underarmY);

  // Left inner sleeve
  ctx.bezierCurveTo(
    cx - g.underarmX - w * 0.012, g.underarmY + h * 0.03,
    cx - g.underarmX - w * 0.02, g.sleeveCuffY - h * 0.15,
    cx - g.sleeveCuffInnerX, g.sleeveCuffY - h * 0.004
  );

  // Left cuff opening
  ctx.quadraticCurveTo(
    cx - (g.sleeveCuffOuterX + g.sleeveCuffInnerX) / 2, g.sleeveCuffY + h * 0.016,
    cx - g.sleeveCuffOuterX, g.sleeveCuffY
  );

  // Left outer sleeve edge (mirror of right outer)
  ctx.bezierCurveTo(
    cx - g.sleeveMidX + w * 0.005, g.sleeveMidY,
    cx - g.sleeveTopX - w * 0.008, g.sleeveTopY,
    shoulderLX, shoulderY
  );

  // Shoulder back to neckline
  ctx.lineTo(shoulderLX + collarW * 0.5, neckTopY);

  ctx.closePath();
}

// ── Soft drape lines — subtle vertical flow lines (not hard pleats) ──
function drawSkirtPleats(ctx: CanvasRenderingContext2D, w: number, h: number, baseColor: string) {
  const g = getKaftanGeometry(w, h);
  const light = isLight(baseColor);
  const shadowColor = light ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.12)";

  // Four subtle drape lines — suggests flowing fabric, not structured pleats
  const lines = 4;
  ctx.save();
  ctx.lineWidth = 0.6;
  ctx.strokeStyle = shadowColor;

  for (let i = 1; i < lines; i++) {
    const t = i / lines;
    const topX = g.cx + (t - 0.5) * 2 * (g.waistX - w * 0.015);
    const botX = g.cx + (t - 0.5) * 2 * g.hemX * 0.82;

    ctx.beginPath();
    ctx.moveTo(topX, g.waistY + h * 0.008);
    ctx.bezierCurveTo(
      g.cx + (t - 0.5) * 2 * (g.hipX) * 0.9,
      (g.waistY + g.midSkirtY) / 2,
      g.cx + (t - 0.5) * 2 * g.midSkirtX * 0.85,
      g.midSkirtY,
      botX,
      g.hemY - h * 0.008
    );
    ctx.stroke();
  }

  ctx.restore();
}

// ── Delicate waist belt — thin gold/bronze line with slight drop centre ──
function drawWaistSash(ctx: CanvasRenderingContext2D, w: number, h: number, baseColor: string) {
  const g = getKaftanGeometry(w, h);
  const light = isLight(baseColor);

  ctx.save();

  // Thin dark belt line
  const beltHeight = h * 0.011;
  ctx.fillStyle = light ? "rgba(0,0,0,0.20)" : "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.moveTo(g.cx - g.waistX + w * 0.005, g.waistY - beltHeight * 0.5);
  ctx.quadraticCurveTo(g.cx, g.waistY - beltHeight * 0.3, g.cx + g.waistX - w * 0.005, g.waistY - beltHeight * 0.5);
  ctx.lineTo(g.cx + g.waistX - w * 0.005, g.waistY + beltHeight * 0.5);
  ctx.quadraticCurveTo(g.cx, g.waistY + beltHeight * 0.7, g.cx - g.waistX + w * 0.005, g.waistY + beltHeight * 0.5);
  ctx.closePath();
  ctx.fill();

  // Gold/bronze accent stripe down middle of belt — signature Khaleeji look
  ctx.fillStyle = "rgba(196,155,89,0.65)";
  ctx.fillRect(g.cx - g.waistX + w * 0.005, g.waistY - h * 0.002, g.waistX * 2 - w * 0.01, h * 0.004);

  // Highlight
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.fillRect(g.cx - g.waistX + w * 0.005, g.waistY - beltHeight * 0.5, g.waistX * 2 - w * 0.01, h * 0.002);

  ctx.restore();
}

// ── Sleeve cuff band — subtle embroidered edge at sleeve opening ──
function drawSleeveCuffs(ctx: CanvasRenderingContext2D, w: number, h: number, baseColor: string) {
  const g = getKaftanGeometry(w, h);
  const light = isLight(baseColor);
  const bandColor = light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)";
  const accentColor = light ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.3)";

  ctx.save();
  ctx.lineWidth = 0.8;

  for (const side of [-1, 1]) {
    const outerX = g.cx + side * g.sleeveCuffOuterX;
    const innerX = g.cx + side * g.sleeveCuffInnerX;
    const topY = g.sleeveCuffY - h * 0.018;

    // Band fill
    ctx.fillStyle = bandColor;
    ctx.beginPath();
    ctx.moveTo(outerX, g.sleeveCuffY - h * 0.004);
    ctx.quadraticCurveTo(
      (outerX + innerX) / 2, g.sleeveCuffY + h * 0.012,
      innerX, g.sleeveCuffY - h * 0.008
    );
    ctx.lineTo(innerX, topY - h * 0.002);
    ctx.quadraticCurveTo(
      (outerX + innerX) / 2, topY + h * 0.008,
      outerX, topY
    );
    ctx.closePath();
    ctx.fill();

    // Accent line along top of cuff
    ctx.strokeStyle = accentColor;
    ctx.beginPath();
    ctx.moveTo(outerX, topY + h * 0.002);
    ctx.quadraticCurveTo(
      (outerX + innerX) / 2, topY + h * 0.012,
      innerX, topY
    );
    ctx.stroke();
  }

  ctx.restore();
}

// ── Bodice highlight — soft radial light where the chest catches light ──
function drawBodiceHighlight(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = getKaftanGeometry(w, h);
  const highlight = ctx.createRadialGradient(
    g.cx - w * 0.04, g.vPointY + h * 0.03,
    0,
    g.cx - w * 0.04, g.vPointY + h * 0.03,
    w * 0.22
  );
  highlight.addColorStop(0, "rgba(255,255,255,0.18)");
  highlight.addColorStop(0.6, "rgba(255,255,255,0.05)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = highlight;
  ctx.fillRect(0, 0, w, h);
}

// ── Side shadows — darken edges for dimensional drape ──
function drawSideShadows(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Left edge vignette
  const leftShadow = ctx.createLinearGradient(0, 0, w * 0.22, 0);
  leftShadow.addColorStop(0, "rgba(0,0,0,0.18)");
  leftShadow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = leftShadow;
  ctx.fillRect(0, 0, w * 0.22, h);

  // Right edge vignette
  const rightShadow = ctx.createLinearGradient(w * 0.78, 0, w, 0);
  rightShadow.addColorStop(0, "rgba(0,0,0,0)");
  rightShadow.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = rightShadow;
  ctx.fillRect(w * 0.78, 0, w * 0.22, h);
}

// ── Construction details: center seam + subtle pleat hints ──
function drawConstructionLines(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = getKaftanGeometry(w, h);

  ctx.save();
  ctx.strokeStyle = "rgba(0,0,0,0.05)";
  ctx.lineWidth = 0.8;

  // Center front seam — solid thin line from V-point to hem
  ctx.beginPath();
  ctx.moveTo(g.cx, g.vPointY + h * 0.01);
  ctx.lineTo(g.cx, g.hemY);
  ctx.stroke();

  ctx.restore();
}

// ── Fabric texture layer ──
function drawWeaveTexture(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  type: string, baseColor: string, rng: () => number
) {
  const light = isLight(baseColor);
  switch (type) {
    case "silk": {
      for (let i = -h; i < w + h; i += 3) {
        const alpha = 0.07 + Math.sin(i * 0.02) * 0.04;
        ctx.strokeStyle = `rgba(255,255,255,${alpha * (light ? 0.8 : 1.3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i - h * 0.3, h); ctx.stroke();
      }
      const sheen = ctx.createLinearGradient(0, 0, w, h);
      sheen.addColorStop(0, "rgba(255,255,255,0)");
      sheen.addColorStop(0.35, `rgba(255,255,255,${light ? 0.12 : 0.18})`);
      sheen.addColorStop(0.5, `rgba(255,255,255,${light ? 0.2 : 0.25})`);
      sheen.addColorStop(0.65, `rgba(255,255,255,${light ? 0.08 : 0.12})`);
      sheen.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sheen;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case "cotton": {
      ctx.lineWidth = 0.8;
      for (let x = 0; x < w; x += 3) {
        ctx.strokeStyle = light ? `rgba(0,0,0,${0.07 + rng() * 0.05})` : `rgba(255,255,255,${0.08 + rng() * 0.05})`;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 3) {
        ctx.strokeStyle = light ? `rgba(0,0,0,${0.06 + rng() * 0.04})` : `rgba(255,255,255,${0.07 + rng() * 0.04})`;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      break;
    }
    case "linen": {
      ctx.lineWidth = 1.2;
      for (let x = 0; x < w; x += 5) {
        const wobble = rng() * 2.5;
        ctx.strokeStyle = light ? `rgba(0,0,0,${0.1 + rng() * 0.06})` : `rgba(255,255,255,${0.1 + rng() * 0.06})`;
        ctx.beginPath(); ctx.moveTo(x + wobble, 0); ctx.lineTo(x - wobble, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 5 + rng() * 2) {
        ctx.strokeStyle = light ? `rgba(0,0,0,${0.08 + rng() * 0.08})` : `rgba(255,255,255,${0.08 + rng() * 0.08})`;
        ctx.lineWidth = 0.8 + rng() * 0.8;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      break;
    }
    case "velvet": {
      for (let y = 0; y < h; y += 2) {
        const b = Math.sin(y * 0.025) * 0.08;
        ctx.strokeStyle = light ? `rgba(0,0,0,${0.05 + b})` : `rgba(255,255,255,${0.08 + b})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      const glow = ctx.createRadialGradient(w * 0.4, h * 0.35, 0, w * 0.4, h * 0.35, w * 0.6);
      glow.addColorStop(0, `rgba(255,255,255,${light ? 0.1 : 0.15})`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case "chiffon": {
      ctx.lineWidth = 0.4;
      for (let x = 0; x < w; x += 8) {
        ctx.strokeStyle = light ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.07)";
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += 8) {
        ctx.strokeStyle = light ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)";
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      const trans = ctx.createLinearGradient(0, 0, w, h);
      trans.addColorStop(0, `rgba(255,255,255,${light ? 0.08 : 0.12})`);
      trans.addColorStop(0.5, "rgba(255,255,255,0)");
      trans.addColorStop(1, `rgba(255,255,255,${light ? 0.06 : 0.1})`);
      ctx.fillStyle = trans;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case "organza": {
      ctx.lineWidth = 0.3;
      for (let x = 0; x < w; x += 6) {
        ctx.strokeStyle = light ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)";
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      const shimmer = ctx.createLinearGradient(0, 0, w * 0.7, h);
      shimmer.addColorStop(0, "rgba(255,255,255,0)");
      shimmer.addColorStop(0.4, `rgba(255,255,255,${light ? 0.15 : 0.22})`);
      shimmer.addColorStop(0.6, `rgba(255,255,255,${light ? 0.08 : 0.12})`);
      shimmer.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = shimmer;
      ctx.fillRect(0, 0, w, h);
      break;
    }
    case "tulle": {
      ctx.lineWidth = 0.6;
      const ts = 10;
      for (let x = 0; x < w; x += ts) {
        for (let y = 0; y < h; y += ts) {
          ctx.strokeStyle = light ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)";
          ctx.beginPath();
          ctx.moveTo(x, y); ctx.lineTo(x + ts, y + ts);
          ctx.moveTo(x + ts, y); ctx.lineTo(x, y + ts);
          ctx.stroke();
        }
      }
      break;
    }
  }
}

// ── All-over pattern overlay ──
function drawPattern(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  patternId: string, baseColor: string, scale: number
) {
  const light = isLight(baseColor);
  const stroke = light ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.45)";
  const fill = light ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.25)";
  const size = Math.round(50 * scale);

  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;

  switch (patternId) {
    case "stripes": {
      ctx.lineWidth = 3;
      const gap = size * 0.4;
      for (let x = -w; x < w * 2; x += gap) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h * 0.3, h); ctx.stroke();
      }
      break;
    }
    case "chevron": {
      ctx.lineWidth = 2;
      const rowH = size;
      for (let y = 0; y < h; y += rowH) {
        for (let x = -size; x < w + size; x += size) {
          ctx.beginPath();
          ctx.moveTo(x, y + rowH * 0.5); ctx.lineTo(x + size * 0.5, y); ctx.lineTo(x + size, y + rowH * 0.5);
          ctx.stroke();
        }
      }
      break;
    }
    case "dots": {
      const dotR = size * 0.12;
      const gap = size * 0.5;
      for (let y = 0; y < h; y += gap) {
        const offset = Math.floor(y / gap) % 2 === 0 ? 0 : gap * 0.5;
        for (let x = offset; x < w; x += gap) {
          ctx.beginPath(); ctx.arc(x, y, dotR, 0, Math.PI * 2); ctx.fill();
        }
      }
      break;
    }
    case "diamond": {
      ctx.lineWidth = 1.5;
      const dSize = size * 0.7;
      for (let y = 0; y < h; y += dSize) {
        const offset = Math.floor(y / dSize) % 2 === 0 ? 0 : dSize * 0.5;
        for (let x = offset; x < w; x += dSize) {
          ctx.beginPath();
          ctx.moveTo(x, y - dSize * 0.35); ctx.lineTo(x + dSize * 0.35, y);
          ctx.lineTo(x, y + dSize * 0.35); ctx.lineTo(x - dSize * 0.35, y);
          ctx.closePath(); ctx.fill(); ctx.stroke();
        }
      }
      break;
    }
    case "arabesque": {
      ctx.lineWidth = 1.8;
      const aSize = size * 0.8;
      for (let y = 0; y < h + aSize; y += aSize) {
        for (let x = 0; x < w + aSize; x += aSize) {
          ctx.beginPath(); ctx.arc(x, y, aSize * 0.38, 0, Math.PI, false); ctx.stroke();
          ctx.beginPath(); ctx.arc(x + aSize * 0.5, y + aSize * 0.5, aSize * 0.38, Math.PI, 0, false); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, aSize * 0.05, 0, Math.PI * 2); ctx.fill();
        }
      }
      break;
    }
    case "geometric-islamic": {
      ctx.lineWidth = 1.8;
      const gSize = size * 0.8;
      for (let y = 0; y < h + gSize; y += gSize) {
        for (let x = 0; x < w + gSize; x += gSize) {
          const ccx = x + gSize * 0.5, ccy = y + gSize * 0.5;
          for (let i = 0; i < 8; i++) {
            const a1 = (i * Math.PI) / 4, a2 = ((i + 1) * Math.PI) / 4;
            ctx.beginPath();
            ctx.moveTo(ccx + Math.cos(a1) * gSize * 0.42, ccy + Math.sin(a1) * gSize * 0.42);
            ctx.lineTo(ccx + Math.cos((a1 + a2) / 2) * gSize * 0.17, ccy + Math.sin((a1 + a2) / 2) * gSize * 0.17);
            ctx.lineTo(ccx + Math.cos(a2) * gSize * 0.42, ccy + Math.sin(a2) * gSize * 0.42);
            ctx.stroke();
          }
        }
      }
      break;
    }
    case "paisley": {
      const pSize = size * 0.9;
      for (let y = 0; y < h + pSize; y += pSize * 1.2) {
        const offset = Math.floor(y / (pSize * 1.2)) % 2 === 0 ? 0 : pSize * 0.6;
        for (let x = offset; x < w + pSize; x += pSize * 1.2) {
          ctx.save();
          ctx.translate(x, y);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(0, -pSize * 0.3);
          ctx.bezierCurveTo(pSize * 0.25, -pSize * 0.25, pSize * 0.3, pSize * 0.1, 0, pSize * 0.3);
          ctx.bezierCurveTo(-pSize * 0.3, pSize * 0.1, -pSize * 0.25, -pSize * 0.25, 0, -pSize * 0.3);
          ctx.stroke();
          ctx.beginPath(); ctx.arc(0, -pSize * 0.05, pSize * 0.1, 0, Math.PI * 1.5); ctx.stroke();
          ctx.beginPath(); ctx.arc(0, -pSize * 0.05, pSize * 0.03, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      }
      break;
    }
  }
  ctx.restore();
}

// ── Helper: draw a multi-petal flower ──
function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, petals: number, stroke: string, fill: string) {
  ctx.save();
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;
  for (let i = 0; i < petals; i++) {
    const angle = (i * Math.PI * 2) / petals;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(angle) * r * 0.45, y + Math.sin(angle) * r * 0.45, r * 0.42, r * 0.22, angle, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  // Center
  ctx.beginPath();
  ctx.arc(x, y, r * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

// ── Helper: draw a leaf ──
function drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number, stroke: string, fill: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(size * 0.3, -size * 0.15, size * 0.8, -size * 0.12, size, 0);
  ctx.bezierCurveTo(size * 0.8, size * 0.12, size * 0.3, size * 0.15, 0, 0);
  ctx.fill();
  ctx.stroke();
  // Vein
  ctx.beginPath();
  ctx.moveTo(size * 0.1, 0);
  ctx.lineTo(size * 0.85, 0);
  ctx.stroke();
  ctx.restore();
}

// ── Neckline embroidery designs (inspired by reference images) ──
function drawNecklineEmbroidery(
  ctx: CanvasRenderingContext2D, w: number, h: number,
  designId: string, baseColor: string, scale: number
) {
  const { cx, neckTopY, vPointY, shoulderLX, shoulderRX, shoulderY } = getNeckGeometry(w, h);
  const light = isLight(baseColor);
  const stroke = light ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.55)";
  const fill = light ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.28)";
  const fillLight = light ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.16)";
  const sc = scale;

  ctx.save();

  // V-neck line vectors
  const vLeftDx = cx - (shoulderLX + w * 0.04);
  const vLeftDy = vPointY - neckTopY;
  const vRightDx = cx - (shoulderRX - w * 0.04);
  const vRightDy = vPointY - neckTopY;

  // Panel extends below V-point
  const panelBottom = vPointY + h * 0.35 * sc;
  const panelW = w * 0.08 * sc;

  switch (designId) {
    // ── Design 1: Royal Floral (gold & purple reference) ──
    case "neck-royal": {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = stroke;
      ctx.fillStyle = fill;

      // Draw V-border bands (3 parallel lines each side)
      for (let band = 0; band < 3; band++) {
        const offset = (band * 6 - 6) * sc;
        // Left V-line
        ctx.beginPath();
        ctx.moveTo(shoulderLX + w * 0.02 + offset, neckTopY + offset * 0.8);
        ctx.lineTo(cx + offset * 0.3, vPointY + offset);
        ctx.stroke();
        // Right V-line (mirrored)
        ctx.beginPath();
        ctx.moveTo(shoulderRX - w * 0.02 - offset, neckTopY + offset * 0.8);
        ctx.lineTo(cx - offset * 0.3, vPointY + offset);
        ctx.stroke();
      }

      // Dot row between border bands
      const dotSpacing = 5 * sc;
      for (let t = 0; t < 1; t += dotSpacing / Math.sqrt(vLeftDx * vLeftDx + vLeftDy * vLeftDy)) {
        const lx = shoulderLX + w * 0.04 + vLeftDx * t;
        const ly = neckTopY + vLeftDy * t;
        ctx.beginPath(); ctx.arc(lx, ly, 1.5 * sc, 0, Math.PI * 2); ctx.fill();
        // Mirror right
        const rx = shoulderRX - w * 0.04 + vRightDx * t;
        ctx.beginPath(); ctx.arc(rx, ly, 1.5 * sc, 0, Math.PI * 2); ctx.fill();
      }

      // Central panel below V
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - panelW, vPointY);
      ctx.lineTo(cx - panelW, panelBottom - panelW);
      ctx.quadraticCurveTo(cx - panelW, panelBottom, cx, panelBottom + panelW * 0.5);
      ctx.quadraticCurveTo(cx + panelW, panelBottom, cx + panelW, panelBottom - panelW);
      ctx.lineTo(cx + panelW, vPointY);
      ctx.stroke();
      // Inner panel line
      const inset = 4 * sc;
      ctx.beginPath();
      ctx.moveTo(cx - panelW + inset, vPointY + inset);
      ctx.lineTo(cx - panelW + inset, panelBottom - panelW);
      ctx.quadraticCurveTo(cx - panelW + inset, panelBottom - inset, cx, panelBottom + panelW * 0.5 - inset);
      ctx.quadraticCurveTo(cx + panelW - inset, panelBottom - inset, cx + panelW - inset, panelBottom - panelW);
      ctx.lineTo(cx + panelW - inset, vPointY + inset);
      ctx.stroke();

      // Large rosette flowers at shoulder junction
      const flowerR = 14 * sc;
      drawFlower(ctx, shoulderLX + w * 0.06, neckTopY + h * 0.02, flowerR, 8, stroke, fillLight);
      drawFlower(ctx, shoulderRX - w * 0.06, neckTopY + h * 0.02, flowerR, 8, stroke, fillLight);

      // Medium flowers along V-line
      for (let t = 0.25; t < 0.85; t += 0.3) {
        const lx = shoulderLX + w * 0.04 + vLeftDx * t + 12 * sc;
        const ly = neckTopY + vLeftDy * t;
        drawFlower(ctx, lx, ly, flowerR * 0.7, 6, stroke, fillLight);
        const rx = shoulderRX - w * 0.04 + vRightDx * t - 12 * sc;
        drawFlower(ctx, rx, ly, flowerR * 0.7, 6, stroke, fillLight);
      }

      // Leaves along V-line
      for (let t = 0.15; t < 0.9; t += 0.15) {
        const lx = shoulderLX + w * 0.04 + vLeftDx * t + 20 * sc;
        const ly = neckTopY + vLeftDy * t;
        drawLeaf(ctx, lx, ly, 10 * sc, Math.atan2(vLeftDy, vLeftDx) + 0.5, stroke, fillLight);
        const rx = shoulderRX - w * 0.04 + vRightDx * t - 20 * sc;
        drawLeaf(ctx, rx, ly, 10 * sc, Math.atan2(vRightDy, vRightDx) - 0.5, stroke, fillLight);
      }

      // Flowers inside panel
      const panelFlowers = 3;
      for (let i = 0; i < panelFlowers; i++) {
        const fy = vPointY + (panelBottom - vPointY) * ((i + 0.5) / panelFlowers);
        drawFlower(ctx, cx, fy, flowerR * (i === 1 ? 0.9 : 0.6), i === 1 ? 8 : 6, stroke, fillLight);
      }

      // Small 5-petal flowers scattered near neckline
      const rng = createRng(hashSeed("royal" + scale));
      for (let i = 0; i < 12; i++) {
        const side = i < 6 ? -1 : 1;
        const t = 0.1 + rng() * 0.8;
        const baseX = side < 0 ? shoulderLX + w * 0.04 + vLeftDx * t : shoulderRX - w * 0.04 + vRightDx * t;
        const baseY = neckTopY + vLeftDy * t;
        const ox = baseX + side * (18 + rng() * 10) * sc;
        drawFlower(ctx, ox, baseY + (rng() - 0.5) * 8 * sc, 4 * sc, 5, stroke, fillLight);
      }
      break;
    }

    // ── Design 2: Ornate Medallion (pencil sketch reference) ──
    case "neck-ornate": {
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = stroke;
      ctx.fillStyle = fill;

      // Multiple concentric V-border bands (5 bands)
      for (let band = 0; band < 5; band++) {
        const offset = (band * 5 - 10) * sc;
        ctx.beginPath();
        ctx.moveTo(shoulderLX + w * 0.02 + offset, neckTopY + Math.abs(offset) * 0.5);
        ctx.lineTo(cx + offset * 0.2, vPointY + offset);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(shoulderRX - w * 0.02 - offset, neckTopY + Math.abs(offset) * 0.5);
        ctx.lineTo(cx - offset * 0.2, vPointY + offset);
        ctx.stroke();
      }

      // Scrollwork spirals along middle band
      const spiralR = 4 * sc;
      for (let t = 0.1; t < 0.9; t += 0.08) {
        const lx = shoulderLX + w * 0.04 + vLeftDx * t;
        const ly = neckTopY + vLeftDy * t;
        ctx.beginPath();
        ctx.arc(lx + 6 * sc, ly, spiralR, 0, Math.PI * 1.5);
        ctx.stroke();
        const rx = shoulderRX - w * 0.04 + vRightDx * t;
        ctx.beginPath();
        ctx.arc(rx - 6 * sc, ly, spiralR, Math.PI, Math.PI * 2.5);
        ctx.stroke();
      }

      // Central shield / medallion
      const shieldW = panelW * 1.4;
      const shieldH = h * 0.18 * sc;
      const shieldTop = vPointY + 4 * sc;
      const shieldBottom = shieldTop + shieldH;
      // Shield outline
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - shieldW, shieldTop);
      ctx.lineTo(cx - shieldW * 1.1, shieldTop + shieldH * 0.3);
      ctx.quadraticCurveTo(cx - shieldW * 0.8, shieldBottom, cx, shieldBottom + shieldH * 0.15);
      ctx.quadraticCurveTo(cx + shieldW * 0.8, shieldBottom, cx + shieldW * 1.1, shieldTop + shieldH * 0.3);
      ctx.lineTo(cx + shieldW, shieldTop);
      ctx.closePath();
      ctx.stroke();
      // Inner shield
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - shieldW * 0.7, shieldTop + 5 * sc);
      ctx.quadraticCurveTo(cx - shieldW * 0.5, shieldBottom - 5 * sc, cx, shieldBottom + shieldH * 0.05);
      ctx.quadraticCurveTo(cx + shieldW * 0.5, shieldBottom - 5 * sc, cx + shieldW * 0.7, shieldTop + 5 * sc);
      ctx.closePath();
      ctx.stroke();

      // Large lotus/flower inside shield
      const lotusR = shieldH * 0.25;
      const lotusY = shieldTop + shieldH * 0.5;
      drawFlower(ctx, cx, lotusY, lotusR, 10, stroke, fillLight);
      // Oval center gem
      ctx.beginPath();
      ctx.ellipse(cx, lotusY, lotusR * 0.3, lotusR * 0.4, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      // Dense floral fill along V-bands
      for (let t = 0.12; t < 0.88; t += 0.12) {
        const lx = shoulderLX + w * 0.04 + vLeftDx * t + 16 * sc;
        const ly = neckTopY + vLeftDy * t;
        drawFlower(ctx, lx, ly, 8 * sc, 6, stroke, fillLight);
        drawLeaf(ctx, lx + 10 * sc, ly - 3 * sc, 7 * sc, -0.3, stroke, fillLight);
        drawLeaf(ctx, lx + 10 * sc, ly + 5 * sc, 7 * sc, 0.3, stroke, fillLight);

        const rx = shoulderRX - w * 0.04 + vRightDx * t - 16 * sc;
        drawFlower(ctx, rx, ly, 8 * sc, 6, stroke, fillLight);
        drawLeaf(ctx, rx - 10 * sc, ly - 3 * sc, 7 * sc, Math.PI + 0.3, stroke, fillLight);
        drawLeaf(ctx, rx - 10 * sc, ly + 5 * sc, 7 * sc, Math.PI - 0.3, stroke, fillLight);
      }

      // Dot borders (inner band)
      for (let t = 0; t < 1; t += 3 * sc / Math.sqrt(vLeftDx * vLeftDx + vLeftDy * vLeftDy)) {
        const lx = shoulderLX + w * 0.04 + vLeftDx * t - 4 * sc;
        const ly = neckTopY + vLeftDy * t;
        ctx.beginPath(); ctx.arc(lx, ly, 1.2 * sc, 0, Math.PI * 2); ctx.fill();
        const rx = shoulderRX - w * 0.04 + vRightDx * t + 4 * sc;
        ctx.beginPath(); ctx.arc(rx, ly, 1.2 * sc, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }

    // ── Design 3: Botanical Vine (colorful reference) ──
    case "neck-botanical": {
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = stroke;
      ctx.fillStyle = fill;

      // Intertwining vine curves along V-neckline
      for (let side = -1; side <= 1; side += 2) {
        const startX = side < 0 ? shoulderLX + w * 0.05 : shoulderRX - w * 0.05;
        const dx = side < 0 ? vLeftDx : vRightDx;
        const dy = vLeftDy;

        // Two intertwining vine strands
        for (let strand = 0; strand < 2; strand++) {
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const phaseOff = strand * Math.PI;
          for (let t = 0; t <= 1; t += 0.005) {
            const bx = startX + dx * t + side * (8 + Math.sin(t * 12 + phaseOff) * 10) * sc;
            const by = neckTopY + dy * t + Math.cos(t * 12 + phaseOff) * 5 * sc;
            if (t === 0) ctx.moveTo(bx, by);
            else ctx.lineTo(bx, by);
          }
          ctx.stroke();

          // Leaves along each strand
          for (let t = 0.08; t < 0.92; t += 0.1) {
            const bx = startX + dx * t + side * (8 + Math.sin(t * 12 + phaseOff) * 10) * sc;
            const by = neckTopY + dy * t + Math.cos(t * 12 + phaseOff) * 5 * sc;
            const leafAngle = Math.sin(t * 12 + phaseOff) * 0.8 + (side < 0 ? 0.8 : Math.PI - 0.8);
            drawLeaf(ctx, bx, by, 9 * sc, leafAngle, stroke, fillLight);
          }
        }

        // Flowers at intersections
        for (let t = 0.15; t < 0.85; t += 0.25) {
          const bx = startX + dx * t + side * 8 * sc;
          const by = neckTopY + dy * t;
          drawFlower(ctx, bx, by, 10 * sc, 6, stroke, fillLight);
        }
      }

      // Central stem going down from V-point
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, vPointY);
      ctx.lineTo(cx, panelBottom);
      ctx.stroke();
      // Leaves and flowers along central stem
      for (let y = vPointY + 15 * sc; y < panelBottom - 10 * sc; y += 18 * sc) {
        drawLeaf(ctx, cx, y, 11 * sc, -0.6, stroke, fillLight);
        drawLeaf(ctx, cx, y + 6 * sc, 11 * sc, Math.PI + 0.6, stroke, fillLight);
      }
      drawFlower(ctx, cx, vPointY + 8 * sc, 10 * sc, 5, stroke, fillLight);
      drawFlower(ctx, cx, panelBottom - 5 * sc, 12 * sc, 7, stroke, fillLight);
      break;
    }

    // ── Design 4: Simple Floral (clean line art reference) ──
    case "neck-floral": {
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = stroke;
      ctx.fillStyle = fill;

      // Clean V-neckline border (single line each side)
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(shoulderLX + w * 0.03, neckTopY);
      ctx.lineTo(cx, vPointY);
      ctx.lineTo(shoulderRX - w * 0.03, neckTopY);
      ctx.stroke();
      // Parallel inner line
      ctx.lineWidth = 1;
      const inOff = 5 * sc;
      ctx.beginPath();
      ctx.moveTo(shoulderLX + w * 0.03 + inOff, neckTopY + inOff * 0.5);
      ctx.lineTo(cx, vPointY - inOff * 0.8);
      ctx.lineTo(shoulderRX - w * 0.03 - inOff, neckTopY + inOff * 0.5);
      ctx.stroke();

      // Central rectangular panel
      ctx.lineWidth = 1.5;
      const rpW = panelW * 0.9;
      const rpTop = vPointY;
      const rpBot = vPointY + h * 0.25 * sc;
      // Outer rect with pointed bottom
      ctx.beginPath();
      ctx.moveTo(cx - rpW, rpTop);
      ctx.lineTo(cx - rpW, rpBot);
      ctx.lineTo(cx, rpBot + rpW * 0.8);
      ctx.lineTo(cx + rpW, rpBot);
      ctx.lineTo(cx + rpW, rpTop);
      ctx.stroke();
      // Inner rect
      ctx.beginPath();
      ctx.moveTo(cx - rpW + 4 * sc, rpTop + 4 * sc);
      ctx.lineTo(cx - rpW + 4 * sc, rpBot - 2 * sc);
      ctx.lineTo(cx, rpBot + rpW * 0.4);
      ctx.lineTo(cx + rpW - 4 * sc, rpBot - 2 * sc);
      ctx.lineTo(cx + rpW - 4 * sc, rpTop + 4 * sc);
      ctx.stroke();

      // Flowers in panel
      drawFlower(ctx, cx, rpTop + (rpBot - rpTop) * 0.35, 10 * sc, 6, stroke, fillLight);
      drawFlower(ctx, cx, rpTop + (rpBot - rpTop) * 0.7, 8 * sc, 5, stroke, fillLight);
      // Vertical leaf stems in panel
      drawLeaf(ctx, cx - 4 * sc, rpTop + 12 * sc, 8 * sc, Math.PI / 2 + 0.3, stroke, fillLight);
      drawLeaf(ctx, cx + 4 * sc, rpTop + 12 * sc, 8 * sc, Math.PI / 2 - 0.3, stroke, fillLight);

      // Flowers and leaves along V-line (simple, balanced)
      for (let t = 0.15; t < 0.85; t += 0.2) {
        const lx = shoulderLX + w * 0.04 + vLeftDx * t;
        const ly = neckTopY + vLeftDy * t;
        const rx = shoulderRX - w * 0.04 + vRightDx * t;
        // Flowers
        drawFlower(ctx, lx + 14 * sc, ly, 9 * sc, 5, stroke, fillLight);
        drawFlower(ctx, rx - 14 * sc, ly, 9 * sc, 5, stroke, fillLight);
        // Leaves
        drawLeaf(ctx, lx + 8 * sc, ly - 10 * sc, 8 * sc, 0.8, stroke, fillLight);
        drawLeaf(ctx, lx + 8 * sc, ly + 10 * sc, 8 * sc, -0.4, stroke, fillLight);
        drawLeaf(ctx, rx - 8 * sc, ly - 10 * sc, 8 * sc, Math.PI - 0.8, stroke, fillLight);
        drawLeaf(ctx, rx - 8 * sc, ly + 10 * sc, 8 * sc, Math.PI + 0.4, stroke, fillLight);
      }
      break;
    }

    // ── Design 5: Heritage Panel (detailed V with hatched borders) ──
    case "neck-heritage": {
      ctx.lineWidth = 1;
      ctx.strokeStyle = stroke;
      ctx.fillStyle = fill;

      // V-neckline with hatched border bands
      const bandW = 8 * sc;
      // Outer and inner V-lines
      for (let b = 0; b < 2; b++) {
        const off = b * (bandW + 2 * sc);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shoulderLX + w * 0.02 + off, neckTopY + off * 0.4);
        ctx.lineTo(cx, vPointY + off);
        ctx.lineTo(shoulderRX - w * 0.02 - off, neckTopY + off * 0.4);
        ctx.stroke();
      }

      // Hatching between the two V-lines (diagonal strokes)
      ctx.lineWidth = 0.7;
      for (let t = 0; t < 1; t += 0.02) {
        const lx1 = shoulderLX + w * 0.02 + vLeftDx * t;
        const ly1 = neckTopY + vLeftDy * t;
        const lx2 = shoulderLX + w * 0.02 + bandW + 2 * sc + vLeftDx * t;
        const ly2 = neckTopY + (bandW + 2 * sc) * 0.4 + vLeftDy * t;
        ctx.beginPath(); ctx.moveTo(lx1, ly1); ctx.lineTo(lx2, ly2); ctx.stroke();

        const rx1 = shoulderRX - w * 0.02 + vRightDx * t;
        const rx2 = shoulderRX - w * 0.02 - bandW - 2 * sc + vRightDx * t;
        ctx.beginPath(); ctx.moveTo(rx1, ly1); ctx.lineTo(rx2, ly2); ctx.stroke();
      }

      // Triple rectangular panels below V
      const triPanelW = panelW * 0.7;
      const triPanelH = h * 0.12 * sc;
      for (let i = 0; i < 3; i++) {
        const py = vPointY + 6 * sc + i * (triPanelH + 6 * sc);
        // Hexagonal panel shape
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx - triPanelW, py + triPanelH * 0.15);
        ctx.lineTo(cx - triPanelW * 0.7, py);
        ctx.lineTo(cx + triPanelW * 0.7, py);
        ctx.lineTo(cx + triPanelW, py + triPanelH * 0.15);
        ctx.lineTo(cx + triPanelW, py + triPanelH * 0.85);
        ctx.lineTo(cx + triPanelW * 0.7, py + triPanelH);
        ctx.lineTo(cx - triPanelW * 0.7, py + triPanelH);
        ctx.lineTo(cx - triPanelW, py + triPanelH * 0.85);
        ctx.closePath();
        ctx.stroke();
        // Flower inside
        drawFlower(ctx, cx, py + triPanelH * 0.5, triPanelH * 0.28, i === 1 ? 8 : 6, stroke, fillLight);
      }

      // Roses along V-line
      for (let t = 0.12; t < 0.88; t += 0.15) {
        const lx = shoulderLX + w * 0.04 + vLeftDx * t + (bandW + 8) * sc;
        const ly = neckTopY + vLeftDy * t;
        // Rose = nested petals
        drawFlower(ctx, lx, ly, 9 * sc, 7, stroke, fillLight);
        drawFlower(ctx, lx, ly, 5 * sc, 5, stroke, fill);

        const rx = shoulderRX - w * 0.04 + vRightDx * t - (bandW + 8) * sc;
        drawFlower(ctx, rx, ly, 9 * sc, 7, stroke, fillLight);
        drawFlower(ctx, rx, ly, 5 * sc, 5, stroke, fill);
      }

      // Leaves filling gaps
      const rng = createRng(hashSeed("heritage" + scale));
      for (let t = 0.05; t < 0.95; t += 0.06) {
        const lx = shoulderLX + w * 0.04 + vLeftDx * t + (bandW + 18) * sc;
        const ly = neckTopY + vLeftDy * t + (rng() - 0.5) * 6 * sc;
        drawLeaf(ctx, lx, ly, 7 * sc, rng() * 2 - 1, stroke, fillLight);
        const rx = shoulderRX - w * 0.04 + vRightDx * t - (bandW + 18) * sc;
        drawLeaf(ctx, rx, ly + (rng() - 0.5) * 6 * sc, 7 * sc, Math.PI + rng() * 2 - 1, stroke, fillLight);
      }

      // Bottom pointed finial
      const finY = vPointY + 3 * (triPanelH + 6 * sc) + 8 * sc;
      ctx.lineWidth = 1.2;
      // Pointed leaf cluster at bottom
      for (let a = -2; a <= 2; a++) {
        drawLeaf(ctx, cx, finY, 10 * sc, Math.PI / 2 + a * 0.35, stroke, fillLight);
      }
      drawFlower(ctx, cx, finY, 6 * sc, 5, stroke, fill);
      break;
    }
  }

  ctx.restore();
}

// ── Check if pattern is a neckline design ──
const NECKLINE_PATTERNS = new Set(["neck-royal", "neck-ornate", "neck-botanical", "neck-floral", "neck-heritage"]);

export default function FabricCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    fabricType, baseColor, patternId, patternScale, patternRotation, zoom,
    fabricPrintSku, fabricPrintScale,
  } = useCustomizerStore();

  // Track loaded print image so canvas re-renders when it arrives
  const [printImage, setPrintImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!fabricPrintSku) { setPrintImage(null); return; }
    const cw = getColourway(fabricPrintSku);
    if (!cw) { setPrintImage(null); return; }
    let cancelled = false;
    loadPrintImage(cw.colourway.url)
      .then((img) => { if (!cancelled) setPrintImage(img); })
      .catch(() => { if (!cancelled) setPrintImage(null); });
    return () => { cancelled = true; };
  }, [fabricPrintSku]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // ── Background ──
    ctx.fillStyle = "#F0EBE6";
    ctx.fillRect(0, 0, w, h);

    // ── Floor shadow ──
    const shadow = ctx.createRadialGradient(w / 2, h * 0.95, 0, w / 2, h * 0.95, w * 0.38);
    shadow.addColorStop(0, "rgba(0,0,0,0.07)");
    shadow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = shadow;
    ctx.fillRect(0, 0, w, h);

    // ── Draw jalabiya ──
    ctx.save();
    drawJalabiyaPath(ctx, w, h);
    ctx.clip();

    // Zoom
    if (zoom !== 1) {
      ctx.translate(w / 2, h / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-w / 2, -h / 2);
    }

    const rng = createRng(hashSeed(fabricType + baseColor));

    // Layer 1: Body fabric — either tiled print (if selected) or solid colour
    if (fabricPrintSku && printImage && printImage.naturalWidth > 0) {
      // Tile size: a Liberty print tile reads naturally at ~1/6 of canvas
      // height. Scale slider multiplies this.
      const tileH = (h / 6) * fabricPrintScale;
      const aspect = printImage.naturalWidth / printImage.naturalHeight;
      const tileW = tileH * aspect;

      // Draw tile to an offscreen canvas at target tile dimensions, then
      // use createPattern on the scaled version (much faster than relying
      // on pattern transform which has inconsistent browser support).
      const off = document.createElement("canvas");
      off.width = Math.max(2, Math.round(tileW));
      off.height = Math.max(2, Math.round(tileH));
      const offCtx = off.getContext("2d");
      if (offCtx) {
        offCtx.drawImage(printImage, 0, 0, off.width, off.height);
        const pattern = ctx.createPattern(off, "repeat");
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(-w, -h, w * 3, h * 3);
        } else {
          // Fallback to solid
          ctx.fillStyle = baseColor;
          ctx.fillRect(-w, -h, w * 3, h * 3);
        }
      }
    } else {
      // Solid colour (default path)
      ctx.fillStyle = baseColor;
      ctx.fillRect(-w, -h, w * 3, h * 3);
    }

    // Layer 2: Fabric texture (sheen/weave — works over both solid and print)
    drawWeaveTexture(ctx, w * 2, h * 2, fabricType, baseColor, rng);

    // Layer 3: All-over pattern OR neckline embroidery
    if (patternId && patternId !== "none") {
      if (NECKLINE_PATTERNS.has(patternId)) {
        drawNecklineEmbroidery(ctx, w, h, patternId, baseColor, patternScale);
      } else {
        ctx.save();
        if (patternRotation !== 0) {
          ctx.translate(w / 2, h / 2);
          ctx.rotate((patternRotation * Math.PI) / 180);
          ctx.translate(-w / 2, -h / 2);
        }
        drawPattern(ctx, w * 1.5, h * 1.5, patternId, baseColor, patternScale);
        ctx.restore();
      }
    }

    // Layer 4: Bodice highlight (light hitting chest)
    drawBodiceHighlight(ctx, w, h);

    // Layer 5: Skirt pleats (vertical drape lines)
    drawSkirtPleats(ctx, w, h, baseColor);

    // Layer 6: Waist sash
    drawWaistSash(ctx, w, h, baseColor);

    // Layer 7: Sleeve cuff bands
    drawSleeveCuffs(ctx, w, h, baseColor);

    // Layer 8: Side shadows (darken edges for 3D drape)
    drawSideShadows(ctx, w, h);

    // Layer 9: Vertical drape gradient (top→bottom soft highlight + floor contact)
    const drape = ctx.createLinearGradient(0, 0, 0, h);
    drape.addColorStop(0, "rgba(255,255,255,0.06)");
    drape.addColorStop(0.25, "rgba(0,0,0,0)");
    drape.addColorStop(0.7, "rgba(0,0,0,0.04)");
    drape.addColorStop(1, "rgba(0,0,0,0.12)");
    ctx.fillStyle = drape;
    ctx.fillRect(-w, -h, w * 3, h * 3);

    ctx.restore();

    // ── Construction: center front seam (clipped to kaftan) ──
    ctx.save();
    drawJalabiyaPath(ctx, w, h);
    ctx.clip();
    drawConstructionLines(ctx, w, h);
    ctx.restore();

    // ── Outline — thin, dimensional ──
    drawJalabiyaPath(ctx, w, h);
    ctx.strokeStyle = "rgba(0,0,0,0.18)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Inner highlight stroke (subtle rim light on left side)
    ctx.save();
    drawJalabiyaPath(ctx, w, h);
    ctx.clip();
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.5;
    ctx.translate(-1, 0);
    ctx.stroke();
    ctx.restore();

  }, [fabricType, baseColor, patternId, patternScale, patternRotation, zoom, fabricPrintSku, fabricPrintScale, printImage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => render());
    observer.observe(container);
    render();
    return () => observer.disconnect();
  }, [render]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px] overflow-hidden bg-[#F0EBE6] rounded-sm">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
