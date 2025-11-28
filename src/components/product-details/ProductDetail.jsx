import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCart } from '@/store/cartstore'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('blue')
  const [selectedSize, setSelectedSize] = useState('M')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  // Mock product data
  const product = {
    id: id,
    name: 'Premium Wireless Headphones',
    price: 129.99,
    originalPrice: 199.99,
    rating: 4.5,
    reviews: 328,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=800&fit=crop',
    ],
    description: 'Experience premium audio quality with our wireless headphones. Featuring active noise cancellation, 30-hour battery life, and premium comfort padding.',
    features: [
      'Active Noise Cancellation (ANC)',
      '30-hour battery life',
      'Bluetooth 5.0 connectivity',
      'Premium comfort padding',
      'Built-in microphone for calls',
      'Foldable design for portability',
    ],
    colors: ['blue', 'black', 'silver'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    shipping: 'Free shipping on orders over $50',
    returns: '30-day money-back guarantee',
    warranty: '2-year manufacturer warranty',
  }

  const [mainImage, setMainImage] = useState(product.images[0])

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      color: selectedColor,
      size: selectedSize,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-primary-500">
              Home
            </button>
            <span>/</span>
            <button onClick={() => navigate('/')} className="hover:text-primary-500">
              Products
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
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                    mainImage === img ? 'border-primary-500' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Title & Rating */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900 ml-2">{product.rating}</span>
                </div>
                <span className="text-gray-600">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary-600">${product.price}</span>
                <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
              <div className="flex gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition capitalize ${
                      selectedColor === color
                        ? 'border-primary-500 ring-2 ring-primary-300'
                        : 'border-gray-300'
                    }`}
                    style={{
                      backgroundColor: color === 'blue' ? '#0ea5e9' : color === 'black' ? '#000' : '#c0c0c0',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
              <div className="flex gap-3">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                      selectedSize === size
                        ? 'border-primary-500 bg-primary-50 text-primary-600'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
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
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition ${
                  isAdded
                    ? 'bg-green-500 text-white'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                <ShoppingCart size={20} />
                {isAdded ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-accent-500 text-white py-3 rounded-lg font-semibold hover:bg-accent-600 transition"
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
                <Truck className="text-primary-500" size={20} />
                <span className="text-sm text-gray-600">{product.shipping}</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="text-primary-500" size={20} />
                <span className="text-sm text-gray-600">{product.returns}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-primary-500" size={20} />
                <span className="text-sm text-gray-600">{product.warranty}</span>
              </div>
            </div>

            {/* Share */}
            <button className="mt-6 flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium">
              <Share2 size={18} />
              Share This Product
            </button>
          </div>
        </div>

        {/* Features & Description */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Product</h2>
            <p className="text-gray-600 mb-6">{product.description}</p>

            <h3 className="text-lg font-bold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-3">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-600">
                  <span className="w-2 h-2 bg-primary-500 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div className="bg-gray-100 p-6 rounded-lg h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Specifications</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Model</p>
                <p className="font-semibold text-gray-900">Premium Wireless v2</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Battery Life</p>
                <p className="font-semibold text-gray-900">30 Hours</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bluetooth Version</p>
                <p className="font-semibold text-gray-900">5.0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="font-semibold text-gray-900">250g</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Warranty</p>
                <p className="font-semibold text-gray-900">2 Years</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
