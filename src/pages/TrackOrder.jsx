import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, MapPin, Phone, User, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderApi } from '../components/api/orderapi';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', icon: Clock, label: 'Pending', description: 'Your order has been received and is being reviewed.' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', icon: Package, label: 'Processing', description: 'Your order is being prepared for shipment.' },
    shipped: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300', icon: Truck, label: 'Shipped', description: 'Your order is on its way!' },
    delivered: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', icon: CheckCircle, label: 'Delivered', description: 'Your order has been delivered successfully!' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', icon: AlertCircle, label: 'Cancelled', description: 'This order has been cancelled.' },
  };

  const statusFlow = ['pending', 'processing', 'shipped', 'delivered'];

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setError('');
    setOrder(null);
    setSearched(true);

    if (!orderId.trim() || !phone.trim()) {
      setError('Please enter both Order ID and Phone Number');
      return;
    }

    setLoading(true);
    try {
      // Use public track endpoint (no auth required)
      // Backend: GET /api/v1/orders/track/:orderId
      const res = await orderApi.trackById(orderId.trim());
      console.log('📦 Track response:', res.data);
      const fetchedOrder = res.data?.data || res.data;
      
      console.log('📱 Order phone from DB:', fetchedOrder?.phone);
      console.log('📱 User entered phone:', phone.trim());

      // Normalize phone numbers for comparison (remove spaces, dashes, +977 prefix)
      const normalizePhone = (p) => {
        if (!p) return '';
        return p.toString().replace(/[\s\-\+]/g, '').replace(/^977/, '').replace(/^0/, '');
      };
      
      const orderPhone = normalizePhone(fetchedOrder?.phone);
      const inputPhone = normalizePhone(phone);
      
      console.log('📱 Normalized order phone:', orderPhone);
      console.log('📱 Normalized input phone:', inputPhone);

      // Verify phone number matches for security (flexible comparison)
      if (fetchedOrder && orderPhone && inputPhone && orderPhone.includes(inputPhone.slice(-10))) {
        setOrder(fetchedOrder);
      } else if (fetchedOrder && !fetchedOrder.phone) {
        // If order doesn't have phone stored, show the order anyway
        setOrder(fetchedOrder);
      } else if (fetchedOrder) {
        setError('Phone number does not match the order. Please check and try again.');
      } else {
        setError('No order found with this Order ID.');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      if (err.response?.status === 404) {
        setError('Order not found. Please check your Order ID.');
      } else if (err.response?.status === 401) {
        // Try alternative: maybe backend returns 401 for track endpoint too
        setError('Order tracking is temporarily unavailable. Please try again later.');
      } else {
        setError('Unable to fetch order. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIndex = (status) => statusFlow.indexOf(status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your Order ID and Phone Number to check your order status</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
              
              {order.status === 'cancelled' ? (
                <div className={`p-4 rounded-xl ${statusConfig.cancelled.bg} ${statusConfig.cancelled.border} border`}>
                  <div className="flex items-center gap-3">
                    <AlertCircle className={`w-8 h-8 ${statusConfig.cancelled.text}`} />
                    <div>
                      <p className={`font-semibold ${statusConfig.cancelled.text}`}>Order Cancelled</p>
                      <p className="text-gray-600 text-sm">{statusConfig.cancelled.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress Bar */}
                  <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${(getStatusIndex(order.status) / (statusFlow.length - 1)) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Status Steps */}
                  <div className="relative flex justify-between">
                    {statusFlow.map((status, index) => {
                      const config = statusConfig[status];
                      const Icon = config.icon;
                      const isActive = getStatusIndex(order.status) >= index;
                      const isCurrent = order.status === status;
                      
                      return (
                        <div key={status} className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isActive ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                          } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <p className={`mt-2 text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                            {config.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Current Status Description */}
              {order.status !== 'cancelled' && (
                <div className={`mt-6 p-4 rounded-xl ${statusConfig[order.status]?.bg} ${statusConfig[order.status]?.border} border`}>
                  <p className={`font-medium ${statusConfig[order.status]?.text}`}>
                    {statusConfig[order.status]?.description}
                  </p>
                </div>
              )}
            </div>

            {/* Order Info */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Customer & Shipping */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-green-600" />
                  Shipping Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">
                      {order.first_name && order.last_name 
                        ? `${order.first_name} ${order.last_name}` 
                        : order.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">{order.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{order.address || 'N/A'}</p>
                    <p className="text-gray-600">{order.city}, {order.district}</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-green-600" />
                  Order Summary
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-mono text-gray-900">#{(order.id || order._id)?.toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Order Date</span>
                    <span className="text-gray-900">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Items</span>
                    <span className="text-gray-900">{order.items?.length || 0} items</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-green-600 text-lg">Rs. {(order.totalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.name || 'Product'}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.quantity || 1}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <h3 className="font-semibold text-green-800 mb-2">Need Help?</h3>
              <p className="text-green-700 text-sm mb-3">If you have any questions about your order, contact us:</p>
              <a 
                href="https://wa.me/9779860056658" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact on WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* No Order Found After Search */}
        {searched && !order && !loading && !error && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Enter your order details to track your order</p>
          </div>
        )}
      </div>
    </div>
  );
}
