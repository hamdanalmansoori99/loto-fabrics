import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import { calculateVat } from "@/lib/format";

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateMeters: (productId: string, meters: number, variantId?: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getVat: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productId === item.productId && i.variantId === item.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantId === item.variantId
                  ? { ...i, meters: i.meters + item.meters }
                  : i
              ),
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
            i.productId === productId && i.variantId === variantId
              ? { ...i, meters: Math.max(1, meters) }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.pricePerMeter * item.meters,
          0
        );
      },

      getVat: () => {
        return calculateVat(get().getSubtotal());
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return subtotal + calculateVat(subtotal);
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "loto-cart",
    }
  )
);
