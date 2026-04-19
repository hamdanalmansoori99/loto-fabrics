import { CURRENCY, UAE_VAT_RATE } from "./constants";

export function formatPrice(amount: number, locale: string = "en"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-AE" : "en-AE", {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateVat(subtotal: number): number {
  return Math.round(subtotal * UAE_VAT_RATE * 100) / 100;
}

export function calculateTotal(subtotal: number, shipping: number = 0): number {
  const vat = calculateVat(subtotal);
  return Math.round((subtotal + vat + shipping) * 100) / 100;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function localize(item: any, field: string, locale: string): string {
  const key = locale === "ar" ? `${field}Ar` : `${field}En`;
  return (item[key] as string) || (item[`${field}En`] as string) || "";
}
