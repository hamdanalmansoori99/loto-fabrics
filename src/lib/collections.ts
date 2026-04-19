import type { Collection, ColorFamily } from "@/types/product";

export const COLLECTIONS: { id: Collection; nameEn: string; nameAr: string; descriptionEn: string; descriptionAr: string }[] = [
  {
    id: "bridal",
    nameEn: "Bridal",
    nameAr: "العرائس",
    descriptionEn: "Heirloom fabrics for the most storied day.",
    descriptionAr: "أقمشة موروثة لأهم يوم في حياتك.",
  },
  {
    id: "occasion",
    nameEn: "Eid & Occasion",
    nameAr: "العيد والمناسبات",
    descriptionEn: "Statement cloth for celebrations that matter.",
    descriptionAr: "أقمشة مميزة لاحتفالاتك المهمة.",
  },
  {
    id: "everyday",
    nameEn: "Everyday Luxe",
    nameAr: "الفخامة اليومية",
    descriptionEn: "Refined fabrics for considered daily wear.",
    descriptionAr: "أقمشة راقية للارتداء اليومي المدروس.",
  },
  {
    id: "essentials",
    nameEn: "Essentials",
    nameAr: "الأساسيات",
    descriptionEn: "Solid-dyed foundations for bespoke creation.",
    descriptionAr: "أساسيات مصبوغة سادة للتصميم حسب الطلب.",
  },
];

export const COLOR_FAMILIES: { id: ColorFamily; nameEn: string; nameAr: string; hex: string }[] = [
  { id: "cream", nameEn: "Cream", nameAr: "كريمي", hex: "#F3E6D7" },
  { id: "pink", nameEn: "Pink", nameAr: "وردي", hex: "#E8C4B8" },
  { id: "gold", nameEn: "Gold", nameAr: "ذهبي", hex: "#C9A26B" },
  { id: "burgundy", nameEn: "Burgundy", nameAr: "عنابي", hex: "#7A2B2F" },
  { id: "blue", nameEn: "Blue", nameAr: "أزرق", hex: "#9FB5C7" },
  { id: "neutral", nameEn: "Neutral", nameAr: "حيادي", hex: "#9A8472" },
];

export function getCollection(id: Collection) {
  return COLLECTIONS.find((c) => c.id === id);
}

export function getColorFamily(id: ColorFamily) {
  return COLOR_FAMILIES.find((c) => c.id === id);
}
