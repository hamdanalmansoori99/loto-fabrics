"""
One-off extraction script for the Cosie Liberty 2026 catalog PDFs.

Inputs:  all *.pdf files in SOURCE_DIR (7 PDFs, 3x3 grid of swatches per page)
Outputs:
  - public/designs/cosie/<pdf-shortname>/<SKU>.jpg          (full-size, ~500px)
  - public/designs/cosie/<pdf-shortname>/thumbs/<SKU>.jpg   (thumb, ~175px)
  - src/lib/print-catalog.ts                                (typed TS manifest)

Usage:  python scripts/extract-cosie-swatches.py
"""
from __future__ import annotations
import json
import math
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image, ImageFilter

# ─── Config ────────────────────────────────────────────────────────────
SOURCE_DIR = Path(r"C:\Users\yesha\Downloads\new colors")
PROJECT_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = PROJECT_ROOT / "public" / "designs" / "cosie"
MANIFEST_TS = PROJECT_ROOT / "src" / "lib" / "print-catalog.ts"

RENDER_DPI = 240          # quality for the cropped swatches
FULL_LONG_EDGE = 500
THUMB_LONG_EDGE = 175
FULL_JPEG_QUALITY = 85
THUMB_JPEG_QUALITY = 72

# SKU layout constants — verified against sample pages of all 7 PDFs:
# page at 240 DPI == 1984 x 2808 px.  Each swatch cell is placed in a 3x3 grid
# between y≈75 (row1 top) and y≈2590 (row3 bottom).  We crop a slightly
# inside-safe box per cell to avoid catching the SKU label beneath it.
# Values are fractions of the rendered page size so they work at any DPI.
CELL_COLS_FRACTION = [
    (0.074, 0.342),   # left cell x0/x1
    (0.366, 0.633),   # middle cell
    (0.658, 0.925),   # right cell
]

# Row bottoms are dynamic — calculated from the SKU label y-positions per page.
# SKU labels sit at the bottom of each swatch row; we crop from (prev_label_bottom + margin)
# to (this_row_label_top - margin). Margin in pt ≈ 4 (keeps a tiny gap).
ROW_LABEL_MARGIN_PT = 4.0
# Page top margin (skip the "Shaoxing Cosie Textile Co., Ltd" header)
PAGE_TOP_MARGIN_PT = 85.0


# ─── Short names for PDF files ─────────────────────────────────────────
def pdf_shortname(path: Path) -> str:
    """COSIE LIBERTY 2026-14.pdf -> liberty-14"""
    m = re.search(r"LIBERTY\s+\d+-(\d+)", path.name, re.IGNORECASE)
    return f"liberty-{m.group(1)}" if m else path.stem.lower().replace(" ", "-")


# ─── SKU extraction from PDF text layer ────────────────────────────────
SKU_RE = re.compile(r"CPLB\d+")


def skus_and_label_rows_from_page(page: fitz.Page) -> tuple[list[str], list[tuple[float, float]]]:
    """
    Return (SKUs in row-major order, label_row_bounds) for a 3×3-grid page.
    label_row_bounds is a list of (y0, y1) in PDF points, one per row of SKU labels.
    """
    skus: list[str] = []
    label_rows: list[tuple[float, float]] = []
    tb = page.get_text("blocks")
    for b in tb:
        x0, y0, x1, y1, text, _, _ = b
        # A SKU-label block contains only lines matching CPLB\d+
        lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
        if lines and all(SKU_RE.fullmatch(ln) for ln in lines):
            label_rows.append((y0, y1))
            skus.extend(lines)
    # Sort label rows top-to-bottom
    label_rows.sort(key=lambda b: b[0])
    return skus[:9], label_rows[:3]


# ─── Cell cropping ─────────────────────────────────────────────────────
def crop_cells(
    page_img: Image.Image,
    page_rect: fitz.Rect,
    label_rows: list[tuple[float, float]],
) -> list[Image.Image]:
    """
    Crop 9 cells using dynamic row bottoms from the SKU label positions.
    Columns are fixed fractions (stable across pages).
    """
    W, H = page_img.size
    pt_to_px_y = H / page_rect.height

    # Derive row y-bounds (pt) from label positions:
    # row 1 top = PAGE_TOP_MARGIN;     row 1 bottom = label_rows[0].y0 - margin
    # row 2 top = label_rows[0].y1 + m; row 2 bottom = label_rows[1].y0 - margin
    # row 3 top = label_rows[1].y1 + m; row 3 bottom = label_rows[2].y0 - margin
    if len(label_rows) < 3:
        raise ValueError(f"Expected 3 label rows, got {len(label_rows)}")

    m = ROW_LABEL_MARGIN_PT
    row_pt_bounds = [
        (PAGE_TOP_MARGIN_PT, label_rows[0][0] - m),
        (label_rows[0][1] + m, label_rows[1][0] - m),
        (label_rows[1][1] + m, label_rows[2][0] - m),
    ]

    cells: list[Image.Image] = []
    for (row_y0_pt, row_y1_pt) in row_pt_bounds:
        y0 = int(row_y0_pt * pt_to_px_y)
        y1 = int(row_y1_pt * pt_to_px_y)
        for (col_x0_f, col_x1_f) in CELL_COLS_FRACTION:
            x0 = int(col_x0_f * W)
            x1 = int(col_x1_f * W)
            cells.append(page_img.crop((x0, y0, x1, y1)))
    return cells


# ─── Auto-categorisation ───────────────────────────────────────────────
# Rule-based classifier using lightweight PIL features. Returns one of:
# "floral" | "wave" | "geometric" | "paisley" | "animal" | "abstract"
def classify_swatch(img: Image.Image) -> tuple[str, float]:
    """Return (category, confidence).

    Rules ordered so that common categories (floral) check first with generous
    thresholds. The catalog is predominantly floral so that's our default
    success case; only swatches that visibly don't fit fall through to the
    more-specific rules.
    """
    small = img.resize((64, 64)).convert("RGB")
    hsv = small.convert("HSV")
    pixels = list(small.getdata())
    hsv_pixels = list(hsv.getdata())

    # 1) Distinct hue count — 16 bins, generous 2% threshold
    hue_counts = [0] * 16
    for h, s, v in hsv_pixels:
        if s > 25 and v > 30:   # ignore near-grays & near-blacks
            hue_counts[h // 16] += 1
    total_coloured = sum(hue_counts) or 1
    distinct_hues = sum(1 for b in hue_counts if b / total_coloured > 0.02)

    # 2) Edge density
    edges = small.convert("L").filter(ImageFilter.FIND_EDGES)
    edge_vals = list(edges.getdata())
    edge_density = sum(1 for v in edge_vals if v > 40) / 4096.0

    # 3) Banding (horizontal vs vertical luminance variance)
    lum = small.convert("L")
    lum_pixels = list(lum.getdata())
    row_means = [sum(lum_pixels[r * 64:(r + 1) * 64]) / 64 for r in range(64)]
    col_means = [sum(lum_pixels[c::64]) / 64 for c in range(64)]
    row_var = _variance(row_means)
    col_var = _variance(col_means)
    banding = row_var / (col_var + 1e-6)   # >1 = horizontal bands

    # 4) Mean saturation
    avg_sat = sum(s for _, s, _ in hsv_pixels) / len(hsv_pixels)

    # ─── Rule ladder — specific shapes first, floral default ───

    # Wave: strong horizontal banding + smooth/low edges + limited hues
    if banding > 2.8 and edge_density < 0.38 and distinct_hues <= 7:
        return ("wave", min(1.0, banding / 5.0))

    # Geometric: very high edge density with balanced axes (repeated grid)
    if edge_density > 0.58 and 0.7 < banding < 1.4:
        return ("geometric", min(1.0, edge_density))

    # Animal: limited hues + low saturation + organic but sparse edges
    if distinct_hues <= 2 and avg_sat < 75 and edge_density < 0.42:
        return ("animal", 0.55)

    # Paisley: very dense multi-hue pattern with slight banding asymmetry
    if edge_density > 0.50 and distinct_hues >= 8 and banding < 1.1:
        return ("paisley", 0.6)

    # Floral (default for multi-hue + edgy): this is the catalog majority
    if distinct_hues >= 4 and edge_density >= 0.22:
        return ("floral", 0.75)

    # Fallback: abstract
    return ("abstract", 0.4)


def _variance(xs: list[float]) -> float:
    if not xs:
        return 0.0
    m = sum(xs) / len(xs)
    return sum((x - m) ** 2 for x in xs) / len(xs)


# ─── Family grouping via SKU numeric proximity ─────────────────────────
# Rule: SKUs whose numeric parts are contiguous within a gap <= 1 belong to the
# same family. CPLB12252..12257 (step=1) = family; 12270..12272 = next family.
def group_families(all_swatches: list[dict]) -> list[dict]:
    """Group swatches into design families using page boundaries + SKU gaps.

    Families don't span pages (catalog-page boundaries are strong signals).
    Within a page, any SKU gap >= 4 or family-size >= 9 closes the family.
    """
    # Bucket by (pdfStem, page)
    by_page = defaultdict(list)
    for s in all_swatches:
        by_page[(s["pdfStem"], s["pageIdx"])].append(s)

    families: list[dict] = []
    family_counter = 0

    for (_pdf, _page), swatches in sorted(by_page.items()):
        swatches.sort(key=lambda s: int(re.search(r"\d+", s["sku"]).group()))

        current_family: list[dict] = []
        prev_num: int | None = None
        for s in swatches:
            num = int(re.search(r"\d+", s["sku"]).group())
            gap_too_wide = prev_num is not None and num - prev_num >= 4
            at_capacity = len(current_family) >= 9
            if gap_too_wide or at_capacity:
                families.append(_finalize_family(current_family, family_counter))
                family_counter += 1
                current_family = []
            current_family.append(s)
            prev_num = num
        if current_family:
            families.append(_finalize_family(current_family, family_counter))
            family_counter += 1

    return families


def _finalize_family(members: list[dict], idx: int) -> dict:
    # Majority-vote category
    cats = Counter(m["category"] for m in members)
    top_cat, _ = cats.most_common(1)[0]
    default = members[0]
    return {
        "id": f"fam-{idx:04d}",
        "pdfStem": default["pdfStem"],
        "category": top_cat,
        "defaultSku": default["sku"],
        "motifName": f"Liberty {default['pdfStem'].split('-')[-1]} · {default['sku']}",
        "colourways": [
            {
                "sku": m["sku"],
                "url": m["url"],
                "thumbUrl": m["thumbUrl"],
                "autoCategory": m["category"],
            }
            for m in members
        ],
    }


# ─── TypeScript manifest emitter ───────────────────────────────────────
def write_manifest(families: list[dict]) -> None:
    by_category: dict[str, list[str]] = defaultdict(list)
    for f in families:
        by_category[f["category"]].append(f["id"])

    MANIFEST_TS.parent.mkdir(parents=True, exist_ok=True)

    # Emit as a simple, tree-shakeable TS module
    ts_lines = [
        "// AUTO-GENERATED by scripts/extract-cosie-swatches.py — do not edit by hand.",
        "// Source: Shaoxing Cosie Textile Co., Ltd — Cosie Liberty 2026 catalog.",
        "",
        "export type PrintCategory =",
        '  | "floral"',
        '  | "wave"',
        '  | "geometric"',
        '  | "paisley"',
        '  | "animal"',
        '  | "abstract";',
        "",
        "export interface PrintColourway {",
        "  sku: string;",
        "  url: string;",
        "  thumbUrl: string;",
        "  autoCategory: PrintCategory;",
        "}",
        "",
        "export interface PrintFamily {",
        "  id: string;",
        "  pdfStem: string;",
        "  category: PrintCategory;",
        "  defaultSku: string;",
        "  motifName: string;",
        "  colourways: PrintColourway[];",
        "}",
        "",
        f"export const PRINT_FAMILIES: PrintFamily[] = {json.dumps(families, indent=2)};",
        "",
        "export const PRINT_BY_CATEGORY: Record<PrintCategory, string[]> = {",
    ]
    for cat in ["floral", "wave", "geometric", "paisley", "animal", "abstract"]:
        ids = by_category.get(cat, [])
        ts_lines.append(f"  {cat}: {json.dumps(ids)},")
    ts_lines += [
        "};",
        "",
        "export function getFamily(id: string): PrintFamily | undefined {",
        "  return PRINT_FAMILIES.find((f) => f.id === id);",
        "}",
        "",
        "export function getColourway(sku: string): { family: PrintFamily; colourway: PrintColourway } | undefined {",
        "  for (const f of PRINT_FAMILIES) {",
        "    const cw = f.colourways.find((c) => c.sku === sku);",
        "    if (cw) return { family: f, colourway: cw };",
        "  }",
        "  return undefined;",
        "}",
        "",
    ]
    MANIFEST_TS.write_text("\n".join(ts_lines), encoding="utf-8")


# ─── Main extraction loop ──────────────────────────────────────────────
def main() -> int:
    if not SOURCE_DIR.exists():
        print(f"ERROR: source dir not found: {SOURCE_DIR}", file=sys.stderr)
        return 1

    pdfs = sorted(SOURCE_DIR.glob("*.pdf"))
    if not pdfs:
        print(f"ERROR: no PDFs in {SOURCE_DIR}", file=sys.stderr)
        return 1

    print(f"Found {len(pdfs)} PDFs in {SOURCE_DIR}")
    all_swatches: list[dict] = []

    for pdf_path in pdfs:
        stem = pdf_shortname(pdf_path)
        out_full = OUTPUT_DIR / stem
        out_thumb = out_full / "thumbs"
        out_full.mkdir(parents=True, exist_ok=True)
        out_thumb.mkdir(parents=True, exist_ok=True)

        doc = fitz.open(pdf_path)
        print(f"  {pdf_path.name}  →  {stem}  ({len(doc)} pages)")

        for page_idx, page in enumerate(doc):
            skus, label_rows = skus_and_label_rows_from_page(page)
            if not skus:
                print(f"    p{page_idx+1}: no SKUs found, skipping")
                continue
            if len(label_rows) < 3:
                print(f"    p{page_idx+1}: only {len(label_rows)} label rows (need 3), skipping")
                continue

            pix = page.get_pixmap(dpi=RENDER_DPI)
            page_img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)

            try:
                cells = crop_cells(page_img, page.rect, label_rows)
            except ValueError as e:
                print(f"    p{page_idx+1}: skip — {e}")
                continue

            if len(skus) > len(cells):
                print(f"    p{page_idx+1}: WARN {len(skus)} SKUs but only {len(cells)} cells — truncating")
                skus = skus[:len(cells)]

            for sku, cell in zip(skus, cells):
                # Resize to full-size long edge
                full = _resize_long_edge(cell, FULL_LONG_EDGE)
                thumb = _resize_long_edge(cell, THUMB_LONG_EDGE)

                full_path = out_full / f"{sku}.jpg"
                thumb_path = out_thumb / f"{sku}.jpg"
                full.save(full_path, "JPEG", quality=FULL_JPEG_QUALITY, optimize=True)
                thumb.save(thumb_path, "JPEG", quality=THUMB_JPEG_QUALITY, optimize=True)

                cat, conf = classify_swatch(cell)
                all_swatches.append({
                    "sku": sku,
                    "pdfStem": stem,
                    "pageIdx": page_idx,
                    "url": f"/designs/cosie/{stem}/{sku}.jpg",
                    "thumbUrl": f"/designs/cosie/{stem}/thumbs/{sku}.jpg",
                    "category": cat,
                    "confidence": round(conf, 2),
                })

        doc.close()

    print(f"\nExtracted {len(all_swatches)} swatches.")

    # Group into families and write manifest
    families = group_families(all_swatches)
    print(f"Grouped into {len(families)} design families.")

    cat_counts = Counter(f["category"] for f in families)
    for cat, n in sorted(cat_counts.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {n} families")

    write_manifest(families)
    print(f"\nManifest written to {MANIFEST_TS}")
    return 0


def _resize_long_edge(img: Image.Image, target: int) -> Image.Image:
    w, h = img.size
    if w >= h:
        new_w = target
        new_h = int(h * target / w)
    else:
        new_h = target
        new_w = int(w * target / h)
    return img.resize((new_w, new_h), Image.Resampling.LANCZOS)


if __name__ == "__main__":
    sys.exit(main())
