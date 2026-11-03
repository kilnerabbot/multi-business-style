import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  ids: string[];
  has: (id: string) => boolean;
  setIds: (ids: string[]) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      setIds: (ids) => set({ ids: Array.from(new Set(ids)) }),
      add: (id) => set((s) => (s.ids.includes(id) ? s : { ids: [id, ...s.ids] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
    }),
    { name: "mbs-wishlist" }
  )
);
