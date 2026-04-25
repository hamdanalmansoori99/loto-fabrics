import type { PriceMode } from "./product";

export interface CartItem {
  productId: string;
  variantId?: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  image: string;

  // Pricing — same shape as Product. Exactly one of {pricePerMeter+meters, pricePerPiece+quantity}
  priceMode: PriceMode;     // "per_meter" | "per_piece"  (on_request never reaches the cart)
  pricePerMeter?: number;
  pricePerPiece?: number;
  meters?: number;          // used for per_meter
  quantity?: number;        // used for per_piece (1+ pieces)

  color?: string;
  colorName?: string;
  customDesignId?: string;
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  vat: number;
  shipping: number;
  total: number;
}
