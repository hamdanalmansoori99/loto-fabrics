import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface SavedDesign {
  id: string;
  name: string;
  fabricType: string;
  baseColor: string;
  patternId: string | null;
  patternScale: number;
  patternRotation: number;
  createdAt: number;
}

export interface CustomizerState {
  // Active design
  fabricType: string;
  baseColor: string;
  patternId: string | null;
  patternScale: number;
  patternRotation: number;
  zoom: number;

  // Fabric print (Cosie Liberty catalog). When set, replaces solid baseColor
  // as the kaftan body fabric. Mutually exclusive with solid colour.
  fabricPrintSku: string | null;
  fabricPrintScale: number;

  // Saved designs
  savedDesigns: SavedDesign[];

  // Actions
  setFabricType: (type: string) => void;
  setBaseColor: (color: string) => void;
  setPatternId: (id: string | null) => void;
  setPatternScale: (scale: number) => void;
  setPatternRotation: (rotation: number) => void;
  setZoom: (zoom: number) => void;
  reset: () => void;

  // Print actions
  setFabricPrint: (sku: string | null) => void;
  setFabricPrintScale: (scale: number) => void;
  clearFabricPrint: () => void;

  // Saved designs actions
  saveCurrent: (name?: string) => SavedDesign;
  loadDesign: (id: string) => void;
  deleteDesign: (id: string) => void;

  // Share URL
  loadFromQueryString: (searchParams: URLSearchParams) => void;
  toShareParams: () => string;
}

const defaults = {
  fabricType: "silk",
  baseColor: "#F5E6D3",
  patternId: null,
  patternScale: 1,
  patternRotation: 0,
  zoom: 1,
  fabricPrintSku: null as string | null,
  fabricPrintScale: 1,
};

export const useCustomizerStore = create<CustomizerState>()(
  persist(
    (set, get) => ({
      ...defaults,
      savedDesigns: [],

      setFabricType: (fabricType) => set({ fabricType }),
      // Setting a solid color clears any active print (mutual exclusion)
      setBaseColor: (baseColor) => set({ baseColor, fabricPrintSku: null }),
      setPatternId: (patternId) => set({ patternId }),
      setPatternScale: (patternScale) => set({ patternScale }),
      setPatternRotation: (patternRotation) => set({ patternRotation }),
      setZoom: (zoom) => set({ zoom }),
      reset: () => set(defaults),

      // Fabric print actions — mutually exclusive with solid colour
      setFabricPrint: (sku) => set({ fabricPrintSku: sku }),
      setFabricPrintScale: (fabricPrintScale) => set({ fabricPrintScale }),
      clearFabricPrint: () => set({ fabricPrintSku: null }),

      saveCurrent: (name) => {
        const state = get();
        const design: SavedDesign = {
          id: `d_${Date.now()}_${Math.floor(Math.random() * 1e6).toString(36)}`,
          name: name || `Design ${state.savedDesigns.length + 1}`,
          fabricType: state.fabricType,
          baseColor: state.baseColor,
          patternId: state.patternId,
          patternScale: state.patternScale,
          patternRotation: state.patternRotation,
          createdAt: Date.now(),
        };
        set({ savedDesigns: [design, ...state.savedDesigns].slice(0, 20) });
        return design;
      },

      loadDesign: (id) => {
        const d = get().savedDesigns.find((s) => s.id === id);
        if (!d) return;
        set({
          fabricType: d.fabricType,
          baseColor: d.baseColor,
          patternId: d.patternId,
          patternScale: d.patternScale,
          patternRotation: d.patternRotation,
        });
      },

      deleteDesign: (id) =>
        set((state) => ({ savedDesigns: state.savedDesigns.filter((s) => s.id !== id) })),

      loadFromQueryString: (params) => {
        const ft = params.get("f");
        const bc = params.get("c");
        const pi = params.get("p");
        const ps = params.get("s");
        const pr = params.get("r");
        const fp = params.get("fp");
        const fps = params.get("fps");
        if (ft) set({ fabricType: ft });
        if (bc) set({ baseColor: `#${bc}` });
        if (pi !== null) set({ patternId: pi === "" ? null : pi });
        if (ps) set({ patternScale: parseFloat(ps) });
        if (pr) set({ patternRotation: parseInt(pr, 10) });
        if (fp !== null) set({ fabricPrintSku: fp === "" ? null : fp });
        if (fps) set({ fabricPrintScale: parseFloat(fps) });
      },

      toShareParams: () => {
        const s = get();
        const params = new URLSearchParams();
        params.set("f", s.fabricType);
        params.set("c", s.baseColor.replace("#", ""));
        if (s.patternId) params.set("p", s.patternId);
        params.set("s", s.patternScale.toString());
        params.set("r", s.patternRotation.toString());
        if (s.fabricPrintSku) {
          params.set("fp", s.fabricPrintSku);
          params.set("fps", s.fabricPrintScale.toString());
        }
        return params.toString();
      },
    }),
    {
      name: "loto-customizer",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        fabricType: state.fabricType,
        baseColor: state.baseColor,
        patternId: state.patternId,
        patternScale: state.patternScale,
        patternRotation: state.patternRotation,
        fabricPrintSku: state.fabricPrintSku,
        fabricPrintScale: state.fabricPrintScale,
        savedDesigns: state.savedDesigns,
      }),
    }
  )
);

export const FABRIC_CONFIGS: Record<
  string,
  { texture: string; opacity: number; sheen: number; label: string }
> = {
  silk: { texture: "silk", opacity: 0.15, sheen: 0.4, label: "Silk" },
  cotton: { texture: "cotton", opacity: 0.25, sheen: 0.05, label: "Cotton" },
  linen: { texture: "linen", opacity: 0.35, sheen: 0.02, label: "Linen" },
  velvet: { texture: "velvet", opacity: 0.3, sheen: 0.15, label: "Velvet" },
  chiffon: { texture: "chiffon", opacity: 0.1, sheen: 0.2, label: "Chiffon" },
  organza: { texture: "organza", opacity: 0.08, sheen: 0.5, label: "Organza" },
  tulle: { texture: "tulle", opacity: 0.06, sheen: 0.15, label: "Tulle" },
};

// Refined preset palette — aligned with brand (warm neutrals, brand pinks, statement jewels)
export const PRESET_COLORS = [
  "#F6EFE9", "#F3DED7", "#E8C4B8", "#D4A99B", "#B88777", "#8B6F4E",
  "#331E07", "#5C4A38", "#9A8472",
  "#F5E6D3", "#E8D5B7", "#FADADD",
  "#7A2B2F", "#B8D4E3", "#C5B4E3", "#D4E8C5",
];

export const PATTERNS = [
  { id: "none", nameEn: "Solid", nameAr: "سادة", category: "solid" },
  { id: "neck-royal", nameEn: "Royal Neckline", nameAr: "تطريز ملكي", category: "neckline" },
  { id: "neck-ornate", nameEn: "Ornate Neckline", nameAr: "تطريز مزخرف", category: "neckline" },
  { id: "neck-botanical", nameEn: "Botanical Vine", nameAr: "كرمة نباتية", category: "neckline" },
  { id: "neck-floral", nameEn: "Floral Neckline", nameAr: "تطريز زهري", category: "neckline" },
  { id: "neck-heritage", nameEn: "Heritage Panel", nameAr: "لوحة تراثية", category: "neckline" },
  { id: "stripes", nameEn: "Stripes", nameAr: "خطوط", category: "geometric" },
  { id: "chevron", nameEn: "Chevron", nameAr: "شيفرون", category: "geometric" },
  { id: "dots", nameEn: "Polka Dots", nameAr: "نقاط", category: "geometric" },
  { id: "diamond", nameEn: "Diamond", nameAr: "ماسي", category: "geometric" },
  { id: "floral-small", nameEn: "Small Floral", nameAr: "زهور صغيرة", category: "floral" },
  { id: "floral-large", nameEn: "Large Floral", nameAr: "زهور كبيرة", category: "floral" },
  { id: "arabesque", nameEn: "Arabesque", nameAr: "أرابيسك", category: "traditional" },
  { id: "geometric-islamic", nameEn: "Islamic Geometric", nameAr: "هندسي إسلامي", category: "traditional" },
  { id: "paisley", nameEn: "Paisley", nameAr: "بيزلي", category: "traditional" },
];
