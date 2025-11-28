import { useEffect } from 'react';
import { useOrderStore } from '../store/orderstore';
import toast, { Toaster } from 'react-hot-toast';
import { Package, Truck, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

export default function OrderCRUD() {
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrderStore();

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

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 bg-clip-text text-transparent mb-2">Orders</h1>
            <p className="text-gray-400">Manage and track customer orders</p>
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
          ) : orders && orders.length > 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
              <table className="w-full">
                <thead className="bg-gray-700/50 border-b border-gray-700">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300">Order ID</th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300">Customer</th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300">Items</th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300">Total</th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-8 py-5 text-left text-sm font-semibold text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {orders.map(order => {
                    const config = statusConfig[order.status] || statusConfig.pending;
                    return (
                      <tr key={order.id || order._id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-8 py-5">
                          <span className="font-bold text-cyan-300">#{order.id || order._id}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div>
                            <p className="text-white font-medium">{order.customerName || order.name || 'N/A'}</p>
                            <p className="text-gray-400 text-sm">{order.email || order.customerEmail || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-gray-300">{order.items?.length || 0} items</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="font-bold text-lg text-cyan-300">Rs. {(order.totalAmount || 0).toFixed(2)}</span>
                        </td>
                        <td className="px-8 py-5">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${config.bg} ${config.text} ${config.border} font-semibold`}>
                            {getStatusIcon(order.status)}
                            {config.label}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          {order.status !== 'delivered' && order.status !== 'cancelled' ? (
                            <button
                              onClick={() => handleStatusUpdate(order.id || order._id, nextStatus(order.status))}
                              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl text-sm"
                            >
                              Next Status →
                            </button>
                          ) : (
                            <span className="text-gray-500 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 text-lg">No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}