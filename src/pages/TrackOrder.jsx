import { useState, useRef } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, MapPin, Phone, User, ShoppingBag, ArrowLeft, FileText, Download, Printer, Calendar, CreditCard, Hash } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderApi } from '../components/api/orderapi';
import { API_URL } from '../config';

// Helper function to normalize order data from backend
const normalizeOrder = (rawOrder) => {
  if (!rawOrder) return null;
  
  // Get customer name
  const customerName = rawOrder.name || 
    (rawOrder.first_name && rawOrder.last_name ? `${rawOrder.first_name} ${rawOrder.last_name}` : null) ||
    (rawOrder.firstName && rawOrder.lastName ? `${rawOrder.firstName} ${rawOrder.lastName}` : null) ||
    rawOrder.customerName || 
    rawOrder.customer?.name || 
    'N/A';
  
  // Get phone
  const customerPhone = rawOrder.phone || 
    rawOrder.customerPhone || 
    rawOrder.customer?.phone || 
    rawOrder.mobile || 
    'N/A';
  
  // Get address
  const customerAddress = rawOrder.address || 
    rawOrder.shippingAddress || 
    rawOrder.shipping_address || 
    rawOrder.customer?.address || 
    'N/A';
  
  // Get city and district
  const city = rawOrder.city || rawOrder.customer?.city || '';
  const district = rawOrder.district || rawOrder.customer?.district || '';
  
  // Get order ID
  const orderId = rawOrder.orderId || rawOrder.order_id || rawOrder.id || rawOrder._id || '';
  
  // Get order date
  const orderDate = rawOrder.created_at || rawOrder.createdAt || rawOrder.orderDate || rawOrder.order_date || null;
  
  // Get items - handle different possible structures
  let items = [];
  if (Array.isArray(rawOrder.items)) {
    items = rawOrder.items;
  } else if (Array.isArray(rawOrder.orderItems)) {
    items = rawOrder.orderItems;
  } else if (Array.isArray(rawOrder.products)) {
    items = rawOrder.products;
  }
  
  // Normalize items
  const normalizedItems = items.map(item => ({
    name: item.name || item.productName || item.product?.name || 'Product',
    quantity: item.quantity || item.qty || 1,
    price: item.price || item.unitPrice || item.product?.price || 0,
    imageUrl: item.imageUrl || item.image || item.product?.imageUrl || item.product?.image || '',
  }));
  
  // Get total
  const totalAmount = rawOrder.totalAmount || rawOrder.total || rawOrder.total_amount || rawOrder.grandTotal || 0;
  
  // Get payment method
  const paymentMethod = rawOrder.paymentMethod || rawOrder.payment_method || 'cod';
  
  // Get status
  const status = rawOrder.status || 'pending';
  
  // Get shipping
  const shipping = rawOrder.shipping || rawOrder.shippingFee || rawOrder.shipping_fee || 0;
  
  // Get description/notes
  const description = rawOrder.description || rawOrder.notes || rawOrder.note || '';

  return {
    ...rawOrder,
    // Normalized fields
    customerName,
    customerPhone,
    customerAddress,
    city,
    district,
    orderId,
    orderDate,
    items: normalizedItems,
    totalAmount,
    paymentMethod,
    status,
    shipping,
    description,
  };
};

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const billRef = useRef(null);

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
      console.log('📦 Full response object:', JSON.stringify(res.data, null, 2));
      
      // Handle different response structures
      let fetchedOrder = res.data?.data || res.data?.order || res.data;
      
      // If the order data is nested further
      if (fetchedOrder && typeof fetchedOrder === 'object') {
        console.log('📦 Fetched order keys:', Object.keys(fetchedOrder));
        console.log('📦 Fetched order:', JSON.stringify(fetchedOrder, null, 2));
      }
      
      // Normalize the order data
      const normalizedOrder = normalizeOrder(fetchedOrder);
      console.log('📦 Normalized order:', normalizedOrder);
      
      // Get phone for verification
      const dbPhone = normalizedOrder?.customerPhone;
      console.log('📱 Order phone from DB:', dbPhone);
      console.log('📱 User entered phone:', phone.trim());

      // Normalize phone numbers for comparison (remove spaces, dashes, +977 prefix)
      const normalizePhoneNumber = (p) => {
        if (!p || p === 'N/A') return '';
        return p.toString().replace(/[\s\-\+]/g, '').replace(/^977/, '').replace(/^0/, '');
      };
      
      const orderPhone = normalizePhoneNumber(dbPhone);
      const inputPhone = normalizePhoneNumber(phone);
      
      console.log('📱 Normalized order phone:', orderPhone);
      console.log('📱 Normalized input phone:', inputPhone);

      // Verify phone number matches for security (flexible comparison)
      // Also allow if no phone is in database or phones match
      if (normalizedOrder && (!orderPhone || orderPhone.includes(inputPhone.slice(-10)) || inputPhone.includes(orderPhone.slice(-10)))) {
        setOrder(normalizedOrder);
      } else if (normalizedOrder) {
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

  // Print Bill Function
  const handlePrintBill = () => {
    const printContent = billRef.current;
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Invoice - #${(order.orderId || order.id || order._id)}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background: #fff; }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #16a34a; padding-bottom: 20px; margin-bottom: 20px; }
            .header h1 { color: #16a34a; font-size: 28px; margin-bottom: 5px; }
            .header p { color: #666; font-size: 12px; }
            .order-id { background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
            .order-id h2 { color: #16a34a; font-size: 24px; font-family: monospace; }
            .order-id p { color: #666; font-size: 12px; margin-top: 5px; }
            .section { margin-bottom: 20px; }
            .section-title { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #eee; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .info-box { background: #f9fafb; padding: 15px; border-radius: 8px; }
            .info-box label { font-size: 11px; color: #666; text-transform: uppercase; }
            .info-box p { font-size: 14px; color: #111; margin-top: 5px; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .items-table th { background: #f3f4f6; padding: 10px; text-align: left; font-size: 12px; color: #666; }
            .items-table td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
            .items-table .item-name { font-weight: 500; }
            .items-table .item-price { text-align: right; font-weight: 600; }
            .summary { background: #f0fdf4; padding: 15px; border-radius: 8px; margin-top: 20px; }
            .summary-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; }
            .summary-row.total { border-top: 2px solid #16a34a; margin-top: 10px; padding-top: 10px; font-size: 16px; font-weight: bold; color: #16a34a; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 11px; }
            .status-badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-processing { background: #dbeafe; color: #1e40af; }
            .status-shipped { background: #e9d5ff; color: #7c3aed; }
            .status-delivered { background: #dcfce7; color: #16a34a; }
            .status-cancelled { background: #fee2e2; color: #dc2626; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const getStatusIndex = (status) => statusFlow.indexOf(status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl px-4 py-4 mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="max-w-4xl px-4 py-8 mx-auto">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-gray-600">Enter your Order ID and Phone Number to check your order status</p>
        </div>

        {/* Search Form */}
        <div className="p-6 mb-8 bg-white shadow-lg rounded-2xl">
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID"
                  className="w-full px-4 py-3 transition-all border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 transition-all border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition-colors bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-xl"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
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
          <div className="flex items-center gap-3 p-4 mb-8 border border-red-200 bg-red-50 rounded-xl">
            <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Order Status</h2>
              
              {order.status === 'cancelled' ? (
                <div className={`p-4 rounded-xl ${statusConfig.cancelled.bg} ${statusConfig.cancelled.border} border`}>
                  <div className="flex items-center gap-3">
                    <AlertCircle className={`w-8 h-8 ${statusConfig.cancelled.text}`} />
                    <div>
                      <p className={`font-semibold ${statusConfig.cancelled.text}`}>Order Cancelled</p>
                      <p className="text-sm text-gray-600">{statusConfig.cancelled.description}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Progress Bar */}
                  <div className="absolute h-1 bg-gray-200 rounded-full top-5 left-5 right-5">
                    <div 
                      className="h-full transition-all duration-500 bg-green-500 rounded-full"
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

            {/* Animated Status Section */}
            <div className="p-6 overflow-hidden bg-white shadow-lg rounded-2xl">
              {/* Status Animation Based on Current Status */}
              {order.status === 'pending' && (
                <div className="relative">
                  <div className="flex flex-col items-center py-8">
                    {/* Pulsing Clock Animation */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-25 animate-ping"></div>
                      <div className="absolute inset-0 bg-yellow-300 rounded-full animate-pulse"></div>
                      <div className="relative flex items-center justify-center w-24 h-24 rounded-full shadow-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                        <Clock className="w-12 h-12 text-white animate-pulse" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">Order Received! 📋</h3>
                    <p className="max-w-md text-center text-gray-600">We're reviewing your order and will start processing it soon.</p>
                    {/* Animated Dots */}
                    <div className="flex gap-2 mt-4">
                      <span className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                      <span className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                      <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                    </div>
                  </div>
                </div>
              )}

              {order.status === 'processing' && (
                <div className="relative">
                  <div className="flex flex-col items-center py-8">
                    {/* Spinning Gear Animation */}
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
                      <div className="relative flex items-center justify-center w-24 h-24 rounded-full shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                        <Package className="w-12 h-12 text-white animate-bounce" />
                      </div>
                      {/* Orbiting Particles */}
                      <div className="absolute inset-0 animate-spin" style={{animationDuration: '3s'}}>
                        <div className="absolute w-4 h-4 bg-blue-400 rounded-full shadow-lg -top-2 left-1/2"></div>
                      </div>
                      <div className="absolute inset-0 animate-spin" style={{animationDuration: '4s', animationDirection: 'reverse'}}>
                        <div className="absolute w-3 h-3 bg-indigo-400 rounded-full shadow-lg top-1/2 -right-2"></div>
                      </div>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">Preparing Your Order! 📦</h3>
                    <p className="max-w-md text-center text-gray-600">Our team is carefully packing your items with love.</p>
                    {/* Progress Bar Animation */}
                    <div className="w-64 h-2 mt-6 overflow-hidden bg-gray-200 rounded-full">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse" style={{width: '60%'}}></div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-blue-600">Packaging in progress...</p>
                  </div>
                </div>
              )}

              {order.status === 'shipped' && (
                <div className="relative">
                  <div className="flex flex-col items-center py-8">
                    {/* Moving Truck Animation */}
                    <div className="relative w-full max-w-md mb-8">
                      {/* Road */}
                      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gray-300 rounded-full"></div>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-around h-1 top-1">
                        <div className="w-8 h-1 bg-yellow-400 rounded animate-pulse"></div>
                        <div className="w-8 h-1 bg-yellow-400 rounded animate-pulse" style={{animationDelay: '200ms'}}></div>
                        <div className="w-8 h-1 bg-yellow-400 rounded animate-pulse" style={{animationDelay: '400ms'}}></div>
                        <div className="w-8 h-1 bg-yellow-400 rounded animate-pulse" style={{animationDelay: '600ms'}}></div>
                      </div>
                      
                      {/* Truck */}
                      <div className="relative flex justify-center">
                        <div className="animate-bounce" style={{animationDuration: '0.5s'}}>
                          <div className="flex items-center justify-center w-20 h-20 transition-transform transform shadow-xl bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl hover:scale-110">
                            <Truck className="w-10 h-10 text-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Speed Lines */}
                      <div className="absolute flex flex-col gap-1 top-8 left-4 opacity-60">
                        <div className="w-12 h-0.5 bg-purple-400 rounded animate-pulse"></div>
                        <div className="w-8 h-0.5 bg-purple-300 rounded animate-pulse" style={{animationDelay: '100ms'}}></div>
                        <div className="w-16 h-0.5 bg-purple-400 rounded animate-pulse" style={{animationDelay: '200ms'}}></div>
                      </div>
                    </div>
                    
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">On The Way! 🚚💨</h3>
                    <p className="max-w-md text-center text-gray-600">Your package is zooming towards you! Get ready to receive it soon.</p>
                    
                    {/* Delivery Progress */}
                    <div className="flex items-center gap-4 mt-6">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                          <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="mt-1 text-xs text-gray-500">Dispatched</span>
                      </div>
                      <div className="relative w-16 h-1 overflow-hidden bg-purple-500 rounded">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-500 rounded-full animate-pulse">
                          <Truck className="w-5 h-5 text-white" />
                        </div>
                        <span className="mt-1 text-xs font-medium text-purple-600">In Transit</span>
                      </div>
                      <div className="w-16 h-1 bg-gray-200 rounded"></div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                          <MapPin className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="mt-1 text-xs text-gray-400">Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {order.status === 'delivered' && (
                <div className="relative">
                  <div className="flex flex-col items-center py-8">
                    {/* Celebration Animation */}
                    <div className="relative mb-6">
                      {/* Confetti */}
                      <div className="absolute text-2xl -top-4 -left-8 animate-bounce" style={{animationDelay: '0ms'}}>🎉</div>
                      <div className="absolute text-2xl -top-4 -right-8 animate-bounce" style={{animationDelay: '200ms'}}>🎊</div>
                      <div className="absolute top-0 text-xl left-12 animate-ping">✨</div>
                      <div className="absolute top-0 text-xl right-12 animate-ping" style={{animationDelay: '300ms'}}>✨</div>
                      
                      {/* Success Circle */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30"></div>
                        <div className="flex items-center justify-center w-24 h-24 rounded-full shadow-xl bg-gradient-to-br from-green-400 to-emerald-600">
                          <CheckCircle className="text-white w-14 h-14" />
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">Delivered Successfully! 🎁</h3>
                    <p className="max-w-md text-center text-gray-600">Your order has been delivered. We hope you love your purchase!</p>
                    
                    {/* Thank You Message */}
                    <div className="px-6 py-3 mt-6 border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                      <p className="font-medium text-center text-green-700">Thank you for shopping with ePasaley! 💚</p>
                    </div>
                    
                    {/* Stars Animation */}
                    <div className="flex gap-1 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-2xl text-yellow-400 animate-pulse" style={{animationDelay: `${i * 100}ms`}}>⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {order.status === 'cancelled' && (
                <div className="relative">
                  <div className="flex flex-col items-center py-8">
                    {/* Cancelled Animation */}
                    <div className="relative mb-6">
                      <div className="flex items-center justify-center w-24 h-24 rounded-full shadow-lg bg-gradient-to-br from-red-400 to-red-600">
                        <AlertCircle className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-gray-900">Order Cancelled</h3>
                    <p className="max-w-md text-center text-gray-600">This order has been cancelled. If you have questions, please contact our support.</p>
                  </div>
                </div>
              )}
            </div>
            {/* Need Help */}
            <div className="p-6 text-center border border-green-200 bg-green-50 rounded-2xl">
              <h3 className="mb-2 font-semibold text-green-800">Need Help?</h3>
              <p className="mb-3 text-sm text-green-700">If you have any questions about your order, contact us:</p>
              <a 
                href="https://wa.me/9779857089898" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
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
          <div className="py-12 text-center bg-white shadow-lg rounded-2xl">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Enter your order details to track your order</p>
          </div>
        )}
      </div>
    </div>
  );
}
