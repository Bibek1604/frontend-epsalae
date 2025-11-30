import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MapPin, CreditCard, Plus, Minus, Trash2, X, Check, Info, Gift, Loader2, Truck, ShieldCheck, Package } from 'lucide-react'
import { useCart } from '@/store/cartstore'
import { orderApi } from '../api/orderapi'
import Navbar from '../homepage/navbar'
import { getImageUrl as getImage } from '@/config'

// Nepal Districts Data
const NEPAL_DISTRICTS = {
  'Kathmandu': ['Kathmandu', 'Kirtipur', 'Bhaktapur', 'Lalitpur', 'Budhanilkantha', 'Tokha', 'Chandragiri'],
  'Lalitpur': ['Lalitpur', 'Godavari', 'Mahalaxmi', 'Konjyosom'],
  'Bhaktapur': ['Bhaktapur', 'Madhyapur Thimi', 'Suryabinayak', 'Changunarayan'],
  'Pokhara': ['Pokhara', 'Lekhnath', 'Sarangkot'],
  'Chitwan': ['Bharatpur', 'Ratnanagar', 'Khairahani', 'Rapti'],
  'Morang': ['Biratnagar', 'Urlabari', 'Rangeli', 'Sundarharaicha'],
  'Rupandehi': ['Butwal', 'Siddharthanagar', 'Tilottama', 'Devdaha'],
  'Kaski': ['Pokhara', 'Lekhnath', 'Machhapuchchhre'],
  'Sunsari': ['Itahari', 'Dharan', 'Inaruwa'],
  'Jhapa': ['Birtamod', 'Damak', 'Bhadrapur', 'Mechinagar'],
  'Parsa': ['Birgunj', 'Pokhariya', 'Bahudarmai'],
  'Bara': ['Kalaiya', 'Jeetpur Simara', 'Kolhabi'],
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, getTotalPrice, clearCart, updateQuantity, removeFromCart } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState('cod')
  const [useCredit, setUseCredit] = useState(false)
  const [makeGift, setMakeGift] = useState(false)

  const [address, setAddress] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    district: '',
    city: '',
    address: '',
    description: '',
  })

  const [savedAddress, setSavedAddress] = useState(null)

  // Calculations
  const subtotal = getTotalPrice()
  const shipping = subtotal > 5000 ? 0 : 150
  const promoDiscount = appliedPromo ? appliedPromo.discount : 0
  const giftWrap = makeGift ? 50 : 0
  const total = subtotal + shipping - promoDiscount + giftWrap

  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', icon: '💵', subtitle: 'Pay when you receive your order' },
    { id: 'khalti', name: 'Khalti', icon: '💜', subtitle: 'Pay via Khalti digital wallet' },
    { id: 'esewa', name: 'eSewa', icon: '💚', subtitle: 'Pay via eSewa digital wallet' },
  ]

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE10' || promoCode.toUpperCase() === 'WELCOME20') {
      const discountPercent = promoCode.toUpperCase() === 'WELCOME20' ? 0.2 : 0.1
      setAppliedPromo({ code: promoCode.toUpperCase(), discount: subtotal * discountPercent })
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoCode('')
  }

  const handleSaveAddress = () => {
    if (address.first_name && address.phone && address.district && address.city && address.address) {
      setSavedAddress(address)
      setShowAddressModal(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!savedAddress) {
      setShowAddressModal(true)
      return
    }

    setIsProcessing(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const orderData = {
        user_id: null,
        first_name: savedAddress.first_name,
        last_name: savedAddress.last_name,
        name: `${savedAddress.first_name} ${savedAddress.last_name}`.trim(),
        phone: savedAddress.phone,
        district: savedAddress.district,
        city: savedAddress.city,
        address: savedAddress.address,
        description: savedAddress.description || 'No special instructions',
        items: cart.map(item => ({
          productId: item.id || item._id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          imageUrl: item.image || item.imageUrl || '',
        })),
        totalAmount: Number(total),
        paymentMethod: selectedPayment,
      }

      const res = await orderApi.create(orderData)
      console.log('📦 Order API Response:', res.data) // Debug log
      const createdOrder = res.data?.data || res.data
      // Get the real order ID from backend - check all possible field names
      const orderId = createdOrder?.orderId || createdOrder?.order_id || createdOrder?.id || createdOrder?._id || null
      
      if (!orderId) {
        console.error('❌ No order ID received from backend:', createdOrder)
        alert('Order created but no order ID received. Please contact support.')
        return
      }
      
      console.log('✅ Order created with ID:', orderId)

      clearCart()
      // Pass the complete backend response with the real order ID
      navigate(`/order-success/${orderId}`, {
        state: {
          order: {
            ...createdOrder,
            id: orderId, // Backend generated ID
            orderId: orderId, // Also store as orderId
            name: `${savedAddress.first_name} ${savedAddress.last_name}`.trim(),
            phone: savedAddress.phone,
            address: savedAddress.address,
            city: savedAddress.city,
            district: savedAddress.district,
            description: savedAddress.description,
            items: orderData.items,
            subtotal: subtotal,
            shipping: shipping,
            total: total,
            totalAmount: total,
            paymentMethod: selectedPayment,
            orderDate: createdOrder?.createdAt || createdOrder?.created_at || new Date().toISOString()
          }
        }
      })
    } catch (err) {
      console.error('Order failed:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const getImageUrl = (imageUrl) => {
    return getImage(imageUrl, 'https://via.placeholder.com/100x100?text=Product')
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
            <Link to="/" className="inline-block bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 transition">
              Continue Shopping
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-500 mt-1">Complete your order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Address & Payment & Cart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Delivery Address</h2>
                    <p className="text-sm text-gray-500">Where should we deliver your order?</p>
                  </div>
                </div>

                {savedAddress ? (
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{savedAddress.first_name} {savedAddress.last_name}</p>
                        <p className="text-gray-600 text-sm mt-1">{savedAddress.phone}</p>
                        <p className="text-gray-600 text-sm">{savedAddress.address}</p>
                        <p className="text-gray-600 text-sm">{savedAddress.city}, {savedAddress.district}</p>
                        {savedAddress.description && (
                          <p className="text-gray-500 text-sm mt-2 italic">"{savedAddress.description}"</p>
                        )}
                      </div>
                      <button 
                        onClick={() => setShowAddressModal(true)}
                        className="text-teal-600 hover:text-teal-700 text-sm font-medium px-3 py-1 rounded-lg hover:bg-teal-100 transition"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                    <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <h3 className="font-medium text-gray-900 mb-1">No address saved</h3>
                    <p className="text-gray-500 text-sm mb-4">Add a delivery address to continue</p>
                    <button 
                      onClick={() => setShowAddressModal(true)}
                      className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Address
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">Payment Method</h2>
                    <p className="text-sm text-gray-500">Choose how you'd like to pay</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition ${
                        selectedPayment === method.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                        {method.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-gray-500 text-sm">{method.subtitle}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                        selectedPayment === method.id
                          ? 'border-teal-500 bg-teal-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedPayment === method.id && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart Items */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <Package className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">Order Items</h2>
                      <p className="text-sm text-gray-500">{cart.length} item{cart.length > 1 ? 's' : ''} in your cart</p>
                    </div>
                  </div>
                  <button 
                    onClick={clearCart}
                    className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                        <img 
                          src={getImageUrl(item.image || item.imageUrl)} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm line-clamp-2">{item.name}</h3>
                            <p className="text-teal-600 font-semibold text-sm mt-1">
                              Rs. {item.price?.toLocaleString()}
                            </p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quantity & Total */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-medium text-gray-900 text-sm">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-md transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="space-y-6">
              {/* Credit Toggle */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Use Store Credit</p>
                      <p className="text-teal-600 text-xs">Balance: Rs. 0</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUseCredit(!useCredit)}
                    disabled
                    className={`w-12 h-6 rounded-full transition opacity-50 cursor-not-allowed ${useCredit ? 'bg-teal-500' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition transform ${useCredit ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Gift Option */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Gift className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Gift Wrap</p>
                      <p className="text-amber-600 text-xs">Add for Rs. 50</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMakeGift(!makeGift)}
                    className={`w-12 h-6 rounded-full transition ${makeGift ? 'bg-teal-500' : 'bg-gray-200'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition transform ${makeGift ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                {makeGift && (
                  <p className="text-xs text-gray-500 mt-3 pl-13">
                    🎁 Your items will be beautifully wrapped!
                  </p>
                )}
              </div>

              {/* Discount Code */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Discount Code</h3>
                
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎟️</span>
                      <div>
                        <span className="font-medium text-gray-900">{appliedPromo.code}</span>
                        <p className="text-green-600 text-xs">-Rs. {appliedPromo.discount.toLocaleString()} off</p>
                      </div>
                    </div>
                    <button onClick={handleRemovePromo} className="text-red-500 hover:text-red-600 text-sm font-medium">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-medium hover:bg-teal-700 transition"
                    >
                      Apply
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-2">Try: SAVE10, WELCOME20</p>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({cart.length} items)</span>
                    <span className="text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-green-600">-Rs. {promoDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  {makeGift && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Gift wrap</span>
                      <span className="text-gray-900">Rs. {giftWrap}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                      {shipping === 0 ? 'Free' : `Rs. ${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-400">Free shipping on orders above Rs. 5,000</p>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-4 mb-6 py-3 border-y border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    Secure
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Truck className="w-4 h-4 text-teal-500" />
                    Fast Delivery
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Package className="w-4 h-4 text-amber-500" />
                    Quality
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-600/30"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order - Rs. {total.toLocaleString()}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  By placing order, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                <p className="text-sm text-gray-500">Enter your shipping details</p>
              </div>
              <button onClick={() => setShowAddressModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
                  <input
                    type="text"
                    value={address.first_name}
                    onChange={(e) => setAddress({...address, first_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                    placeholder="Ram"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={address.last_name}
                    onChange={(e) => setAddress({...address, last_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                    placeholder="Sharma"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  value={address.phone}
                  onChange={(e) => setAddress({...address, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                  placeholder="98XXXXXXXX"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">District *</label>
                  <select
                    value={address.district}
                    onChange={(e) => setAddress({...address, district: e.target.value, city: ''})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select District</option>
                    {Object.keys(NEPAL_DISTRICTS).sort().map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                  <select
                    value={address.city}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition bg-white appearance-none cursor-pointer"
                    disabled={!address.district}
                  >
                    <option value="">Select City</option>
                    {address.district && NEPAL_DISTRICTS[address.district]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address *</label>
                <input
                  type="text"
                  value={address.address}
                  onChange={(e) => setAddress({...address, address: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition"
                  placeholder="Street address, house number, landmark..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Instructions (Optional)</label>
                <textarea
                  value={address.description}
                  onChange={(e) => setAddress({...address, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition resize-none"
                  rows={3}
                  placeholder="Any special instructions for delivery..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAddress}
                  className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition"
                >
                  Save Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}