import { create } from "zustand";

interface CartStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));