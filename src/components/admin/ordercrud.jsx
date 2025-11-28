import { useEffect, useState } from 'react';
import { useOrderStore } from '../store/orderstore';
import toast, { Toaster } from 'react-hot-toast';
import { Package, Truck, CheckCircle, Clock, AlertCircle, Loader2, Eye, X, MapPin, Phone, User, ShoppingBag, Calendar, RefreshCw } from 'lucide-react';

export default function OrderCRUD() {
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const statusConfig = {
    pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-300', border: 'border-yellow-500/30', icon: Clock, label: 'Pending' },
    processing: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30', icon: Package, label: 'Processing' },
    shipped: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30', icon: Truck, label: 'Shipped' },
    delivered: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30', icon: CheckCircle, label: 'Delivered' },
    cancelled: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-500/30', icon: AlertCircle, label: 'Cancelled' },
  };

  const nextStatus = (current) => {
    const flow = ['pending', 'processing', 'shipped', 'delivered'];
    const idx = flow.indexOf(current);
    return idx < flow.length - 1 ? flow[idx + 1] : current;
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}!`);
    } catch {
      toast.error('Failed to update order status');
    }
  };

  const getStatusIcon = (status) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return <Icon className="w-5 h-5" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter orders based on status
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  // Count orders by status
  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 bg-clip-text text-transparent mb-2">Orders</h1>
              <p className="text-gray-400">Manage and track customer orders</p>
            </div>
            <button
              onClick={() => fetchOrders()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {Object.entries(orderCounts).map(([status, count]) => {
              const config = statusConfig[status] || { bg: 'bg-gray-500/20', text: 'text-gray-300', border: 'border-gray-500/30' };
              const isActive = statusFilter === status;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`p-4 rounded-xl border transition-all ${
                    isActive 
                      ? 'bg-cyan-500/20 border-cyan-500/50 ring-2 ring-cyan-500/30' 
                      : `${config.bg} ${config.border} hover:opacity-80`
                  }`}
                >
                  <p className={`text-2xl font-bold ${isActive ? 'text-cyan-300' : config.text}`}>{count}</p>
                  <p className="text-gray-400 text-sm capitalize">{status === 'all' ? 'All Orders' : status}</p>
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Orders Table */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
            </div>
          ) : filteredOrders && filteredOrders.length > 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50 border-b border-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Items</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredOrders.map(order => {
                      const config = statusConfig[order.status] || statusConfig.pending;
                      const customerName = order.first_name && order.last_name 
                        ? `${order.first_name} ${order.last_name}` 
                        : order.name || 'N/A';
                      return (
                        <tr key={order.id || order._id} className="hover:bg-gray-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-bold text-cyan-300 text-sm">
                              #{(order.id || order._id)?.toString().slice(-8)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-white font-medium">{customerName}</p>
                              <p className="text-gray-400 text-sm flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {order.phone || 'N/A'}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <p className="text-gray-300">{order.city || 'N/A'}</p>
                              <p className="text-gray-500">{order.district || 'N/A'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-300 bg-gray-700 px-2 py-1 rounded text-sm">
                              {order.items?.length || 0} items
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-cyan-300">Rs. {(order.totalAmount || 0).toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-400 text-sm">{formatDate(order.created_at)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm ${config.bg} ${config.text} ${config.border} font-medium`}>
                              {getStatusIcon(order.status)}
                              {config.label}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleStatusUpdate(order.id || order._id, nextStatus(order.status))}
                                  className="px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all text-sm"
                                >
                                  Next →
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 text-lg">
                {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-white">Order Details</h2>
                <p className="text-cyan-400 font-mono">#{(selectedOrder.id || selectedOrder._id)?.toString().slice(-8)}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${statusConfig[selectedOrder.status]?.bg} ${statusConfig[selectedOrder.status]?.text} ${statusConfig[selectedOrder.status]?.border} font-semibold`}>
                  {getStatusIcon(selectedOrder.status)}
                  {statusConfig[selectedOrder.status]?.label || 'Pending'}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  {formatDate(selectedOrder.created_at)}
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-700/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Name</p>
                    <p className="text-white font-medium">
                      {selectedOrder.first_name && selectedOrder.last_name 
                        ? `${selectedOrder.first_name} ${selectedOrder.last_name}` 
                        : selectedOrder.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="text-white font-medium">{selectedOrder.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-700/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Shipping Address
                </h3>
                <div className="text-sm space-y-2">
                  <p className="text-white">{selectedOrder.address || 'N/A'}</p>
                  <p className="text-gray-400">
                    {selectedOrder.city}, {selectedOrder.district}
                  </p>
                  {selectedOrder.description && (
                    <p className="text-gray-500 italic mt-2">Note: {selectedOrder.description}</p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-700/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-cyan-400" />
                  Order Items ({selectedOrder.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-gray-800 rounded-lg p-3">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.name || 'Product'}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity || 1}</p>
                      </div>
                      <p className="text-cyan-300 font-semibold">
                        Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-4 border border-cyan-500/30">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-lg">Total Amount</span>
                  <span className="text-3xl font-bold text-cyan-300">
                    Rs. {(selectedOrder.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status Update Buttons */}
              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.id || selectedOrder._id, nextStatus(selectedOrder.status));
                      setSelectedOrder(null);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-semibold transition-all"
                  >
                    Update to {statusConfig[nextStatus(selectedOrder.status)]?.label}
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedOrder.id || selectedOrder._id, 'cancelled');
                      setSelectedOrder(null);
                    }}
                    className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl font-semibold transition-all"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}