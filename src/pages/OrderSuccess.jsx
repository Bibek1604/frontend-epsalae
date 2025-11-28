import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Check, Download, Eye, Home } from 'lucide-react'

export default function OrderSuccess() {
  const { orderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const orderData = location.state?.orderData

  // Mock order data if not provided
  const order = orderData || {
    id: orderId,
    total: 149.99,
    items: [],
    shippingInfo: {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <Check size={64} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8 pb-8 border-b">
            <p className="text-gray-600 text-sm mb-1">Order Number</p>
            <p className="text-2xl font-bold text-gray-900 font-mono">{order.id}</p>
          </div>

          {/* Status Timeline */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
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

          {/* Order Summary */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${(order.total * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${(order.total * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                <span>Total</span>
                <span className="text-primary-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Shipping To</h3>
              <p className="text-gray-600 text-sm">
                {order.shippingInfo.firstName} {order.shippingInfo.lastName}
              </p>
              <p className="text-gray-600 text-sm">{order.shippingInfo.address}</p>
              <p className="text-gray-600 text-sm">
                {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Contact</h3>
              <p className="text-gray-600 text-sm">Email: {order.shippingInfo.email}</p>
              <p className="text-gray-600 text-sm">Phone: {order.shippingInfo.phone}</p>
            </div>
          </div>

          {/* Important Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-900">
              <strong>Tracking information</strong> will be sent to your email shortly. Check your inbox (and spam folder) for the tracking number.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600"
          >
            <Eye size={20} />
            View Order
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50"
          >
            <Download size={20} />
            Download Invoice
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50"
          >
            <Home size={20} />
            Back Home
          </button>
        </div>

        {/* Email Confirmation Notice */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            A confirmation email has been sent to <strong>{order.shippingInfo.email}</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
