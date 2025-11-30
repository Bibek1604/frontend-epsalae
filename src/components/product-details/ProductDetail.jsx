// src/pages/ProductDetail.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  Star, ShoppingCart, Heart, Share2, Truck, Shield, 
  RotateCcw, Loader2, ChevronRight, Minus, Plus, Check, Package, Zap 
} from 'lucide-react'
import { useCart } from '@/store/cartstore'
import { productApi } from '../api/productapi'
import { getImageUrl } from '@/config'
import { motion } from 'framer-motion'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
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

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return
    
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-6 text-gray-400 animate-spin" />
          <p className="text-lg text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6 bg-gray-50">
        <div className="max-w-md text-center">
          <Package className="w-24 h-24 mx-auto mb-8 text-gray-200" />
          <h2 className="mb-4 text-4xl font-light text-gray-900">Product Not Found</h2>
          <p className="mb-10 text-gray-600">This item may be discontinued or unavailable.</p>
          <button
            onClick={() => navigate('/products')}
            className="px-10 py-4 font-medium text-white transition bg-gray-900 rounded-full hover:bg-gray-800"
          >
            Browse Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Clean Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-5 mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/products" className="hover:text-gray-900">Products</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="max-w-md font-medium text-gray-900 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="px-6 py-12 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

          {/* Image Section */}
          <div className="relative">
            {/* Discount Badge */}
            {discountPercent > 0 && (
              <div className="absolute z-10 top-6 left-6">
                <span className="flex items-center gap-2 px-5 py-2 text-lg font-bold text-white bg-red-600 rounded-full shadow-xl">
                  <Zap className="w-5 h-5" /> {discountPercent}% OFF
                </span>
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute z-10 p-4 transition-all bg-white rounded-full shadow-lg top-6 right-6 hover:shadow-xl"
            >
              <Heart className={`w-6 h-6 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>

            {/* Main Image */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="overflow-hidden bg-white border border-gray-200 aspect-square rounded-3xl"
            >
              <img
                src={mainImage}
                alt={product.name}
                className="object-contain w-full h-full transition-all duration-1000 grayscale hover:grayscale-0"
                onError={(e) => e.target.src = 'https://via.placeholder.com/800'}
              />
            </motion.div>

            {/* Low Stock Alert */}
            {product.stock > 0 && product.stock < 10 && (
              <div className="p-4 mt-6 text-center border border-red-200 bg-red-50 rounded-xl">
                <p className="flex items-center justify-center gap-2 font-semibold text-red-700">
                  <Zap className="w-5 h-5" /> Only {product.stock} left in stock — order soon!
                </p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Stock */}
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">
                  {product.category?.name || 'Uncategorized'}
                </span>
                {product.stock > 0 ? (
                  <span className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    In Stock
                  </span>
                ) : (
                  <span className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-200 rounded-full">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="mb-6 text-4xl font-light leading-tight text-gray-900 lg:text-5xl">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-6 h-6 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-gray-600">(4.0 • 128 reviews)</span>
              </div>

              {/* Price */}
              <div className="pb-8 mb-10 border-b border-gray-200">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-light text-gray-900">
                    ₹{(product.discountPrice > 0 ? product.discountPrice : product.price).toLocaleString()}
                  </span>
                  {product.discountPrice > 0 && (
                    <span className="text-2xl text-gray-400 line-through">
                      ₹{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-10">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">About this item</h3>
                  <p className="text-lg leading-relaxed text-gray-600">{product.description}</p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-10">
                <p className="mb-4 text-sm font-medium text-gray-700">Quantity</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center overflow-hidden border-2 border-gray-300 rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-4 transition hover:bg-gray-50"
                      disabled={product.stock === 0}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-20 text-xl font-semibold text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="p-4 transition hover:bg-gray-50"
                      disabled={product.stock === 0}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {product.stock > 0 && (
                    <span className="text-gray-500">{product.stock} available</span>
                  )}
                </div>
              </div>

              {/* Action Buttons - GREEN & RED STRATEGY */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {/* GREEN = Add to Cart (Trust + Success) */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`py-5 rounded-xl font-semibold text-white rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3 text-lg ${
                    isAdded 
                      ? 'bg-emerald-600 hover:bg-emerald-700' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  } ${product.stock === 0 && 'bg-gray-300 cursor-not-allowed'}`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-6 h-6" /> Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-6 h-6" /> Add to Cart
                    </>
                  )}
                </button>

                {/* RED = Buy Now (Urgency + Highest Conversion) */}
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex items-center justify-center gap-3 px-8 py-5 text-lg font-semibold text-white transition-all transform bg-red-600 shadow-lg hover:bg-red-700 rounded-xl hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Zap className="w-6 h-6" /> Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-6 p-8 bg-gray-50 rounded-2xl">
                <div className="text-center">
                  <div className="p-4 mx-auto mb-3 bg-green-100 rounded-xl w-fit">
                    <Truck className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="font-medium text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-500">Over ₹5,000</p>
                </div>
                <div className="text-center">
                  <div className="p-4 mx-auto mb-3 bg-amber-100 rounded-xl w-fit">
                    <RotateCcw className="w-8 h-8 text-amber-600" />
                  </div>
                  <p className="font-medium text-gray-900">7-Day Returns</p>
                  <p className="text-sm text-gray-500">No questions asked</p>
                </div>
                <div className="text-center">
                  <div className="p-4 mx-auto mb-3 bg-indigo-100 rounded-xl w-fit">
                    <Shield className="w-8 h-8 text-indigo-600" />
                  </div>
                  <p className="font-medium text-gray-900">Secure Payment</p>
                  <p className="text-sm text-gray-500">100% Protected</p>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <button className="flex items-center gap-2 mx-auto mt-8 font-medium text-gray-600 hover:text-gray-900">
              <Share2 className="w-5 h-5" /> Share Product
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}