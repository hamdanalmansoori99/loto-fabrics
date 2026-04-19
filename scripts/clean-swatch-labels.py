"""
QC pass: scan every extracted Cosie Liberty swatch and auto-crop any that
still have an SKU label bleeding in at the bottom.

Detection strategy: the SKU labels appear as a horizontal band of
low-pixel-variance pixels (either a solid cream/white background with
small dark text, or a uniform strip extending across the full width).
Actual fabric pattern has high spatial variance at every scale.

We scan the bottom 20% of each swatch row-by-row from the bottom up.
If a row has very low horizontal variance (few distinct colours), we mark
it as "label band". The first row from the bottom where variance returns
to normal is the crop line.

Usage:   python scripts/clean-swatch-labels.py
"""
from __future__ import annotations
import sys
from pathlib import Path
from statistics import pstdev
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DESIGNS_DIR = ROOT / "public" / "designs" / "cosie"

# Thresholds
SCAN_BOTTOM_FRACTION = 0.22   # only consider the bottom 22% of the image
LOW_VARIANCE_THRESHOLD = 14.0 # luminance stdev below this = uniform band
CONSECUTIVE_LOW_ROWS = 4      # need ≥ N consecutive low-variance rows to call it a label
MIN_LABEL_HEIGHT_PX = 10       # band must be at least this tall
FULL_JPEG_QUALITY = 85
THUMB_JPEG_QUALITY = 72
THUMB_LONG_EDGE = 175


def row_luminance_stdev(img: Image.Image, y: int) -> float:
    """Return stdev of luminance for a single row y."""
    w = img.width
    row_box = (0, y, w, y + 1)
    row_crop = img.crop(row_box).convert("L")
    pixels = list(row_crop.getdata())
    if not pixels:
        return 0.0
    return pstdev(pixels)


def detect_label_top(img: Image.Image) -> int | None:
    """
    Returns the y-coordinate where the bottom label band starts (top of the
    label), or None if no label detected. Scans bottom-up, marking rows as
    "low variance". A label band = CONSECUTIVE_LOW_ROWS or more of them ending
    at or near the image bottom.
    """
    h = img.height
    scan_from = int(h * (1.0 - SCAN_BOTTOM_FRACTION))

    # Collect luminance stdev for each row in the scan region
    low_rows: list[int] = []
    for y in range(h - 1, scan_from - 1, -1):
        sd = row_luminance_stdev(img, y)
        if sd < LOW_VARIANCE_THRESHOLD:
            low_rows.append(y)
        else:
            # Non-low row — if we've collected enough, label band found
            if len(low_rows) >= CONSECUTIVE_LOW_ROWS:
                top_of_band = min(low_rows)
                if (h - top_of_band) >= MIN_LABEL_HEIGHT_PX:
                    return top_of_band
            # Otherwise keep scanning upward (reset the run)
            low_rows = []

    # Edge case: entire scan region is low-variance (whole bottom is label)
    if len(low_rows) >= CONSECUTIVE_LOW_ROWS:
        top_of_band = min(low_rows)
        if (h - top_of_band) >= MIN_LABEL_HEIGHT_PX:
            return top_of_band

    return None


def resize_long_edge(img: Image.Image, target: int) -> Image.Image:
    w, h = img.size
    if w >= h:
        new_w = target
        new_h = int(h * target / w)
    else:
        new_h = target
        new_w = int(w * target / h)
    return img.resize((new_w, new_h), Image.Resampling.LANCZOS)


def main() -> int:
    if not DESIGNS_DIR.exists():
        print(f"ERROR: {DESIGNS_DIR} not found", file=sys.stderr)
        return 1

    all_swatches = sorted(DESIGNS_DIR.rglob("*.jpg"))
    # Only scan FULL swatches, not thumbs
    full_swatches = [p for p in all_swatches if p.parent.name != "thumbs"]

    print(f"Scanning {len(full_swatches)} full swatches...")

    scanned = 0
    fixed = 0
    clean = 0
    skipped = 0

    for path in full_swatches:
        scanned += 1
        try:
            img = Image.open(path).convert("RGB")
        except Exception as e:
            print(f"  SKIP {path}: {e}")
            skipped += 1
            continue

        label_top = detect_label_top(img)
        if label_top is None:
            clean += 1
            continue

        # Crop off the label band
        cropped = img.crop((0, 0, img.width, label_top))

        # Re-save full + thumb with same filename
        thumb_path = path.parent / "thumbs" / path.name
        cropped.save(path, "JPEG", quality=FULL_JPEG_QUALITY, optimize=True)
        thumb = resize_long_edge(cropped, THUMB_LONG_EDGE)
        thumb_path.parent.mkdir(parents=True, exist_ok=True)
        thumb.save(thumb_path, "JPEG", quality=THUMB_JPEG_QUALITY, optimize=True)

        fixed += 1
        if fixed <= 8:
            rel = path.relative_to(DESIGNS_DIR)
            print(f"  fixed {rel}  (cropped at y={label_top}/{img.height})")

    print()
    print(f"Done. Scanned {scanned}, cleaned {fixed}, already clean {clean}, skipped {skipped}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
