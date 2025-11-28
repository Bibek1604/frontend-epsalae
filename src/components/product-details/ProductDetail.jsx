import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Loader2 } from 'lucide-react'
import { useCart } from '@/store/cartstore'
import { productApi } from '../api/productapi'

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
        const imageUrl = data.imageUrl?.startsWith('http') 
          ? data.imageUrl 
          : `http://localhost:5000${data.imageUrl}`
        
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Product not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-blue-500">
              Home
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="mb-4">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg'
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Title */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <p className="text-gray-600 text-lg mb-4">{product.description}</p>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-red-600">
                  ₹{product.discountPrice > 0 ? product.discountPrice : product.price}
                </span>
                {product.discountPrice > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">₹{product.price}</span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold text-lg">
                  <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                  In Stock ({product.stock} available)
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 font-semibold text-lg">
                  <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                  Out of Stock
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                  isAdded
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400'
                }`}
              >
                <ShoppingCart size={20} />
                {isAdded ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition disabled:bg-gray-400"
              >
                Buy Now
              </button>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`px-6 py-3 border-2 rounded-lg transition ${
                  isFavorite
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Heart size={20} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="text-blue-500" size={20} />
                <span className="text-sm text-gray-600">Free shipping on orders over ₹500</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="text-blue-500" size={20} />
                <span className="text-sm text-gray-600">7-day returns & exchanges</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-blue-500" size={20} />
                <span className="text-sm text-gray-600">Secure & verified seller</span>
              </div>
            </div>

            {/* Share */}
            <button className="mt-6 flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium">
              <Share2 size={18} />
              Share This Product
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
