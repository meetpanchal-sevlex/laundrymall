import { create } from 'zustand';

interface UIStore {
  isMobileDrawerOpen: boolean;
  setMobileDrawerOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileDrawerOpen: false,
  setMobileDrawerOpen: (isOpen) => set({ isMobileDrawerOpen: isOpen }),
}));
