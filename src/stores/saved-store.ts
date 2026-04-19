import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedState {
  savedIds: string[];
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;
  clearSaved: () => void;
  getCount: () => number;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedIds: [],
      toggleSaved: (id) =>
        set((state) => ({
          savedIds: state.savedIds.includes(id)
            ? state.savedIds.filter((s) => s !== id)
            : [...state.savedIds, id],
        })),
      isSaved: (id) => get().savedIds.includes(id),
      clearSaved: () => set({ savedIds: [] }),
      getCount: () => get().savedIds.length,
    }),
    { name: "loto-saved" }
  )
);
