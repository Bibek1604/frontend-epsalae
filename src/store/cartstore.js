import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'

export const useCart = create(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (product) => {
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
        })
        
        // Green theme - Product added
        toast.success('Product added to cart!', {
          duration: 2500,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            padding: '14px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10B981',
          },
        })
      },

      removeFromCart: (id) => {
        set((state) => ({ cart: state.cart.filter((item) => item.id !== id) }))
        
        // Red theme - Product removed
        toast.error('Removed from cart!', {
          duration: 2500,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            padding: '14px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
          },
        })
      },

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
