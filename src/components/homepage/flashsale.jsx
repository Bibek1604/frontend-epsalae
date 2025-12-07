import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Clock, ShoppingCart, Heart, ArrowRight, Loader2 } from 'lucide-react'
import { useFlashSaleStore } from '../store/flashsalestore'
import { useCart } from '@/store/cartstore'
import { getImageUrl } from '@/config'
import toast from 'react-hot-toast'

// Placeholder for failed images
const PLACEHOLDER = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'

export default function FlashSale() {
  const navigate = useNavigate()
  const { flashSales, loading, fetchFlashSales } = useFlashSaleStore()
  const { addToCart } = useCart()
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    fetchFlashSales()
  }, [fetchFlashSales])

  // Get active flash sale
  const activeFlashSale = flashSales?.find(fs => fs.isActive) || flashSales?.[0]
  const saleProducts = activeFlashSale?.products || []

  // Countdown timer
  useEffect(() => {
    if (!activeFlashSale?.endDate) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const end = new Date(activeFlashSale.endDate).getTime()
      const difference = end - now

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [activeFlashSale])

  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    if (product.stock > 0) {
      addToCart({
        id: product.id || product._id,
        name: product.name,
        price: product.salePrice || product.discountPrice || product.price,
        image: product.imageUrl,
        quantity: 1
      })
    } else {
      toast.error('This product is out of stock')
    }
  }

  // Don't render if no flash sales or products
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35]">
        <div className="flex justify-center">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      </section>
    )
  }

  if (!activeFlashSale || saleProducts.length === 0) {
    return null
  }

  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-r from-[#1A3C8A] via-[#2d4a9a] to-[#FF6B35]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute w-96 h-96 bg-white/5 rounded-full -top-48 -left-48"
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute w-64 h-64 bg-white/5 rounded-full -bottom-32 -right-32"
        />
      </div>

      <div className="relative px-6 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-6 mb-12 md:flex-row">
          <div className="text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-bold text-white rounded-full bg-white/20 backdrop-blur-sm"
            >
              <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
              Limited Time Offer
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-white md:text-5xl"
            >
              {activeFlashSale.title || 'Flash Sale'}
            </motion.h2>
            <p className="mt-2 text-lg text-white/80">{activeFlashSale.description || 'Grab these deals before they\'re gone!'}</p>
          </div>

          {/* Countdown Timer */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4"
          >
            <Clock className="w-8 h-8 text-yellow-400" />
            <div className="flex gap-3">
              {[
                { value: timeLeft.hours, label: 'HRS' },
                { value: timeLeft.minutes, label: 'MIN' },
                { value: timeLeft.seconds, label: 'SEC' }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 text-2xl font-black text-[#1A3C8A] bg-white rounded-xl shadow-lg">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <span className="mt-1 text-xs font-bold text-white/80">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Products Horizontal Scroll */}
        <div className="flex gap-6 pb-4 overflow-x-auto scrollbar-hide">
          {saleProducts.slice(0, 6).map((product, index) => (
            <motion.div
              key={product._id || product.id || index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/product/${product.id || product._id}`)}
              className="flex-shrink-0 overflow-hidden transition-all bg-white shadow-xl cursor-pointer w-72 rounded-2xl hover:shadow-2xl group"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-square bg-gray-50">
                <img
                  src={getImageUrl(product.imageUrl) || PLACEHOLDER}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = PLACEHOLDER }}
                />
                
                {/* Discount Badge */}
                {product.discountPrice && product.price > product.discountPrice && (
                  <span className="absolute px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-lg top-3 left-3 shadow-lg">
                    -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </span>
                )}

                {/* Wishlist */}
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute p-2 transition-all bg-white rounded-full shadow-lg opacity-0 top-3 right-3 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500"
                >
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="mb-2 font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl font-black text-[#FF6B35]">
                    Rs. {(product.salePrice || product.discountPrice || product.price).toLocaleString()}
                  </span>
                  {product.price > (product.salePrice || product.discountPrice || 0) && (
                    <span className="text-sm text-gray-400 line-through">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full py-3 font-bold text-white transition-all rounded-xl bg-gradient-to-r from-[#FF6B35] to-orange-500 hover:shadow-lg hover:shadow-orange-500/30 btn-press flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-10 text-center"
        >
          <button 
            onClick={() => navigate('/products?sale=true')}
            className="inline-flex items-center gap-2 px-8 py-4 font-bold text-[#1A3C8A] transition-all bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 btn-press"
          >
            View All Deals
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
