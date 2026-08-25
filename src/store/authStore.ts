import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'laundrymall-auth',
    }
  )
);
