// src/pages/Cart.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, AlertCircle, CheckCircle, X } from 'lucide-react'
import { useCart } from '@/store/cartstore'
import { promocode } from '../components/api/promocode'
import { motion, AnimatePresence } from 'framer-motion'

export default function Cart() {
  const navigate = useNavigate()
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart()
  
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  const subtotal = getTotalPrice()
  const tax = (subtotal - discount) * 0.1
  const total = subtotal - discount + tax

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }
    try {
      setCouponError('')
      setCouponSuccess('')
      const res = await promocode.validate(couponCode)
      const coupon = res.data?.data || res.data

      if (coupon && coupon.isActive) {
        setAppliedCoupon(coupon)
        setDiscount(coupon.discountAmount)
        setCouponSuccess(`Applied! Save ₹${coupon.discountAmount}`)
        setCouponCode('')
      } else {
        setCouponError('Invalid or expired coupon')
      }
    } catch (err) {
      setCouponError('Coupon not found or expired')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setDiscount(0)
    setCouponSuccess('')
  }

  if (cart.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <ShoppingBag className="w-20 h-20 mx-auto mb-8 text-gray-300" />
          <h2 className="mb-4 text-4xl font-light text-gray-900">Your cart is empty</h2>
          <p className="mb-10 text-gray-600">Looks like you haven’t added anything yet.</p>
          <button
            onClick={() => navigate('/products')}
            className="px-10 py-4 font-medium text-white transition bg-gray-900 rounded-full py- hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-12 mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <h1 className="text-5xl font-light text-gray-900">Shopping Cart</h1>
          <p className="mt-3 text-gray-600 mt-">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

          {/* Cart Items */}
          <div className="space-y-6 lg:col-span-2">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 transition bg-white border border-gray-200 rounded- rounded-2xl hover:border-gray-300"
              >
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-32 h-32 overflow-hidden bg-gray-100 rounded-xl">
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      className="object-cover w-full h-full transition duration-700 grayscale hover:grayscale-0"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-medium text-gray-900">{item.name}</h3>
                    
                    {(item.color || item.size) && (
                      <p className="mb-3 text-sm text-gray-500">
                        {item.color && <span>{item.color} {item.size && '• '}</span>}
                        {item.size && <span>Size {item.size}</span>}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-3 transition hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 font-medium text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-3 transition hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <span className="text-2xl font-light text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 transition rounded-lg hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="p-8 bg-white border border-gray-200 rounded-2xl">
              <h2 className="mb-8 text-2xl font-medium text-gray-900">Order Summary</h2>

              <div className="pb-8 mb-8 space-y-5 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-medium text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span>₹{tax.toFixed(0)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-10 text-2xl font-light text-gray-900">
                <span>Total</span>
                <span className="font-medium">₹{Math.round(total).toLocaleString()}</span>
              </div>

              {/* Coupon Section */}
              <div className="mb-8">
                {!appliedCoupon ? (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 px-5 py-3 transition border border-gray-300 rounded-xl focus:outline-none focus:border-gray-900"
                      onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-6 py-3 font-medium text-white transition bg-gray-900 rounded-xl hover:bg-gray-800"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-700">{appliedCoupon.code}</p>
                        <p className="text-sm text-green-600">₹{discount} saved</p>
                      </div>
                    </div>
                    <button onClick={removeCoupon} className="text-gray-500 hover:text-gray-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <AnimatePresence>
                  {couponError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 mt-3 text-sm text-red-600"
                    >
                      <AlertCircle className="w-4 h-4" /> {couponError}
                    </motion.p>
                  )}
                  {couponSuccess && !couponError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 mt-3 text-sm text-green-600"
                    >
                      <CheckCircle className="w-4 h-4" /> {couponSuccess}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 text-lg font-medium text-white transition bg-gray-900 rounded-xl hover:bg-gray-800"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full py-4 mt-4 font-medium text-gray-900 transition border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                Continue Shopping
              </button>

              {/* Trust Badge */}
              <div className="pt-8 mt-8 text-center border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Free shipping on orders over ₹10,000 • Secure checkout
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}