// src/store/cartStore.js  (with localStorage)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i._id === product._id || i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                (i._id === product._id || i.id === product.id) ? { ...i, quantity: i.quantity + (product.quantity || 1) } : i
              ),
            };
          }
          return { items: [...state.items, { ...product, quantity: product.quantity || 1 }] };
        });
        
        // Show toast notification
        toast.success(
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">Added to Cart!</p>
              <p className="text-sm text-gray-500 truncate max-w-[180px]">{product.name}</p>
            </div>
          </div>,
          {
            duration: 2500,
            style: {
              padding: '12px 16px',
              borderRadius: '12px',
              background: '#fff',
              boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            },
          }
        );
      },

      removeFromCart: (id) =>
        set((state) => ({ items: state.items.filter((i) => i._id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i._id === id ? { ...i, quantity } : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      getTotalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getTotalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'epasaley-cart-v1',
    }
  )
);