// Single source of truth for Loto Fabrics contact details.
// Update here once and every page that imports stays in sync.

export const WHATSAPP_NUMBER_INTL = "971544666629";
export const WHATSAPP_NUMBER_DISPLAY = "+971 54 466 6629";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER_INTL}`;

export const LOCATION_EN = "Abu Dhabi · UAE";
export const LOCATION_AR = "أبوظبي · الإمارات";

export const INSTAGRAM_HANDLE = "@LOTO_AE";
export const INSTAGRAM_URL = "https://instagram.com/loto_ae";

/** Build a wa.me URL with a pre-filled message body. */
export function whatsappLink(message: string): string {
  return `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;
}
