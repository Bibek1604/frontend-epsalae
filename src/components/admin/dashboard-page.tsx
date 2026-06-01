// src/pages/admin/DashboardPage.tsx
// Admin dashboard with analytics and key metrics

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import useAdminApi from '@/hooks/useAdminApi';
import './dashboard-page.css';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  averageOrderValue: number;
  orderGrowth: number;
  revenueGrowth: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

interface TopProduct {
  _id: string;
  name: string;
  sales: number;
  revenue: number;
  image?: string;
}

export const DashboardPage: React.FC = () => {
  const { loading, error } = useAdminApi();

  const [pageLoading, setPageLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    averageOrderValue: 0,
    orderGrowth: 0,
    revenueGrowth: 0,
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [chartData, setChartData] = useState<{ month: string; revenue: number; orders: number }[]>([]);

  // Simulate fetching dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate API call with mock data
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock stats
        setStats({
          totalOrders: 1250,
          totalRevenue: 45680.5,
          activeUsers: 3421,
          averageOrderValue: 36.54,
          orderGrowth: 12.5,
          revenueGrowth: 8.3,
        });

        // Mock recent orders
        setRecentOrders([
          {
            _id: '1',
            orderNumber: '#ORD-10001',
            customer: 'John Doe',
            amount: 249.99,
            status: 'Delivered',
            date: '2026-05-29',
          },
          {
            _id: '2',
            orderNumber: '#ORD-10002',
            customer: 'Jane Smith',
            amount: 89.5,
            status: 'Processing',
            date: '2026-05-28',
          },
          {
            _id: '3',
            orderNumber: '#ORD-10003',
            customer: 'Mike Johnson',
            amount: 149.99,
            status: 'Shipped',
            date: '2026-05-28',
          },
          {
            _id: '4',
            orderNumber: '#ORD-10004',
            customer: 'Sarah Williams',
            amount: 79.99,
            status: 'Pending',
            date: '2026-05-27',
          },
          {
            _id: '5',
            orderNumber: '#ORD-10005',
            customer: 'Tom Brown',
            amount: 199.99,
            status: 'Delivered',
            date: '2026-05-27',
          },
        ]);

        // Mock top products
        setTopProducts([
          { _id: '1', name: 'Wireless Headphones Pro', sales: 342, revenue: 67968 },
          { _id: '2', name: 'USB-C Cable Bundle', sales: 521, revenue: 5210 },
          { _id: '3', name: 'Phone Screen Protector', sales: 814, revenue: 8140 },
          { _id: '4', name: 'Laptop Stand', sales: 156, revenue: 7800 },
          { _id: '5', name: 'Wireless Mouse', sales: 287, revenue: 8610 },
        ]);

        // Mock chart data
        setChartData([
          { month: 'Jan', revenue: 8000, orders: 120 },
          { month: 'Feb', revenue: 9200, orders: 140 },
          { month: 'Mar', revenue: 7800, orders: 110 },
          { month: 'Apr', revenue: 10500, orders: 160 },
          { month: 'May', revenue: 12300, orders: 185 },
          { month: 'Jun', revenue: 14200, orders: 210 },
        ]);
      } finally {
        setPageLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
      default:
        return 'secondary';
    }
  };

  return (
    <AdminLayout currentPage="dashboard">
      <div className="page-container">
        {/* Page Header */}
        <div className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's your business overview</p>
          </div>
          <div className="header-actions">
            <span className="last-updated">Last updated: Today at {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {pageLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics Cards */}
            <div className="metrics-grid">
              {/* Total Orders */}
              <div className="metric-card">
                <div className="metric-header">
                  <h3>Total Orders</h3>
                  <ShoppingCart className="metric-icon" size={24} />
                </div>
                <div className="metric-value">{stats.totalOrders.toLocaleString()}</div>
                <div className="metric-footer">
                  <span className="trend up">
                    <TrendingUp size={16} />
                    {stats.orderGrowth}% from last month
                  </span>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="metric-card">
                <div className="metric-header">
                  <h3>Total Revenue</h3>
                  <DollarSign className="metric-icon" size={24} />
                </div>
                <div className="metric-value">{formatCurrency(stats.totalRevenue)}</div>
                <div className="metric-footer">
                  <span className="trend up">
                    <TrendingUp size={16} />
                    {stats.revenueGrowth}% from last month
                  </span>
                </div>
              </div>

              {/* Active Users */}
              <div className="metric-card">
                <div className="metric-header">
                  <h3>Active Users</h3>
                  <Users className="metric-icon" size={24} />
                </div>
                <div className="metric-value">{stats.activeUsers.toLocaleString()}</div>
                <div className="metric-footer">
                  <span className="trend neutral">
                    <Activity size={16} />
                    Online this month
                  </span>
                </div>
              </div>

              {/* Average Order Value */}
              <div className="metric-card">
                <div className="metric-header">
                  <h3>Avg Order Value</h3>
                  <DollarSign className="metric-icon" size={24} />
                </div>
                <div className="metric-value">{formatCurrency(stats.averageOrderValue)}</div>
                <div className="metric-footer">
                  <span className="trend neutral">
                    <Activity size={16} />
                    Per transaction
                  </span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
              {/* Revenue & Orders Chart */}
              <div className="chart-card">
                <h2>Revenue & Orders Trend</h2>
                <div className="chart-placeholder">
                  <div className="chart-bars">
                    {chartData.map((data, index) => (
                      <div key={index} className="chart-bar-group">
                        <div className="bar-label">{data.month}</div>
                        <div className="bars-container">
                          <div className="bar revenue" style={{ height: `${(data.revenue / 15000) * 100}%` }}>
                            <span className="bar-value">${data.revenue / 1000}k</span>
                          </div>
                          <div
                            className="bar orders"
                            style={{ height: `${(data.orders / 250) * 100}%` }}
                            title={`${data.orders} orders`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="chart-legend">
                  <span className="legend-item">
                    <span className="legend-color revenue"></span>Revenue
                  </span>
                  <span className="legend-item">
                    <span className="legend-color orders"></span>Orders
                  </span>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="dashboard-grid">
              {/* Recent Orders */}
              <div className="dashboard-card">
                <h2>Recent Orders</h2>
                {recentOrders.length === 0 ? (
                  <div className="empty-state">
                    <p>No recent orders</p>
                  </div>
                ) : (
                  <div className="orders-table">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Order</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order._id}>
                            <td>
                              <span className="order-number">{order.orderNumber}</span>
                            </td>
                            <td>{order.customer}</td>
                            <td>
                              <strong>{formatCurrency(order.amount)}</strong>
                            </td>
                            <td>
                              <span className={`badge ${getStatusColor(order.status)}`}>{order.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Top Products */}
              <div className="dashboard-card">
                <h2>Top Products</h2>
                {topProducts.length === 0 ? (
                  <div className="empty-state">
                    <p>No product data</p>
                  </div>
                ) : (
                  <div className="products-list">
                    {topProducts.map((product, index) => (
                      <div key={product._id} className="product-item">
                        <div className="product-rank">#{index + 1}</div>
                        <div className="product-details">
                          <h4>{product.name}</h4>
                          <p className="product-stats">
                            {product.sales} sales • {formatCurrency(product.revenue)}
                          </p>
                        </div>
                        <div className="product-revenue">{formatCurrency(product.revenue)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Activity Summary */}
            <div className="dashboard-card full-width">
              <h2>Quick Stats</h2>
              <div className="stats-summary">
                <div className="stat-item">
                  <span className="stat-label">Conversion Rate</span>
                  <span className="stat-value">3.24%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Avg Session Duration</span>
                  <span className="stat-value">4m 32s</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Bounce Rate</span>
                  <span className="stat-value">42.5%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Customer Retention</span>
                  <span className="stat-value">68.3%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Return Customers</span>
                  <span className="stat-value">1,247</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">New Customers</span>
                  <span className="stat-value">634</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
