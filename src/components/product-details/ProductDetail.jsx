import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Loader2, ChevronRight, Minus, Plus, Check, Package } from 'lucide-react'
import { useCart } from '@/store/cartstore'
import { productApi } from '../api/productapi'
import { getImageUrl } from '@/config'

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
        
        // Set up product data with proper image URL
        const imageUrl = getImageUrl(data.imageUrl)
        
        setProduct(data)
        setMainImage(imageUrl)
        
        console.log('📦 Product detail fetched:', data)
      } catch (err) {
        console.error('❌ Error fetching product detail:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetail()
  }, [id])

  const handleAddToCart = () => {
    if (product) {
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
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const discountPercent = product.discountPrice > 0 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-indigo-600 transition-colors">
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="relative bg-gray-50 p-8">
              {/* Discount Badge */}
              {discountPercent > 0 && (
                <div className="absolute top-6 left-6 z-10">
                  <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-xl shadow-lg">
                    {discountPercent}% OFF
                  </span>
                </div>
              )}
              
              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`absolute top-6 right-6 z-10 p-3 rounded-xl shadow-lg transition-all ${
                  isFavorite
                    ? 'bg-red-50 text-red-500'
                    : 'bg-white text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>

              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-white">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-10">
              {/* Category & Stock */}
              <div className="flex items-center gap-3 mb-4">
                {product.category?.name && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                    {product.category.name}
                  </span>
                )}
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    In Stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">(4.0) • 128 Reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
                <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Rs. {(product.discountPrice > 0 ? product.discountPrice : product.price).toLocaleString()}
                </span>
                {product.discountPrice > 0 && (
                  <span className="text-xl text-gray-400 line-through">
                    Rs. {product.price.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                      className="p-3 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  {product.stock > 0 && (
                    <span className="text-sm text-gray-500">
                      {product.stock} pieces available
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-lg transition-all ${
                    isAdded
                      ? 'bg-emerald-500 text-white'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <Truck className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Free Shipping</p>
                    <p className="text-xs text-gray-500">Orders over Rs. 5000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <RotateCcw className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Easy Returns</p>
                    <p className="text-xs text-gray-500">7 days policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Secure</p>
                    <p className="text-xs text-gray-500">Verified seller</p>
                  </div>
                </div>
              </div>

              {/* Share */}
              <button className="mt-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                <Share2 className="w-5 h-5" />
                Share This Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
