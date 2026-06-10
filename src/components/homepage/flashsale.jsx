import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Clock, ShoppingCart, Heart, ArrowRight, Flame, Tag } from 'lucide-react'
import { useFlashSaleStore } from '../store/flashsalestore'
import { useCart } from '@/store/cartstore'
import { getImageUrl } from '@/config'
import { formatProductName } from '@/lib/utils'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'

// Digit flip for countdown
function CountdownDigit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute countdown-digit text-xl sm:text-2xl font-black text-white tabular-nums"
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1.5 text-[10px] font-bold text-white/60 uppercase tracking-widest">{label}</span>
    </div>
  )
}

// Skeleton flash sale card
function SkeletonFlashCard() {
  return (
    <div className="flex-shrink-0 w-60 sm:w-68 bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden">
      <div className="aspect-square skeleton opacity-30" />
      <div className="p-4 space-y-2.5">
        <div className="h-4 skeleton rounded-full opacity-30 w-3/4" />
        <div className="h-5 skeleton rounded-full opacity-30 w-1/2" />
        <div className="h-10 skeleton rounded-xl opacity-30" />
      </div>
    </div>
  )
}

export default function FlashSale() {
  const navigate = useNavigate()
  const { flashSales, loading, fetchActiveFlashSales: fetchFlashSales } = useFlashSaleStore()
  const { addToCart } = useCart()
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [addedIds, setAddedIds] = useState(new Set())

  useEffect(() => { fetchFlashSales() }, [fetchFlashSales])

  const activeFlashSale = flashSales?.find(fs => fs.isActive) || flashSales?.[0]
  const saleProducts = activeFlashSale?.products || []

  useEffect(() => {
    if (!activeFlashSale?.endDate) return
    const tick = () => {
      const diff = new Date(activeFlashSale.endDate).getTime() - Date.now()
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [activeFlashSale])

  const handleAddToCart = (e, product) => {
    e.stopPropagation()
    const pid = product.id || product._id
    if ((product.stock || 0) > 0) {
      addToCart({ id: pid, name: product.name, price: product.salePrice || product.discountPrice || product.price, image: product.imageUrl, quantity: 1 })
      setAddedIds(s => new Set([...s, pid]))
      toast.success('Flash deal added!', { icon: '⚡', style: { borderRadius: '12px', fontWeight: 600 } })
      setTimeout(() => setAddedIds(s => { const n = new Set(s); n.delete(pid); return n; }), 2000)
    } else {
      toast.error('Out of stock')
    }
  }

  if (loading) {
    return (
      <section className="py-8 sm:py-14 bg-gradient-to-r from-[#1A3C8A] via-[#232f6e] to-[#FF6B35]">
        <div className="px-4 mx-auto max-w-7xl sm:px-6">
          <div className="flex gap-5 pb-4 overflow-x-auto scrollbar-hide">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonFlashCard key={i} />)}
          </div>
        </div>
      </section>
    )
  }

  if (!activeFlashSale || saleProducts.length === 0) return null

  return (
    <section className="relative py-10 sm:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f5c] via-[#1A3C8A] to-[#c0392b]" />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,107,53,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)'
      }} />
      {/* Sparkle dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div key={i}
          className="absolute w-1.5 h-1.5 bg-white/30 rounded-full"
          style={{ left: `${10 + i * 11}%`, top: `${15 + (i % 3) * 25}%` }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      <div className="relative px-4 mx-auto max-w-7xl sm:px-6">
        {/* Header Row */}
        <div className="flex flex-col gap-5 mb-8 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full">
              <Flame className="w-4 h-4 text-orange-300" />
              <span className="text-xs font-extrabold text-white uppercase tracking-widest">Flash Sale</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              {activeFlashSale.title || '⚡ Lightning Deals'}
            </h2>
            <p className="mt-1 text-sm text-white/60 font-medium">
              {activeFlashSale.description || "Grab these deals before time runs out!"}
            </p>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 mr-1">
              <Clock className="w-5 h-5 text-orange-300" />
              <span className="text-xs font-bold text-white/70">Ends in</span>
            </div>
            <div className="flex gap-2">
              <CountdownDigit value={timeLeft.hours} label="HRS" />
              <span className="text-white font-black text-xl self-start mt-3">:</span>
              <CountdownDigit value={timeLeft.minutes} label="MIN" />
              <span className="text-white font-black text-xl self-start mt-3">:</span>
              <CountdownDigit value={timeLeft.seconds} label="SEC" />
            </div>
          </div>
        </div>

        {/* Products Scroll */}
        <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {saleProducts.slice(0, 8).map((product, index) => {
            const pid = product.id || product._id
            const salePrice = product.salePrice || product.discountPrice || product.price
            const discountPct = product.price > salePrice
              ? Math.round(((product.price - salePrice) / product.price) * 100)
              : 0
            const stockPct = Math.min(100, Math.max(5, ((product.stock || 5) / 30) * 100))
            const isAdded = addedIds.has(pid)

            return (
              <motion.div
                key={pid || index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.08, 0.4) }}
                onClick={() => navigate(`/product/${pid}`)}
                className="flex-shrink-0 w-56 sm:w-64 bg-white rounded-3xl overflow-hidden cursor-pointer group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 snap-start border border-white/20"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100 aspect-square flex items-center justify-center p-4">
                  <img
                    src={getImageUrl(product.imageUrl) || PLACEHOLDER}
                    alt={product.name}
                    className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110"
                    onError={e => { e.target.src = PLACEHOLDER }}
                  />
                  {discountPct > 0 && (
                    <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-xl shadow-md flex items-center gap-1 badge-flash">
                      <Tag className="w-3 h-3" /> -{discountPct}%
                    </div>
                  )}
                  <button
                    onClick={e => e.stopPropagation()}
                    className="absolute top-2.5 right-2.5 p-2 bg-white/90 rounded-full shadow text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  {(product.stock || 0) === 0 && (
                    <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-full">Sold Out</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#1A3C8A] transition-colors mb-2">
                    {formatProductName(product.name)}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-extrabold text-[#FF6B35]">Rs. {salePrice.toLocaleString()}</span>
                    {discountPct > 0 && (
                      <span className="text-xs text-gray-400 line-through">Rs. {product.price.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Stock bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] font-bold mb-1">
                      <span className="text-gray-500">Stock: {product.stock || 0}</span>
                      {(product.stock || 0) <= 5 && (
                        <span className="text-red-500 animate-pulse">Almost gone!</span>
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${stockPct}%`,
                          background: stockPct < 25 ? '#ef4444' : stockPct < 60 ? '#f97316' : '#22c55e'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={e => handleAddToCart(e, product)}
                    disabled={(product.stock || 0) === 0}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all btn-press ${
                      isAdded
                        ? 'bg-green-600 text-white'
                        : (product.stock || 0) > 0
                          ? 'bg-gradient-to-r from-[#1A3C8A] to-[#2d4ea8] text-white hover:from-[#FF6B35] hover:to-orange-500 hover:shadow-md'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isAdded ? '✓ Added!' : <><ShoppingCart className="w-3.5 h-3.5" /> Add to Cart</>}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* View All */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 px-8 py-3.5 font-bold text-[#1A3C8A] bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all btn-press text-sm"
          >
            <Zap className="w-4 h-4 text-orange-500" />
            View All Flash Deals
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
