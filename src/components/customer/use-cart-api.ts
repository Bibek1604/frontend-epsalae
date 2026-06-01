// src/hooks/useCartApi.ts
// Custom hook for managing cart API interactions

import { useState, useCallback } from 'react';
import { API_BASE_URL } from '@/config';

interface CartItem {
  _id: string;
  productId: string;
  variantId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  attributes?: Record<string, string>;
  saveForLater?: boolean;
}

interface CartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    _id: string;
    items: CartItem[];
    itemsCount: number;
    subtotal: number;
    status: string;
  };
  timestamp?: string;
}

interface UseCartApiReturn {
  cart: CartItem[];
  loading: boolean;
  error: string | null;
  getCart: () => Promise<void>;
  addToCart: (
    productId: string,
    variantId: string,
    name: string,
    sku: string,
    price: number,
    quantity: number,
    image: string,
    attributes?: Record<string, string>
  ) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartCount: () => Promise<number>;
}

const CART_API = `${API_BASE_URL}/api/v1/cart`;

export const useCartApi = (): UseCartApiReturn => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get authorization header
  const getAuthHeaders = (): HeadersInit => {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add JWT token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  };

  // Fetch cart
  const getCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${CART_API}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data: CartResponse = await response.json();
      setCart(data.data.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cart';
      setError(errorMessage);
      console.error('Cart API Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add item to cart
  const addToCart = useCallback(
    async (
      productId: string,
      variantId: string,
      name: string,
      sku: string,
      price: number,
      quantity: number,
      image: string,
      attributes?: Record<string, string>
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${CART_API}/items`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            productId,
            variantId,
            name,
            sku,
            price,
            quantity,
            image,
            attributes,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add item to cart');
        }

        const data: CartResponse = await response.json();
        setCart(data.data.items || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to add item to cart';
        setError(errorMessage);
        console.error('Add to Cart Error:', errorMessage);
        throw err; // Re-throw to allow component-level handling
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update item quantity
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${CART_API}/items/${itemId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update quantity');
      }

      const data: CartResponse = await response.json();
      setCart(data.data.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update quantity';
      setError(errorMessage);
      console.error('Update Quantity Error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${CART_API}/items/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove item');
      }

      const data: CartResponse = await response.json();
      setCart(data.data.items || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove item';
      setError(errorMessage);
      console.error('Remove Item Error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${CART_API}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clear cart');
      }

      setCart([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      console.error('Clear Cart Error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get cart count
  const getCartCount = useCallback(async (): Promise<number> => {
    try {
      const response = await fetch(`${CART_API}/count`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart count');
      }

      const data = await response.json();
      return data.data?.count || 0;
    } catch (err) {
      console.error('Get Cart Count Error:', err);
      return 0;
    }
  }, []);

  return {
    cart,
    loading,
    error,
    getCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
  };
};

export default useCartApi;
