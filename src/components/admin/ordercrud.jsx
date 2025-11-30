// src/pages/OrderCRUD.jsx
import { useEffect, useState } from 'react';
import { useOrderStore } from '../store/orderstore';
import toast, { Toaster } from 'react-hot-toast';
import {
  Package, Truck, CheckCircle, Clock, AlertCircle, Loader2, Eye, X,
  MapPin, Phone, User, ShoppingBag, Calendar, RefreshCw
} from 'lucide-react';

export default function OrderCRUD() {
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ePasaley Brand Status Colors
  const statusConfig = {
    pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300', icon: Clock, label: 'Pending' },
    processing: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300', icon: Package, label: 'Processing' },
    shipped: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', icon: Truck, label: 'Shipped' },
    delivered: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300', icon: CheckCircle, label: 'Delivered' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300', icon: AlertCircle, label: 'Cancelled' },
  };

  const nextStatus = (current) => {
    const flow = ['pending', 'processing', 'shipped', 'delivered'];
    const idx = flow.indexOf(current);
    return idx < flow.length - 1 ? flow[idx + 1] : current;
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Order updated to ${statusConfig[newStatus]?.label || newStatus}!`);
    } catch {
      toast.error('Failed to update order');
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
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

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
      <Toaster position="top-right" />

      {/* ePasaley Premium Background */}
      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 lg:p-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-6 mb-10 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#1A3C8A] mb-2">Orders</h1>
              <p className="text-[#7A7A7A]">Manage and fulfill customer orders</p>
            </div>
            <button
              onClick={() => fetchOrders()}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
              Refresh Orders
            </button>
          </div>

          {/* Status Filter Cards */}
          <div className="grid grid-cols-2 gap-5 mb-10 md:grid-cols-3 lg:grid-cols-6">
            {Object.entries(orderCounts).map(([status, count]) => {
              const config = status === 'all'
                ? { bg: 'bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35]', text: 'text-white' }
                : statusConfig[status] || statusConfig.pending;
              const isActive = statusFilter === status;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                    isActive
                      ? 'border-[#FF6B35] shadow-2xl ring-4 ring-[#FF6B35]/20'
                      : 'border-gray-200 hover:border-[#FF6B35]/50'
                  } ${status === 'all' ? config.bg : config.bg}`}
                >
                  <p className={`text-3xl font-bold ${config.text}`}>{count}</p>
                  <p className={`text-sm font-medium mt-1 ${status === 'all' ? 'text-white/90' : 'text-gray-600'}`}>
                    {status === 'all' ? 'All Orders' : config.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-6 mb-8 text-red-700 border border-red-200 bg-red-50 rounded-2xl">
              <AlertCircle className="w-6 h-6" />
              {error}
            </div>
          )}

          {/* Orders Table */}
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-16 h-16 animate-spin text-[#FF6B35]" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-[#EFEFEF]">
              <Package className="w-24 h-24 text-[#1A3C8A]/20 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#2E2E2E]">No orders found</h3>
              <p className="text-[#7A7A7A] mt-2">Waiting for your first sale!</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-[#EFEFEF] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] text-white">
                      <th className="px-8 py-6 font-bold text-left">Order ID</th>
                      <th className="px-8 py-6 font-bold text-left">Customer</th>
                      <th className="px-8 py-6 font-bold text-left">Location</th>
                      <th className="px-8 py-6 font-bold text-center">Items</th>
                      <th className="px-8 py-6 font-bold text-center">Total</th>
                      <th className="px-8 py-6 font-bold text-center">Date</th>
                      <th className="px-8 py-6 font-bold text-center">Status</th>
                      <th className="px-8 py-6 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, i) => {
                      const config = statusConfig[order.status] || statusConfig.pending;
                      const orderId = order._id || order.id || `order-${i}`;
                      const customerName = order.first_name && order.last_name
                        ? `${order.first_name} ${order.last_name}`
                        : order.name || 'Customer';

                      return (
                        <tr
                          key={orderId}
                          className={`border-b border-gray-100 hover:bg-orange-50/30 transition-all ${
                            i % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                          }`}
                        >
                          <td className="px-8 py-6">
                            <span className="font-bold text-[#1A3C8A]">#{String(orderId).slice(-8)}</span>
                          </td>
                          <td className="px-8 py-6">
                            <div>
                              <p className="font-bold text-[#2E2E2E]">{customerName}</p>
                              <p className="text-sm text-[#7A7A7A] flex items-center gap-1">
                                <Phone className="w-4 h-4" /> {order.phone || 'N/A'}
                              </p>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-[#2E2E2E]">
                            {order.city}, {order.district}
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className="px-4 py-2 text-sm font-bold text-purple-700 bg-purple-100 rounded-full">
                              {order.items?.length || 0}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-center font-bold text-[#1A3C8A]">
                            Rs. {(order.totalAmount || 0).toLocaleString()}
                          </td>
                          <td className="px-8 py-6 text-center text-[#7A7A7A] text-sm">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-8 py-6 text-center">
                            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm ${config.bg} ${config.text} border ${config.border}`}>
                              {getStatusIcon(order.status)}
                              {config.label}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="p-3 bg-[#1A3C8A] text-white rounded-xl hover:bg-[#163180] transition shadow-md"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                                <button
                                  onClick={() => handleStatusUpdate(orderId, nextStatus(order.status))}
                                  className="px-5 py-3 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition"
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
          )}
        </div>
      </div>

      {/* Premium Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] text-white p-8 rounded-t-3xl relative">
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute p-2 transition rounded-full top-6 right-6 bg-white/20 hover:bg-white/30"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold">Order Details</h2>
              <p className="mt-2 text-lg text-white/90">#{String(selectedOrder._id || selectedOrder.id || '').slice(-8)}</p>
            </div>

            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full font-bold text-lg ${statusConfig[selectedOrder.status]?.bg} ${statusConfig[selectedOrder.status]?.text} border-2 ${statusConfig[selectedOrder.status]?.border}`}>
                  {getStatusIcon(selectedOrder.status)}
                  {statusConfig[selectedOrder.status]?.label}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  {formatDate(selectedOrder.created_at)}
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="p-6 bg-gray-50 rounded-2xl">
                  <h3 className="text-xl font-bold text-[#1A3C8A] mb-4 flex items-center gap-2">
                    <User className="w-6 h-6" /> Customer
                  </h3>
                  <p className="text-lg font-medium">
                    {selectedOrder.first_name && selectedOrder.last_name
                      ? `${selectedOrder.first_name} ${selectedOrder.last_name}`
                      : selectedOrder.name || 'Customer'}
                  </p>
                  <p className="flex items-center gap-2 mt-1 text-gray-600">
                    <Phone className="w-5 h-5" /> {selectedOrder.phone}
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl">
                  <h3 className="text-xl font-bold text-[#1A3C8A] mb-4 flex items-center gap-2">
                    <MapPin className="w-6 h-6" /> Delivery Address
                  </h3>
                  <p className="font-medium">{selectedOrder.address}</p>
                  <p className="text-gray-600">{selectedOrder.city}, {selectedOrder.district}</p>
                  {selectedOrder.description && (
                    <p className="mt-3 text-sm italic text-gray-500">Note: {selectedOrder.description}</p>
                  )}
                </div>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl">
                <h3 className="text-xl font-bold text-[#1A3C8A] mb-5 flex items-center gap-2">
                  <ShoppingBag className="w-6 h-6" /> Order Items
                </h3>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-5 p-4 bg-white shadow-sm rounded-xl">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="object-cover w-16 h-16 rounded-lg" />
                      ) : (
                        <div className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-lg">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-[#2E2E2E]">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                      </div>
                      <p className="font-bold text-[#1A3C8A]">
                        Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">Total Amount</span>
                  <span className="text-4xl font-bold">
                    Rs. {(selectedOrder.totalAmount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedOrder._id, nextStatus(selectedOrder.status));
                      setSelectedOrder(null);
                    }}
                    className="flex-1 py-5 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                  >
                    Mark as {statusConfig[nextStatus(selectedOrder.status)]?.label}
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedOrder._id, 'cancelled');
                      setSelectedOrder(null);
                    }}
                    className="px-10 py-5 font-bold text-white transition bg-red-500 rounded-2xl hover:bg-red-600"
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