import type { Collection, ColorFamily } from "@/types/product";

export const COLLECTIONS: { id: Collection; nameEn: string; nameAr: string; descriptionEn: string; descriptionAr: string }[] = [
  {
    id: "thyban",
    nameEn: "Thybans",
    nameAr: "ثيبان",
    descriptionEn: "Hand-embroidered occasion thybans, made for the days that matter.",
    descriptionAr: "ثيبان مطرزة يدوياً للمناسبات المهمة.",
  },
  {
    id: "jalabya",
    nameEn: "Jalabiyas",
    nameAr: "جلابيات",
    descriptionEn: "Everyday flowing jalabiyas. Inquire on WhatsApp.",
    descriptionAr: "جلابيات يومية انسيابية. استفسر عبر واتساب.",
  },
];

export const COLOR_FAMILIES: { id: ColorFamily; nameEn: string; nameAr: string; hex: string }[] = [
  { id: "cream", nameEn: "Cream", nameAr: "كريمي", hex: "#F3E6D7" },
  { id: "pink", nameEn: "Pink", nameAr: "وردي", hex: "#E8C4B8" },
  { id: "gold", nameEn: "Gold", nameAr: "ذهبي", hex: "#C9A26B" },
  { id: "burgundy", nameEn: "Burgundy", nameAr: "عنابي", hex: "#7A2B2F" },
  { id: "red", nameEn: "Red", nameAr: "أحمر", hex: "#A02C2C" },
  { id: "blue", nameEn: "Blue", nameAr: "أزرق", hex: "#9FB5C7" },
  { id: "green", nameEn: "Green", nameAr: "أخضر", hex: "#3F6F4A" },
  { id: "black", nameEn: "Black", nameAr: "أسود", hex: "#1F1F1F" },
  { id: "neutral", nameEn: "Neutral", nameAr: "حيادي", hex: "#9A8472" },
];

export function getCollection(id: Collection) {
  return COLLECTIONS.find((c) => c.id === id);
}

export function getColorFamily(id: ColorFamily) {
  return COLOR_FAMILIES.find((c) => c.id === id);
}
