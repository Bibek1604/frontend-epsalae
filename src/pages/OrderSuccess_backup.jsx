import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Check, Download, Eye, Home, Truck, CreditCard } from 'lucide-react'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const orderData = location.state?.orderData
  const paymentMethod = location.state?.paymentMethod || 'cod'

  // Use order data from navigation state or fallback
  const order = orderData || {
    id: orderId,
    totalAmount: 0,
    items: [],
    name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    description: ''
  }

  // Calculate totals
  const totalAmount = order.totalAmount || 0
  const tax = totalAmount * 0.1 / 1.1 // Extract tax from total (10% included)
  const subtotal = totalAmount - tax

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50">
      <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="mb-8 text-center">
          <div className="inline-block p-4 mb-4 bg-green-100 rounded-full">
            <Check size={64} className="text-green-600" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className="p-8 mb-8 bg-white rounded-lg shadow-lg">
          <div className="pb-8 mb-8 text-center border-b">
            <p className="mb-1 text-sm text-gray-600">Order Number</p>
            <p className="font-mono text-2xl font-bold text-gray-900">{order.id || orderId}</p>
          </div>

          {/* Payment Method */}
          <div className="flex items-center gap-3 p-4 mb-6 rounded-lg bg-gray-50">
            <CreditCard className="text-gray-600" size={24} />
            <div>
              <p className="font-semibold text-gray-900">Payment Method</p>
              <p className="text-sm text-gray-600">
                {paymentMethod === 'cod' ? '💵 Cash on Delivery' : 
                 paymentMethod === 'khalti' ? '🟣 Khalti' : '🟢 eSewa'}
              </p>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mb-8">
            <h2 className="mb-6 text-lg font-bold text-gray-900">Order Status</h2>
            <div className="space-y-4">
              {[
                { step: 1, status: 'Order Confirmed', desc: 'Your order has been received', completed: true },
                { step: 2, status: 'Processing', desc: 'We are preparing your items', completed: false },
                { step: 3, status: 'Shipped', desc: 'Your package is on the way', completed: false },
                { step: 4, status: 'Delivered', desc: 'Package delivered', completed: false }
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    item.completed
                      ? 'bg-green-500 text-white'
                      : item.step === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {item.completed ? <Check size={16} /> : item.step}
                  </div>
                  <div className="pt-1">
                    <p className="font-semibold text-gray-900">{item.status}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="pb-8 mb-8 border-b">
              <h2 className="mb-4 text-lg font-bold text-gray-900">Items Ordered</h2>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} className="object-cover w-12 h-12 rounded" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="pb-8 mb-8 border-b">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 text-xl font-bold text-gray-900 border-t">
                <span>Total</span>
                <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 mb-3 font-bold text-gray-900">
                <Truck size={18} /> Shipping To
              </h3>
              <p className="font-medium text-gray-900">{order.name}</p>
              <p className="text-sm text-gray-600">{order.address}</p>
              <p className="text-sm text-gray-600">{order.city}, {order.district}</p>
              {order.description && (
                <p className="mt-2 text-sm italic text-gray-500">"{order.description}"</p>
              )}
            </div>
            <div>
              <h3 className="mb-3 font-bold text-gray-900">Contact</h3>
              <p className="text-sm text-gray-600">Phone: {order.phone}</p>
            </div>
          </div>

          {/* COD Info */}
          {paymentMethod === 'cod' && (
            <div className="p-4 mb-8 border border-yellow-200 rounded-lg bg-yellow-50">
              <p className="text-sm text-yellow-800">
                <strong>💵 Cash on Delivery:</strong> Please keep exact change of <strong>₹{totalAmount.toFixed(2)}</strong> ready when your order arrives.
              </p>
            </div>
          )}

          {/* Important Info */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <p className="text-sm text-blue-900">
              <strong>📦 Tracking information</strong> will be sent to you shortly. Our delivery partner will contact you before delivery.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-gray-900 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download size={20} />
            Download Invoice
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            <Home size={20} />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

