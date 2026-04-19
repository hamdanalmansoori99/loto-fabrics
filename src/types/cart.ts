export interface CartItem {
  productId: string;
  variantId?: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  image: string;
  pricePerMeter: number;
  meters: number;
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
