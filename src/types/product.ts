export type Collection = "mikhwar" | "jalabya";

export type ColorFamily =
  | "cream"
  | "pink"
  | "gold"
  | "burgundy"
  | "blue"
  | "neutral"
  | "green"
  | "red"
  | "black";

// How a product is sold:
// - per_meter:  fabric, X AED/m, requires meters slider
// - per_piece:  finished garment, fixed AED, single-quantity stepper
// - on_request: no price displayed; user must inquire on WhatsApp
export type PriceMode = "per_meter" | "per_piece" | "on_request";

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;

  // Pricing — exactly one model per product
  priceMode: PriceMode;
  pricePerMeter?: number;   // required when priceMode === "per_meter"
  pricePerPiece?: number;   // required when priceMode === "per_piece"
  compareAtPrice?: number;  // optional struck-through "was" price; works for any priceMode
  minOrderMeters?: number;  // only meaningful for "per_meter"

  sku: string;
  fabricType: string;
  fabricWeight?: string;
  fabricWidth?: string;
  composition?: string;
  careInstructions?: string;
  origin?: string;
  certifications?: string[];
  isCustomizable: boolean;
  isFeatured: boolean;
  isNew?: boolean;
  isLimited?: boolean;
  inStock: boolean;
  stockQuantity: number;
  categoryId?: string;
  category?: Category;
  collection: Collection;
  colorFamily: ColorFamily;
  styledWith?: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  publicId?: string;
  alt?: string;
  sortOrder: number;
  isMain: boolean;
}

export interface ProductVariant {
  id: string;
  color?: string;
  colorName?: string;
  size?: string;
  priceOverride?: number;
  stock: number;
}

export interface Category {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn?: string;
  descriptionAr?: string;
  image?: string;
  parentId?: string;
  sortOrder: number;
  children?: Category[];
}
