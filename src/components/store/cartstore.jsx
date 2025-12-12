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
        
        // Show animated toast notification
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? 'animate-enter' : 'animate-leave'
              } max-w-sm w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}
              style={{
                animation: t.visible 
                  ? 'slideIn 0.3s ease-out, pulse 0.5s ease-in-out 0.3s 2'
                  : 'slideOut 0.3s ease-in'
              }}
            >
              {/* Green accent bar */}
              <div className="w-2 bg-gradient-to-b from-green-400 to-green-600" />
              
              <div className="flex items-center flex-1 gap-4 p-4">
                {/* Animated checkmark */}
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full shrink-0">
                  <svg 
                    className="w-6 h-6 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ animation: 'checkmark 0.4s ease-out 0.2s both' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-gray-900">Added to Cart! 🛒</p>
                  <p className="mt-0.5 text-sm text-gray-500 truncate">{product.name}</p>
                </div>
                
                {/* Close button */}
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors rounded-full shrink-0 hover:bg-gray-100 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ),
          {
            duration: 3000,
            position: 'top-right',
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