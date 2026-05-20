// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  Star, ShoppingCart, Heart, Share2, Truck, Shield, 
  RotateCcw, Loader2, ChevronRight, Minus, Plus, Check, Package, Zap, BadgeCheck, Clock, Sparkles, ArrowLeft
} from 'lucide-react'
import { useCart } from '@/store/cartstore'
import { productApi } from '../api/productapi'
import { useCategoryStore } from '../store/categorystore'
import { getImageUrl } from '@/config'
import { formatProductName } from '@/lib/utils'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const PREMIUM_EASE = [0.16, 1, 0.3, 1]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { categories, fetchCategories } = useCategoryStore()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    fetchCategories() // Fetch categories to get category name
    
    const fetchProductDetail = async () => {
      try {
        const res = await productApi.getById(id)
        const data = res.data?.data || res.data
        const imageUrl = getImageUrl(data.imageUrl)
        
        setProduct(data)
        setMainImage(imageUrl)
      } catch (err) {
        console.error('Error fetching product:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProductDetail()
  }, [id])

  // Helper to get category name
  const getCategoryName = () => {
    if (!product) return 'General'
    
    // If category is populated as object with name
    if (product.category?.name) return product.category.name
    
    // Get category ID from various possible fields
    const catId = product.category_id || product.categoryId || product.category?._id || product.category?.id || product.category
    
    if (!catId) return 'General'
    
    // Find category by ID
    const foundCat = categories.find(c => 
      c._id === catId || c.id === catId || 
      String(c._id) === String(catId) || String(c.id) === String(catId)
    )
    
    return foundCat?.name || 'General'
  }

  const handleAddToCart = () => {
    if (!product || product.stock === 0) {
      toast.error('This product is out of stock')
      return
    }
    
    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.discountPrice > 0 ? product.discountPrice : product.price,
      image: mainImage,
      quantity: quantity,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  const discountPercent = product?.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(26,60,138,0.08),_transparent_34%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_55%,_#eef3ff_100%)] px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/70 bg-white/80 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.4)] backdrop-blur-xl">
            <Loader2 className="w-8 h-8 text-[#1A3C8A] animate-spin" />
          </div>
          <p className="text-base font-medium text-slate-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,107,53,0.08),_transparent_34%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_55%,_#eef3ff_100%)] px-6">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <Package className="w-12 h-12 text-slate-300" />
          </div>
          <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900">Product Not Found</h2>
          <p className="mb-10 text-gray-600">This item may be discontinued or unavailable.</p>
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-10 py-4 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(26,60,138,0.08),_transparent_30%),radial-gradient(circle_at_85%_15%,_rgba(255,107,53,0.08),_transparent_25%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_46%,_#eef3ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-24 h-56 w-56 rounded-full bg-[#1A3C8A]/6 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-[#FF6B35]/6 blur-3xl" />
      </div>

      {/* Clean Breadcrumb */}
      <div className="relative border-b border-white/70 bg-white/70 backdrop-blur-xl">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <nav className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-[0_10px_35px_-28px_rgba(15,23,42,0.35)] backdrop-blur-xl">
            <Link to="/" className="transition hover:text-gray-900">Home</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <Link to="/products" className="transition hover:text-gray-900">Products</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="max-w-md font-medium text-gray-900 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="relative px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: PREMIUM_EASE }}
            className="relative"
          >
            {/* Discount Badge */}
            {discountPercent > 0 && (
              <div className="absolute z-10 top-6 left-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(239,68,68,0.75)] backdrop-blur-xl">
                  <Zap className="w-4 h-4" /> {discountPercent}% OFF
                </span>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute z-10 top-6 right-6 rounded-full border border-white/70 bg-white/85 p-3.5 shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-30px_rgba(15,23,42,0.4)]"
            >
              <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
            </button>

            {/* Main Image */}
            <motion.div
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.5, ease: PREMIUM_EASE }}
              className="overflow-hidden rounded-[2rem] border border-white/80 bg-white/80 aspect-square shadow-[0_30px_90px_-50px_rgba(15,23,42,0.5)] backdrop-blur-xl"
            >
              <img
                src={mainImage}
                alt={product.name}
                className="object-contain w-full h-full p-6 transition-transform duration-700 hover:scale-[1.04]"
                onError={(e) => e.target.src = 'https://via.placeholder.com/800'}
              />
            </motion.div>

            {/* Low Stock Alert */}
            {product.stock > 0 && product.stock < 10 && (
              <div className="mt-6 rounded-[1.5rem] border border-red-200/70 bg-gradient-to-r from-red-50 to-rose-50 p-4 text-center shadow-[0_16px_40px_-28px_rgba(239,68,68,0.35)]">
                <p className="flex items-center justify-center gap-2 font-semibold text-red-700">
                  <Clock className="w-5 h-5" /> Only {product.stock} left in stock — order soon!
                </p>
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease: PREMIUM_EASE }}
            className="flex flex-col justify-between"
          >
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_80px_-52px_rgba(15,23,42,0.42)] backdrop-blur-xl sm:p-7 lg:p-8">
              {/* Category & Stock */}
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                  <Sparkles className="w-4 h-4 text-[#1A3C8A]" />
                  {getCategoryName()}
                </span>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    In Stock
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-500">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="max-w-2xl mb-4 text-4xl font-semibold leading-tight tracking-tight text-gray-900 lg:text-5xl">
                {formatProductName(product.name)}
              </h1>

              <p className="mb-8 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
                A polished product presentation with clear pricing, trusted icons, and a smoother purchase flow for a more premium shopping experience.
              </p>

              {/* Price */}
              <div className="pb-8 mb-8 border-b border-gray-200/80">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-semibold tracking-tight text-gray-900">
                    Rs. {(product.discountPrice > 0 ? product.discountPrice : product.price).toLocaleString()}
                  </span>
                  {product.discountPrice > 0 && (
                    <span className="text-2xl text-gray-400 line-through">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {discountPercent > 0 && (
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
                    <BadgeCheck className="w-4 h-4" /> You save {discountPercent}% on this order
                  </p>
                )}
              </div>

              {/* Action Buttons - GREEN & RED STRATEGY */}
              <div className="grid grid-cols-1 gap-4 mb-10 sm:grid-cols-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex items-center justify-center gap-3 rounded-2xl py-4.5 text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(16,185,129,0.7)] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none ${
                    isAdded 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" /> Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] px-8 py-4.5 text-base font-semibold text-white shadow-[0_18px_40px_-24px_rgba(26,60,138,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-25px_rgba(255,107,53,0.55)] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                >
                  <Zap className="w-5 h-5" /> Buy Now
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-10 rounded-[1.5rem] border border-slate-200/70 bg-slate-50/90 p-5 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.25)]">
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">About this item</h3>
                  <p className="text-base leading-8 text-slate-600">{product.description}</p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-10">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Quantity</p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_16px_35px_-28px_rgba(15,23,42,0.3)]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 transition hover:bg-slate-50"
                      disabled={product.stock === 0}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-20 text-center text-lg font-semibold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="p-4 transition hover:bg-slate-50"
                      disabled={product.stock === 0}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {product.stock > 0 && (
                    <span className="text-sm font-medium text-slate-500">{product.stock} available</span>
                  )}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 gap-4 rounded-[1.75rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_50px_-34px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:grid-cols-3 sm:p-6">
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50/90 p-4">
                  <div className="rounded-2xl bg-emerald-100 p-3">
                    <Truck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-500">Over ₹5,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50/90 p-4">
                  <div className="rounded-2xl bg-amber-100 p-3">
                    <RotateCcw className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">7-Day Returns</p>
                    <p className="text-sm text-gray-500">No questions asked</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-slate-50/90 p-4">
                  <div className="rounded-2xl bg-indigo-100 p-3">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Secure Payment</p>
                    <p className="text-sm text-gray-500">100% Protected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <button className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-5 py-3 font-medium text-slate-600 shadow-[0_12px_35px_-28px_rgba(15,23,42,0.3)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:text-slate-900 hover:shadow-[0_18px_45px_-28px_rgba(15,23,42,0.35)]">
              <Share2 className="w-4 h-4" /> Share Product
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}