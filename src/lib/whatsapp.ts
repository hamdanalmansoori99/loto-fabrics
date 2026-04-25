import { whatsappLink } from "./contact";
import { getColourway } from "./print-catalog";

interface DesignParams {
  fabricType: string;
  baseColor: string;          // unused in current message but kept for type compat
  patternId: string | null;   // unused — embroidery picker has been removed
  patternScale: number;        // unused
  patternRotation: number;     // unused
  fabricPrintSku: string | null;
  locale: string;
}

/**
 * Build the WhatsApp message body for a Design Studio configuration.
 * Simplified flow: fabric + print only (no embroidery, no colour, no scale).
 */
export function buildDesignStudioMessage(params: DesignParams): string {
  const lines: string[] = [];
  lines.push("Hi Loto Fabrics, I'd like to enquire about this design from your studio:");
  lines.push("");
  lines.push(`• Fabric: ${capitalize(params.fabricType)}`);

  if (params.fabricPrintSku) {
    const cw = getColourway(params.fabricPrintSku);
    if (cw) {
      lines.push(`• Print: ${params.fabricPrintSku} (${cw.family.motifName})`);
    } else {
      lines.push(`• Print: ${params.fabricPrintSku}`);
    }
  }

  lines.push("");
  lines.push("Could you confirm availability and lead time? Thanks.");
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
    "Could you share availability and shipping details? Thanks.",
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
