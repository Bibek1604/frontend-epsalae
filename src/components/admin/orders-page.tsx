// src/pages/admin/OrdersPage.tsx
// Admin orders management page

import React, { useState, useEffect } from 'react';
import { Eye, Trash2, ChevronDown, Package } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import useAdminApi from '@/hooks/useAdminApi';
import './orders-page.css';

interface OrderItem {
  _id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const OrdersPage: React.FC = () => {
  const { loading, error } = useAdminApi();

  const [orders, setOrders] = useState<Order[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<{ orderId: string; newStatus: string } | null>(null);

  // Mock orders data - replace with actual API call
  useEffect(() => {
    const loadOrders = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const mockOrders: Order[] = [
          {
            _id: '1',
            orderNumber: '#ORD-10001',
            customer: { name: 'John Doe', email: 'john@example.com', phone: '555-0001' },
            items: [
              { _id: '1', productId: '1', productName: 'Wireless Headphones', quantity: 1, price: 249.99 },
            ],
            subtotal: 249.99,
            tax: 20.0,
            shipping: 10.0,
            total: 279.99,
            status: 'delivered',
            paymentMethod: 'Credit Card',
            shippingAddress: '123 Main St, City, State 12345',
            createdAt: '2026-05-29T10:30:00Z',
            updatedAt: '2026-05-29T14:30:00Z',
          },
          {
            _id: '2',
            orderNumber: '#ORD-10002',
            customer: { name: 'Jane Smith', email: 'jane@example.com', phone: '555-0002' },
            items: [
              { _id: '2', productId: '2', productName: 'USB-C Cables (Pack of 3)', quantity: 2, price: 10.0 },
            ],
            subtotal: 20.0,
            tax: 1.6,
            shipping: 5.0,
            total: 26.6,
            status: 'processing',
            paymentMethod: 'PayPal',
            shippingAddress: '456 Oak Ave, Town, State 54321',
            createdAt: '2026-05-28T15:45:00Z',
            updatedAt: '2026-05-28T16:00:00Z',
          },
          {
            _id: '3',
            orderNumber: '#ORD-10003',
            customer: { name: 'Mike Johnson', email: 'mike@example.com', phone: '555-0003' },
            items: [
              { _id: '3', productId: '3', productName: 'Phone Screen Protector', quantity: 5, price: 9.99 },
            ],
            subtotal: 49.95,
            tax: 4.0,
            shipping: 10.0,
            total: 63.95,
            status: 'shipped',
            paymentMethod: 'Debit Card',
            shippingAddress: '789 Pine Rd, Village, State 99999',
            createdAt: '2026-05-27T09:15:00Z',
            updatedAt: '2026-05-28T11:00:00Z',
          },
          {
            _id: '4',
            orderNumber: '#ORD-10004',
            customer: { name: 'Sarah Williams', email: 'sarah@example.com', phone: '555-0004' },
            items: [
              { _id: '4', productId: '4', productName: 'Laptop Stand', quantity: 1, price: 79.99 },
              { _id: '5', productId: '5', productName: 'Wireless Mouse', quantity: 1, price: 30.0 },
            ],
            subtotal: 109.99,
            tax: 8.8,
            shipping: 0.0,
            total: 118.79,
            status: 'pending',
            paymentMethod: 'Credit Card',
            shippingAddress: '321 Elm St, City, State 11111',
            createdAt: '2026-05-26T13:20:00Z',
            updatedAt: '2026-05-26T13:20:00Z',
          },
          {
            _id: '5',
            orderNumber: '#ORD-10005',
            customer: { name: 'Tom Brown', email: 'tom@example.com', phone: '555-0005' },
            items: [
              { _id: '6', productId: '1', productName: 'Wireless Headphones', quantity: 2, price: 249.99 },
            ],
            subtotal: 499.98,
            tax: 40.0,
            shipping: 15.0,
            total: 554.98,
            status: 'delivered',
            paymentMethod: 'Apple Pay',
            shippingAddress: '654 Birch Ln, Town, State 22222',
            createdAt: '2026-05-25T16:45:00Z',
            updatedAt: '2026-05-26T10:00:00Z',
          },
        ];

        setOrders(mockOrders);
      } finally {
        setPageLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Show toast
  useEffect(() => {
    if (error) {
      setToast({ type: 'error', message: error });
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      // Simulate API call
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === orderId ? { ...order, status: newStatus as any } : order))
      );
      setToast({ type: 'success', message: 'Order status updated successfully' });
      setUpdateStatus(null);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update order status' });
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
      setToast({ type: 'success', message: 'Order deleted successfully' });
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete order' });
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'error';
      default:
        return 'secondary';
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === '' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout currentPage="orders">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Orders</h1>
            <p>Manage and track customer orders</p>
          </div>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)}>×</button>
          </div>
        )}

        {/* Filters */}
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search by order number or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span className="result-count">{filteredOrders.length} orders</span>
        </div>

        {/* Loading State */}
        {pageLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : (
          <>
            {/* Orders List */}
            <div className="orders-container">
              {filteredOrders.length === 0 ? (
                <div className="empty-state">
                  <Package size={48} />
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="orders-list">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="order-card">
                      <div
                        className="order-header"
                        onClick={() =>
                          setExpandedOrder(expandedOrder === order._id ? null : order._id)
                        }
                      >
                        <div className="order-info">
                          <div className="order-number">{order.orderNumber}</div>
                          <div className="order-customer">
                            <span className="customer-name">{order.customer.name}</span>
                            <span className="customer-email">{order.customer.email}</span>
                          </div>
                        </div>

                        <div className="order-meta">
                          <div className="order-date">{formatDate(order.createdAt)}</div>
                          <span className={`badge ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>

                        <div className="order-total">{formatCurrency(order.total)}</div>

                        <button className="expand-btn">
                          <ChevronDown size={20} />
                        </button>
                      </div>

                      {/* Expanded Order Details */}
                      {expandedOrder === order._id && (
                        <div className="order-details">
                          <div className="details-grid">
                            {/* Order Items */}
                            <div className="details-section">
                              <h4>Order Items</h4>
                              <table className="items-table">
                                <thead>
                                  <tr>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item) => (
                                    <tr key={item._id}>
                                      <td>{item.productName}</td>
                                      <td className="text-center">{item.quantity}</td>
                                      <td>{formatCurrency(item.price)}</td>
                                      <td>{formatCurrency(item.price * item.quantity)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Order Summary */}
                            <div className="details-section">
                              <h4>Order Summary</h4>
                              <div className="summary-items">
                                <div className="summary-row">
                                  <span>Subtotal</span>
                                  <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="summary-row">
                                  <span>Tax</span>
                                  <span>{formatCurrency(order.tax)}</span>
                                </div>
                                <div className="summary-row">
                                  <span>Shipping</span>
                                  <span>{formatCurrency(order.shipping)}</span>
                                </div>
                                <div className="summary-row total">
                                  <span>Total</span>
                                  <span>{formatCurrency(order.total)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Shipping & Customer Info */}
                            <div className="details-section">
                              <h4>Shipping Address</h4>
                              <p className="address">{order.shippingAddress}</p>

                              <h4>Customer Contact</h4>
                              <p className="contact">
                                <strong>Email:</strong> {order.customer.email}
                              </p>
                              <p className="contact">
                                <strong>Phone:</strong> {order.customer.phone}
                              </p>
                            </div>

                            {/* Payment Info */}
                            <div className="details-section">
                              <h4>Payment Details</h4>
                              <p className="payment">
                                <strong>Method:</strong> {order.paymentMethod}
                              </p>
                              <p className="payment">
                                <strong>Status:</strong>{' '}
                                <span className="badge success">Paid</span>
                              </p>
                            </div>
                          </div>

                          {/* Order Actions */}
                          <div className="order-actions">
                            <div className="status-update">
                              <label>Update Status</label>
                              <select
                                value={updateStatus?.orderId === order._id ? updateStatus.newStatus : order.status}
                                onChange={(e) => {
                                  if (e.target.value !== order.status) {
                                    setUpdateStatus({ orderId: order._id, newStatus: e.target.value });
                                  }
                                }}
                                className="status-select"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              {updateStatus?.orderId === order._id && (
                                <button
                                  className="btn btn-primary"
                                  onClick={() => {
                                    if (updateStatus) {
                                      handleStatusUpdate(updateStatus.orderId, updateStatus.newStatus);
                                    }
                                  }}
                                  disabled={loading}
                                >
                                  {loading ? 'Updating...' : 'Update Status'}
                                </button>
                              )}
                            </div>

                            <button
                              className="btn btn-secondary"
                              onClick={() => handleDeleteOrder(order._id)}
                            >
                              Delete Order
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
