// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useProductStore } from '../components/store/productstore';
import { useCategoryStore } from '../components/store/categorystore';
import { useOrderStore } from '../components/store/orderstore';
import { useCouponStore } from '../components/store/promocodestore';
import { useFlashSaleStore } from '../components/store/flashsalestore';
import { useBannerStore } from '../components/store/bannerstore';
import { useAdminAuth } from '../components/store/authstore';
import {
  Package, Tag, ShoppingCart, TicketPercent, Zap, ImageIcon,
  TrendingUp, AlertCircle, Loader2, ArrowUpRight, Award,
  DollarSign, Activity, CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const productStore = useProductStore();
  const categoryStore = useCategoryStore();
  const orderStore = useOrderStore();
  const couponStore = useCouponStore();
  const flashSaleStore = useFlashSaleStore();
  const bannerStore = useBannerStore();
  const { admin } = useAdminAuth();

  const [isLoading, setIsLoading] = useState(true);

  const adminName = admin?.name || admin?.firstName || 'Admin';

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          productStore.fetchProducts?.(),
          categoryStore.fetchCategories?.(),
          orderStore.fetchOrders?.(),
          couponStore.fetchCoupons?.(),
          flashSaleStore.fetchFlashSales?.(),
          bannerStore.fetchBanners?.(),
        ].filter(Boolean));
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, []);

  const totalRevenue = orderStore.orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0;
  const pendingOrders = orderStore.orders?.filter(o => o.status === 'pending')?.length || 0;
  const deliveredOrders = orderStore.orders?.filter(o => o.status === 'delivered')?.length || 0;
  const activeCampaigns =
    (couponStore.coupons?.filter(c => c.isActive)?.length || 0) +
    (flashSaleStore.flashSales?.filter(fs => fs.isActive)?.length || 0);

  const heroCards = [
    {
      label: 'Total Revenue',
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      sub: `From ${orderStore.orders?.length || 0} orders`,
      icon: DollarSign,
      gradient: 'from-[#1A3C8A] via-blue-700 to-blue-800',
      glow: 'shadow-blue-500/30',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders,
      sub: 'Need your attention',
      icon: AlertCircle,
      gradient: 'from-amber-500 via-orange-500 to-[#FF6B35]',
      glow: 'shadow-orange-400/30',
    },
    {
      label: 'Active Campaigns',
      value: activeCampaigns,
      sub: 'Coupons + Flash sales',
      icon: Zap,
      gradient: 'from-emerald-500 via-teal-500 to-teal-600',
      glow: 'shadow-emerald-400/30',
    },
    {
      label: 'Delivered Orders',
      value: deliveredOrders,
      sub: 'Successfully completed',
      icon: CheckCircle2,
      gradient: 'from-violet-500 via-purple-600 to-purple-700',
      glow: 'shadow-purple-400/30',
    },
  ];

  const statCards = [
    { label: 'Products', value: productStore.products?.length || 0, icon: Package, bg: 'bg-blue-50', iconColor: 'text-[#1A3C8A]', path: '/admin/productcrud' },
    { label: 'Categories', value: categoryStore.categories?.length || 0, icon: Tag, bg: 'bg-purple-50', iconColor: 'text-purple-600', path: '/admin/categorycrud' },
    { label: 'Total Orders', value: orderStore.orders?.length || 0, icon: ShoppingCart, bg: 'bg-emerald-50', iconColor: 'text-emerald-600', path: '/admin/ordercrud' },
    { label: 'Coupons', value: couponStore.coupons?.filter(c => c.isActive)?.length || 0, icon: TicketPercent, bg: 'bg-pink-50', iconColor: 'text-pink-600', path: '/admin/promocodecrud' },
    { label: 'Flash Sales', value: flashSaleStore.flashSales?.filter(fs => fs.isActive)?.length || 0, icon: Zap, bg: 'bg-amber-50', iconColor: 'text-amber-600', path: '/admin/flashsalecrud' },
    { label: 'Banners', value: bannerStore.banners?.filter(b => b.isActive)?.length || 0, icon: ImageIcon, bg: 'bg-indigo-50', iconColor: 'text-indigo-600', path: '/admin/bannercrud' },
  ];

  const recentOrders = orderStore.orders?.slice(0, 6) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <Loader2 className="w-16 h-16 animate-spin text-[#FF6B35]" />
          </div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1A3C8A] to-[#1e4db7] rounded-2xl p-6 md:p-8 text-white shadow-xl">
        {/* decorative blobs */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-[#FF6B35]/20 blur-2xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Good day 👋</p>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {adminName}!</h1>
            <p className="text-blue-200 mt-1 text-sm">
              Here's what's happening with your store today.
            </p>
          </div>
          <Link
            to="/admin/ordercrud"
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-[#FF6B35] hover:bg-orange-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-orange-500/30"
          >
            <ShoppingCart className="w-4 h-4" />
            View Orders
          </Link>
        </div>
      </div>

      {/* Hero metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {heroCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-xl ${card.glow}`}
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/70 text-sm font-medium">{card.label}</span>
                  <div className="p-2 bg-white/15 rounded-lg">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-bold">{card.value}</p>
                <p className="text-white/60 text-xs mt-1">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Store Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Store Overview</h2>
          <span className="text-xs text-gray-400">Click any card to manage</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {statCards.map((s, i) => {
            const Icon = s.icon;
            return (
              <Link
                key={i}
                to={s.path}
                className="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-[#FF6B35]/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
                <div className="mt-2 flex items-center gap-1 text-xs text-[#FF6B35] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Manage <ArrowUpRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#FF6B35]" />
            Recent Orders
          </h2>
          <Link
            to="/admin/ordercrud"
            className="text-xs font-semibold text-[#1A3C8A] hover:text-[#FF6B35] flex items-center gap-1 transition-colors"
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-semibold">Customer</th>
                  <th className="text-left px-6 py-3 font-semibold hidden md:table-cell">Items</th>
                  <th className="text-left px-6 py-3 font-semibold">Amount</th>
                  <th className="text-left px-6 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order, i) => {
                  const statusColors = {
                    pending: 'bg-amber-100 text-amber-700',
                    confirmed: 'bg-blue-100 text-blue-700',
                    delivered: 'bg-emerald-100 text-emerald-700',
                    cancelled: 'bg-red-100 text-red-700',
                    processing: 'bg-purple-100 text-purple-700',
                  };
                  const color = statusColors[order.status] || 'bg-gray-100 text-gray-600';

                  return (
                    <tr key={order._id || i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div>
                          <p className="font-medium text-gray-800">{order.name || order.first_name || 'Guest'}</p>
                          <p className="text-xs text-gray-400">{order.email || order.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 hidden md:table-cell">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-gray-800">
                        Rs. {(order.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${color}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
