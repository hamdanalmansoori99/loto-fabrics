import { whatsappLink } from "./contact";
import { getColourway } from "./print-catalog";

interface DesignParams {
  fabricType: string;
  baseColor: string;
  patternId: string | null;
  patternScale: number;
  patternRotation: number;
  fabricPrintSku: string | null;
  locale: string;
}

const PATTERN_LABELS: Record<string, string> = {
  "neck-royal": "Royal Neckline",
  "neck-ornate": "Ornate Neckline",
  "neck-botanical": "Botanical Vine",
  "neck-floral": "Floral Neckline",
  "neck-heritage": "Heritage Panel",
  "stripes": "Stripes",
  "chevron": "Chevron",
  "dots": "Polka Dots",
  "diamond": "Diamond",
  "floral-small": "Small Floral",
  "floral-large": "Large Floral",
  "arabesque": "Arabesque",
  "geometric-islamic": "Islamic Geometric",
  "paisley": "Paisley",
};

/**
 * Build the WhatsApp message body for a Design Studio configuration.
 * Returns a plain string (not URL-encoded — the caller wraps in whatsappLink()).
 */
export function buildDesignStudioMessage(params: DesignParams): string {
  const lines: string[] = [];
  lines.push("Hi Loto Fabrics, I'd like you to fulfill this design from your studio:");
  lines.push("");
  lines.push(`• Fabric: ${capitalize(params.fabricType)}`);

  if (params.fabricPrintSku) {
    const cw = getColourway(params.fabricPrintSku);
    if (cw) {
      lines.push(`• Print: ${params.fabricPrintSku} (${cw.family.motifName})`);
    } else {
      lines.push(`• Print: ${params.fabricPrintSku}`);
    }
  } else {
    lines.push(`• Colour: ${params.baseColor}`);
  }

  if (params.patternId) {
    const label = PATTERN_LABELS[params.patternId] ?? params.patternId;
    lines.push(
      `• Embroidery: ${label} (scale ${params.patternScale.toFixed(2)}×, rotation ${params.patternRotation}°)`
    );
  }

  lines.push("");
  lines.push("Could you confirm pricing and lead time? Thanks.");
  return lines.join("\n");
}

/** Build a WhatsApp message body to inquire about a specific product. */
export function buildProductInquiryMessage(productNameEn: string, slug: string): string {
  return [
    `Hi Loto Fabrics, I'm interested in this piece:`,
    "",
    `• ${productNameEn}`,
    `• https://lotofabrics.ae/en/products/${slug}`,
    "",
    "Could you share the price and availability? Thanks.",
  ].join("\n");
}

/** Build the full wa.me URL for a Design Studio config. */
export function designStudioWhatsappLink(params: DesignParams): string {
  return whatsappLink(buildDesignStudioMessage(params));
}

/** Build the full wa.me URL for a product inquiry. */
export function productInquiryWhatsappLink(productNameEn: string, slug: string): string {
  return whatsappLink(buildProductInquiryMessage(productNameEn, slug));
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
