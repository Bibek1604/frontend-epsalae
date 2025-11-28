import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Download, ChevronRight } from 'lucide-react'

export default function OrderHistory() {
  const navigate = useNavigate()
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock order history data
  const orders = [
    {
      id: 'ORD-1734100800',
      date: '2024-12-13',
      status: 'delivered',
      total: 129.99,
      items: 1,
      trackingNumber: 'TRK-123456789'
    },
    {
      id: 'ORD-1733996400',
      date: '2024-12-12',
      status: 'shipped',
      total: 89.99,
      items: 2,
      trackingNumber: 'TRK-987654321'
    },
    {
      id: 'ORD-1733910000',
      date: '2024-12-11',
      status: 'processing',
      total: 199.99,
      items: 3,
      trackingNumber: null
    },
    {
      id: 'ORD-1733823600',
      date: '2024-12-10',
      status: 'delivered',
      total: 49.99,
      items: 1,
      trackingNumber: 'TRK-555666777'
    },
  ]

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus)

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">View and manage all your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {[
            { value: 'all', label: 'All Orders' },
            { value: 'processing', label: 'Processing' },
            { value: 'shipped', label: 'Shipped' },
            { value: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === tab.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600 mb-4">No orders found</p>
              <button
                onClick={() => navigate('/')}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-600"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Side */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div>
                          <p className="font-mono font-bold text-gray-900 mb-1">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        {order.trackingNumber && (
                          <span className="text-sm text-gray-600">
                            <strong>Tracking:</strong> {order.trackingNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle */}
                    <div className="flex gap-8 md:justify-end">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Items</p>
                        <p className="font-bold text-gray-900">{order.items}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Total</p>
                        <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="flex items-center gap-2 px-4 py-2 text-primary-600 border border-primary-300 rounded-lg font-semibold hover:bg-primary-50 transition"
                        title="View details"
                      >
                        <Eye size={18} />
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                        title="Download invoice"
                      >
                        <Download size={18} />
                        <span className="hidden sm:inline">Invoice</span>
                      </button>
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
