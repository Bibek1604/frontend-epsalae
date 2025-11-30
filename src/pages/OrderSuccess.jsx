import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Check, Download, Home, Truck, CreditCard, Package, MapPin, Phone, Calendar, FileText, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { API_URL } from '../config'

// Print styles - injected into head for clean invoice printing
const printStyles = `
@media print {
  @page {
    size: A4;
    margin: 10mm;
  }
  
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  /* Hide non-printable elements */
  .no-print, 
  .no-print *,
  nav, 
  footer,
  button,
  .action-buttons,
  .need-help-section,
  .status-timeline,
  .tracking-info-box {
    display: none !important;
  }
  
  /* Show only invoice content */
  .print-invoice {
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
    box-shadow: none !important;
  }
  
  .min-h-screen {
    min-height: auto !important;
    background: white !important;
  }
  
  /* Compact styling for print */
  .print-compact {
    padding: 8px !important;
    margin-bottom: 8px !important;
  }
  
  .print-small-text {
    font-size: 11px !important;
  }
  
  /* Ensure everything fits on one page */
  .order-card {
    page-break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }
}
`

export default function OrderSuccess() {
  const { orderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  
  // Get order data from navigation state
  const orderData = location.state?.orderData || location.state?.order

  // Use order data from navigation state or fallback
  const order = orderData || {
    id: orderId,
    totalAmount: 0,
    subtotal: 0,
    shipping: 0,
    total: 0,
    items: [],
    name: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    description: '',
    paymentMethod: 'cod',
    orderDate: new Date().toISOString()
  }

  // Calculate values
  const subtotal = order.subtotal || order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0
  const shipping = order.shipping !== undefined ? order.shipping : (subtotal >= 5000 ? 0 : 250)
  const total = order.total || order.totalAmount || (subtotal + shipping)
  const paymentMethod = order.paymentMethod || 'cod'
  const customerName = order.name || `${order.first_name || ''} ${order.last_name || ''}`.trim() || 'Customer'
  const orderDate = order.orderDate ? new Date(order.orderDate) : new Date()
  // Use the full backend-generated order ID for tracking - check all possible field names
  const orderNumber = order.orderId || order.order_id || order.id || order._id || orderId || 'N/A'
  
  // Get customer phone for tracking reminder
  const customerPhone = order.phone || ''
  
  // Get order status from backend (default to 'pending' for new orders)
  const orderStatus = order.status?.toLowerCase() || 'pending'
  
  // Define status steps with dynamic completion based on order.status
  const getStatusSteps = () => {
    const statusMap = {
      'pending': 1,
      'confirmed': 1,
      'processing': 2,
      'shipped': 3,
      'out_for_delivery': 3,
      'delivered': 4,
      'cancelled': 0
    }
    
    const currentStep = statusMap[orderStatus] || 1
    
    return [
      { 
        step: 1, 
        status: 'Order Confirmed', 
        desc: 'Your order has been received', 
        completed: currentStep >= 1,
        current: currentStep === 1
      },
      { 
        step: 2, 
        status: 'Processing', 
        desc: 'We are preparing your items', 
        completed: currentStep >= 2,
        current: currentStep === 2
      },
      { 
        step: 3, 
        status: 'Shipped', 
        desc: 'Your package is on the way', 
        completed: currentStep >= 3,
        current: currentStep === 3
      },
      { 
        step: 4, 
        status: 'Delivered', 
        desc: 'Package delivered', 
        completed: currentStep >= 4,
        current: currentStep === 4
      }
    ]
  }
  
  const statusSteps = getStatusSteps()
  const isCancelled = orderStatus === 'cancelled'

  // Copy order number to clipboard
  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Print Styles */}
      <style>{printStyles}</style>
      
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50">
        <div className="max-w-3xl px-4 py-8 mx-auto print-invoice sm:px-6 lg:px-8">
          
          {/* Success Icon - Hidden on print */}
          <div className="mb-6 text-center no-print">
            <div className="inline-block p-3 mb-3 bg-green-100 rounded-full">
              <Check size={48} className="text-green-600" />
            </div>
            <h1 className="mb-1 text-3xl font-bold text-gray-900">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase, {customerName.split(' ')[0]}!</p>
          </div>

          {/* Order Details Card - Main Invoice */}
          <div className="p-6 mb-6 bg-white shadow-lg order-card rounded-2xl">
            
            {/* Invoice Header - Shows on print */}
            <div className="hidden print:block pb-4 mb-4 text-center border-b-2 border-gray-300">
              <h1 className="text-2xl font-bold text-gray-900">ePasaley</h1>
              <p className="text-sm text-gray-500">Order Invoice</p>
            </div>
            
            {/* Order Number */}
            <div className="pb-4 mb-4 text-center border-b-2 border-gray-200 border-dashed print-compact">
              <p className="mb-1 text-xs font-medium text-gray-500 uppercase">Order Number</p>
              <div className="flex items-center justify-center gap-2">
                <p className="font-mono text-2xl font-bold tracking-wider text-green-600">#{orderNumber}</p>
                <button 
                  onClick={copyOrderNumber}
                  className="p-1.5 text-gray-500 transition rounded-lg no-print hover:text-green-600 hover:bg-green-50"
                  title="Copy order number"
                >
                  {copied ? <CheckCircle size={18} className="text-green-600" /> : <Copy size={18} />}
                </button>
              </div>
              {copied && <p className="mt-1 text-xs text-green-600 no-print">Copied!</p>}
              <p className="mt-2 text-xs text-gray-500">
                <Calendar className="inline w-3 h-3 mr-1" />
                {orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

          {/* Save This Info Box - Track Order Instructions - HIDDEN ON PRINT */}
          <div className="p-5 mb-6 border-2 border-green-200 no-print tracking-info-box rounded-xl bg-green-50">
            <h3 className="flex items-center gap-2 mb-3 font-bold text-green-800">
              <FileText size={18} /> 📋 Save This For Tracking
            </h3>
            <p className="mb-3 text-sm text-green-700">
              To track your order, go to <strong>"Track Order"</strong> section and enter:
            </p>
            
            {/* Tracking Credentials Box */}
            <div className="p-4 mb-3 bg-white border border-green-300 rounded-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div>
                    <span className="text-xs text-gray-500 uppercase">Order ID</span>
                    <p className="font-mono text-lg font-bold text-gray-900">{orderNumber}</p>
                  </div>
                  <button 
                    onClick={copyOrderNumber}
                    className="p-2 text-gray-500 transition rounded-lg hover:text-green-600 hover:bg-green-50"
                    title="Copy order ID"
                  >
                    {copied ? <CheckCircle size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div>
                    <span className="text-xs text-gray-500 uppercase">Phone Number</span>
                    <p className="font-mono text-lg font-bold text-gray-900">{customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {copied && <p className="mb-2 text-sm text-center text-green-600">✓ Order ID copied!</p>}
            
            <p className="text-xs text-green-600">
              💡 <strong>Tip:</strong> Take a screenshot of this page for your records.
            </p>
          </div>

          {/* Payment Method - Compact for print */}
          <div className="flex items-center gap-3 p-3 mb-4 print-compact rounded-xl bg-gray-50">
            <CreditCard className="text-gray-600" size={20} />
            <div>
              <p className="text-sm font-semibold text-gray-900">Payment: {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'khalti' ? 'Khalti' : 'eSewa'}</p>
            </div>
          </div>

          {/* Order Items - Compact table for print */}
          {order.items && order.items.length > 0 && (
            <div className="pb-4 mb-4 border-b print-compact">
              <h2 className="flex items-center gap-2 mb-3 text-base font-bold text-gray-900">
                <Package size={18} /> Items ({order.items.length})
              </h2>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 text-sm rounded-lg bg-gray-50 print-small-text">
                    <div className="flex items-center gap-2">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL}${item.imageUrl}`} 
                          alt={item.name} 
                          className="object-cover w-10 h-10 rounded no-print" 
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} × Rs. {item.price?.toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary - Compact */}
          <div className="pb-4 mb-4 border-b print-compact">
            <h2 className="mb-2 text-base font-bold text-gray-900">Summary</h2>
            <div className="p-3 space-y-2 text-sm rounded-xl bg-gray-50 print-small-text">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `Rs. ${shipping}`}</span>
              </div>
              <div className="flex justify-between pt-2 text-lg font-bold text-gray-900 border-t border-gray-200">
                <span>Total</span>
                <span className="text-green-600">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information - Compact grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 print-compact">
            <div className="p-3 rounded-xl bg-gray-50">
              <h3 className="flex items-center gap-1 mb-2 text-sm font-bold text-gray-900">
                <MapPin size={14} className="text-green-600" /> Ship To
              </h3>
              <p className="text-sm font-medium text-gray-900">{customerName}</p>
              <p className="text-xs text-gray-600">{order.address}</p>
              <p className="text-xs text-gray-600">{order.city}, {order.district}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50">
              <h3 className="flex items-center gap-1 mb-2 text-sm font-bold text-gray-900">
                <Phone size={14} className="text-green-600" /> Contact
              </h3>
              <p className="text-sm text-gray-600">Phone: <span className="font-medium">{order.phone}</span></p>
            </div>
          </div>

          {/* Status Timeline - HIDDEN ON PRINT */}
          <div className="pb-4 mb-4 border-b no-print status-timeline">
            <h2 className="flex items-center gap-2 mb-3 text-base font-bold text-gray-900">
              <Truck size={18} /> Order Status
            </h2>
            
            {/* Cancelled Order Message */}
            {isCancelled && (
              <div className="p-3 mb-3 border border-red-200 rounded-xl bg-red-50">
                <p className="text-sm font-semibold text-red-700">❌ This order has been cancelled</p>
              </div>
            )}
            
            {/* Current Status Badge */}
            {!isCancelled && (
              <div className="p-2 mb-3 border border-green-200 rounded-lg bg-green-50">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Current Status:</span>{' '}
                  <span className="px-2 py-1 text-xs font-bold text-white bg-green-600 rounded-full">
                    {statusSteps.find(s => s.current)?.status || 'Order Confirmed'}
                  </span>
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              {statusSteps.map((item) => (
                <div key={item.step} className={`flex items-start gap-4 ${isCancelled ? 'opacity-50' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    item.completed
                      ? 'bg-green-500 text-white'
                      : item.current
                      ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {item.completed ? <Check size={18} /> : item.step}
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold ${
                        item.completed ? 'text-green-600' : 
                        item.current ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {item.status}
                      </p>
                      {item.current && !isCancelled && (
                        <span className="px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full animate-pulse">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Progress Bar */}
            {!isCancelled && (
              <div className="mt-6">
                <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                  <div 
                    className="h-full transition-all duration-500 bg-green-500 rounded-full"
                    style={{ width: `${(statusSteps.filter(s => s.completed).length / statusSteps.length) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-center text-gray-500">
                  {statusSteps.filter(s => s.completed).length} of {statusSteps.length} steps completed
                </p>
              </div>
            )}
          </div>

          {/* COD Info - Hidden on Print */}
          {paymentMethod === 'cod' && (
            <div className="p-3 mb-4 border border-yellow-200 no-print rounded-xl bg-yellow-50">
              <p className="text-sm text-yellow-800">
                <strong>💵 Cash on Delivery:</strong> Keep Rs. {total.toLocaleString()} ready when your order arrives.
              </p>
            </div>
          )}

          {/* Important Info - Hidden on Print */}
          <div className="p-3 border border-blue-200 no-print rounded-xl bg-blue-50">
            <p className="text-sm text-blue-900">
              <strong>📦 What's Next?</strong> Our delivery partner will contact you at <strong>{order.phone}</strong> before delivery. Expected delivery: 3-5 business days.
            </p>
          </div>
          
          {/* Print Footer - Only shows on print */}
          <div className="hidden print:block pt-4 mt-4 text-center border-t border-gray-300">
            <p className="text-xs text-gray-600">Thank you for shopping with ePasaley!</p>
            <p className="text-xs text-gray-500">Contact: +977 9860056658 | www.epasaley.com</p>
          </div>
        </div>

        {/* Action Buttons - Hidden on Print */}
        <div className="grid grid-cols-1 gap-4 no-print action-buttons md:grid-cols-2">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-6 py-4 font-semibold text-gray-900 transition border-2 border-gray-300 rounded-xl hover:bg-gray-50"
          >
            <Download size={20} />
            Print Invoice
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-4 font-semibold text-white transition bg-green-600 rounded-xl hover:bg-green-700"
          >
            <Home size={20} />
            Continue Shopping
          </button>
        </div>

        {/* Need Help - Hidden on Print */}
        <div className="p-4 mt-6 text-center bg-white shadow no-print need-help-section rounded-xl">
          <p className="text-sm text-gray-600">
            Need help? Call us at <a href="tel:+9779860056658" className="font-semibold text-green-600">+977 9860056658</a>
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
