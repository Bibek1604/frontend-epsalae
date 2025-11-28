import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoggedIn: false,

      login: (token, user) => {
        set({ token, user, isLoggedIn: true });
      },

      logout: () => {
        set({ token: null, user: null, isLoggedIn: false });
      },

      setToken: (token) => {
        set({ token, isLoggedIn: !!token });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
