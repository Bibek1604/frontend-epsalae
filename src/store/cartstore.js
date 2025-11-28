import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCart = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find(
            (item) => item.id === product.id && item.color === product.color && item.size === product.size
          )
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id && item.color === product.color && item.size === product.size
                  ? { ...item, quantity: item.quantity + product.quantity }
                  : item
              ),
            }
          }
          return { cart: [...state.cart, product] }
        }),

      removeFromCart: (id) =>
        set((state) => ({ cart: state.cart.filter((item) => item.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      getTotalPrice: () =>
        get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),

      getTotalItems: () =>
        get().cart.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'epasaley-cart-storage',
    }
  )
)
