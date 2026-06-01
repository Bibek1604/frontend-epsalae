// src/components/CartSidebar/CartSidebar.tsx
// Shopping cart sidebar displaying added items

import React, { useState, useEffect } from 'react';
import { X, Trash2, Minus, Plus, ShoppingCart, ArrowRight } from 'lucide-react';
import './CartSidebar.css';

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

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  isLoading?: boolean;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  isLoading = false,
}) => {
  const [subtotal, setSubtotal] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  // Calculate subtotal and item count
  useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    setSubtotal(total);
    setItemCount(count);
  }, [items]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      onUpdateQuantity(itemId, newQuantity);
    }
  };

  const estimatedShipping = 10;
  const estimatedTax = Math.round(subtotal * 0.1 * 100) / 100;
  const estimatedTotal = subtotal + estimatedShipping + estimatedTax;

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <h2>
            <ShoppingCart size={24} />
            Shopping Cart
          </h2>
          <button
            className="close-btn"
            onClick={onClose}
            title="Close cart"
            aria-label="Close shopping cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Item Count Badge */}
        {itemCount > 0 && (
          <div className="item-count-badge">
            {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
          </div>
        )}

        {/* Items List */}
        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <ShoppingCart size={48} />
              <p>Your cart is empty</p>
              <small>Add items from the shop to get started</small>
            </div>
          ) : (
            <div className="items-list">
              {items.map((item) => (
                <div key={item._id} className="cart-item">
                  {/* Item Image */}
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  {/* Item Details */}
                  <div className="item-details">
                    {/* Name and Price */}
                    <div className="item-header">
                      <h4 className="item-name">{item.name}</h4>
                      <span className="item-price">${item.price.toFixed(2)}</span>
                    </div>

                    {/* SKU and Attributes */}
                    <div className="item-meta">
                      <small className="sku">SKU: {item.sku}</small>
                      {item.attributes && Object.keys(item.attributes).length > 0 && (
                        <div className="attributes">
                          {Object.entries(item.attributes).map(([key, value]) => (
                            <span key={key} className="attribute">
                              {key}: <strong>{value}</strong>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        className="qty-btn"
                        title="Decrease quantity"
                        disabled={isLoading}
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(item._id, parseInt(e.target.value) || 1)
                        }
                        className="qty-input"
                        disabled={isLoading}
                      />
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        className="qty-btn"
                        title="Increase quantity"
                        disabled={isLoading}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveItem(item._id)}
                      className="remove-btn"
                      title="Remove from cart"
                      disabled={isLoading}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Section */}
        {items.length > 0 && (
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Shipping</span>
              <span>${estimatedShipping.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated Tax</span>
              <span>${estimatedTax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Estimated Total</span>
              <span>${estimatedTotal.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <button
              className="checkout-btn"
              onClick={onCheckout}
              disabled={isLoading || items.length === 0}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            {/* Continue Shopping Link */}
            <button
              className="continue-shopping-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
