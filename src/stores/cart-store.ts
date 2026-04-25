import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import { calculateVat } from "@/lib/format";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateMeters: (productId: string, meters: number, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getVat: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

/** Per-line price helper — switches by priceMode. */
function lineTotal(item: CartItem): number {
  if (item.priceMode === "per_meter") {
    return (item.pricePerMeter ?? 0) * (item.meters ?? 0);
  }
  if (item.priceMode === "per_piece") {
    return (item.pricePerPiece ?? 0) * (item.quantity ?? 0);
  }
  return 0;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) => {
                if (i.productId !== item.productId || i.variantId !== item.variantId) {
                  return i;
                }
                if (i.priceMode === "per_meter") {
                  return { ...i, meters: (i.meters ?? 0) + (item.meters ?? 0) };
                }
                if (i.priceMode === "per_piece") {
                  return { ...i, quantity: (i.quantity ?? 0) + (item.quantity ?? 1) };
                }
                return i;
              }),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),

      updateMeters: (productId, meters, variantId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId && i.priceMode === "per_meter"
              ? { ...i, meters: Math.max(1, meters) }
              : i
          ),
        })),

      updateQuantity: (productId, quantity, variantId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId && i.priceMode === "per_piece"
              ? { ...i, quantity: Math.max(1, quantity) }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getSubtotal: () => get().items.reduce((sum, item) => sum + lineTotal(item), 0),

      getVat: () => calculateVat(get().getSubtotal()),

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return subtotal + calculateVat(subtotal);
      },

      getItemCount: () => get().items.length,
    }),
    { name: "loto-cart" }
  )
);

/** Compute a single cart line's total — exported for cart/checkout pages. */
export function cartLineTotal(item: CartItem): number {
  return lineTotal(item);
}
