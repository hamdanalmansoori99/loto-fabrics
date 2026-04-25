export const UAE_VAT_RATE = 0.05;
export const CURRENCY = "AED";
export const DEFAULT_MIN_ORDER_METERS = 1;
export const COD_SURCHARGE = 15;

export const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
] as const;

export const FABRIC_TYPES = [
  "silk",
  "cotton",
  "linen",
  "velvet",
  "chiffon",
  "organza",
  "tulle",
  "satin",
] as const;

// Phone, WhatsApp link, and location now live in src/lib/contact.ts
// Instagram URL also exported from there. This file kept for VAT / currency / EMIRATES only.
