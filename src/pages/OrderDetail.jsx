import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Package, Truck, Check, Download, MessageSquare } from 'lucide-react'

export default function OrderDetail() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  // Mock order detail data
  const order = {
    id: orderId,
    date: '2024-12-13',
    status: 'delivered',
    deliveredDate: '2024-12-15',
    trackingNumber: 'TRK-123456789',
    items: [
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 129.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
        color: 'Blue',
        size: 'M'
      }
    ],
    subtotal: 129.99,
    tax: 13.00,
    shipping: 0,
    total: 142.99,
    shippingInfo: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567'
    },
    timeline: [
      {
        status: 'Order Placed',
        date: '2024-12-13',
        icon: Package,
        completed: true
      },
      {
        status: 'Order Confirmed',
        date: '2024-12-13',
        icon: Check,
        completed: true
      },
      {
        status: 'Processing',
        date: '2024-12-14',
        icon: Package,
        completed: true
      },
      {
        status: 'Shipped',
        date: '2024-12-14',
        icon: Truck,
        completed: true
      },
      {
        status: 'Out for Delivery',
        date: '2024-12-15',
        icon: Truck,
        completed: true
      },
      {
        status: 'Delivered',
        date: '2024-12-15',
        icon: Check,
        completed: true
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ChevronLeft size={20} />
          Back to Orders
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Details</h1>
            <p className="text-gray-600 font-mono">{order.id}</p>
          </div>
          <div className="text-right mt-4 sm:mt-0">
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="text-lg font-semibold text-gray-900">{order.date}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status and Tracking */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Status</h2>
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                  Delivered
                </span>
                <p className="text-gray-600">Delivered on {order.deliveredDate}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                <p className="font-mono font-bold text-gray-900">{order.trackingNumber}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Delivery Timeline</h2>
              <div className="space-y-6">
                {order.timeline.map((event, idx) => {
                  const Icon = event.icon
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.completed ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Icon size={16} className={event.completed ? 'text-green-600' : 'text-gray-400'} />
                        </div>
                        {idx < order.timeline.length - 1 && (
                          <div className={`w-0.5 h-12 mt-2 ${
                            event.completed ? 'bg-green-200' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className="font-semibold text-gray-900">{event.status}</p>
                        <p className="text-sm text-gray-600">{event.date}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Items Ordered</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        Color: {item.color} • Size: {item.size}
                      </p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                  <MessageSquare size={18} />
                  Contact Support
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50">
                  <Download size={18} />
                  Download Invoice
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4 pb-4 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span className="text-primary-600">${order.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-semibold text-gray-900">
                  {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                </p>
                <p>{order.shippingInfo.address}</p>
                <p>
                  {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}
                </p>
                <p>{order.shippingInfo.country}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">{order.shippingInfo.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-900">{order.shippingInfo.phone}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="text-sm text-gray-600">
                <p className="mb-2">Credit Card</p>
                <p className="font-mono font-semibold text-gray-900">•••• •••• •••• 4242</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
