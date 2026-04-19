export type Collection = "bridal" | "occasion" | "everyday" | "essentials";
export type ColorFamily = "cream" | "pink" | "gold" | "burgundy" | "blue" | "neutral";

export interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  slug: string;
  descriptionEn: string;
  descriptionAr: string;
  pricePerMeter: number;
  compareAtPrice?: number;
  minOrderMeters: number;
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
