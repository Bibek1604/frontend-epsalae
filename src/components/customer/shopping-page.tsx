// src/pages/ShoppingPage.tsx
// Main shopping page integrating product list and cart sidebar

import React, { useState, useEffect } from 'react';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import ProductList from '@/components/ProductList';
import CartSidebar from '@/components/CartSidebar';
import useCartApi from '@/hooks/useCartApi';
import './shopping-page.css';

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
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  variants: { _id: string; sku: string; name: string; attributes: Record<string, string>; price: number }[];
  category: string;
}

export const ShoppingPage: React.FC = () => {
  const { cart, loading, error, getCart, addToCart, updateQuantity, removeFromCart, clearCart } =
    useCartApi();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Load cart on component mount
  useEffect(() => {
    const loadCart = async () => {
      try {
        await getCart();
      } finally {
        setPageLoading(false);
      }
    };
    loadCart();
  }, [getCart]);

  // Show toast notifications
  useEffect(() => {
    if (error) {
      setToast({ type: 'error', message: error });
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle add to cart from product list
  const handleAddToCart = async (product: Product, variant: { _id: string; sku: string; name: string; attributes: Record<string, string>; price: number }, quantity: number) => {
    try {
      await addToCart(
        product._id,
        variant._id,
        product.name,
        variant.sku,
        variant.price,
        quantity,
        product.image,
        variant.attributes
      );
      setToast({
        type: 'success',
        message: `${product.name} added to cart!`,
      });
      // Open cart to show the item was added
      setTimeout(() => setIsCartOpen(true), 300);
    } catch (err) {
      setToast({
        type: 'error',
        message: 'Failed to add item to cart. Please try again.',
      });
    }
  };

  // Handle update quantity in sidebar
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
      setToast({
        type: 'success',
        message: 'Quantity updated',
      });
    } catch (err) {
      setToast({
        type: 'error',
        message: 'Failed to update quantity',
      });
    }
  };

  // Handle remove from cart
  const handleRemoveFromCart = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      setToast({
        type: 'success',
        message: 'Item removed from cart',
      });
    } catch (err) {
      setToast({
        type: 'error',
        message: 'Failed to remove item',
      });
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    setIsCartOpen(false);
    // Navigate to checkout page (to be implemented)
    // navigate('/checkout');
    window.location.href = '/checkout';
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="shopping-page">
      {/* Header */}
      <header className="shopping-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🛍️ Shop</h1>
            <p>Discover our premium collection of products</p>
          </div>
          <div className="header-right">
            <button
              className={`cart-button ${cartItemCount > 0 ? 'has-items' : ''}`}
              onClick={() => setIsCartOpen(!isCartOpen)}
              title="Open shopping cart"
            >
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-content">
            {toast.type === 'error' && <AlertCircle size={20} />}
            <span>{toast.message}</span>
          </div>
          <button
            className="toast-close"
            onClick={() => setToast(null)}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="shopping-main">
        {pageLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading shop...</p>
          </div>
        ) : (
          <ProductList
            onAddToCart={handleAddToCart}
            onAddToWishlist={() => {
              setToast({
                type: 'success',
                message: 'Added to wishlist',
              });
            }}
            isLoading={loading}
          />
        )}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        isLoading={loading}
      />
    </div>
  );
};

export default ShoppingPage;
