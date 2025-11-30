// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useProductStore } from '../components/store/productstore';
import { useCategoryStore } from '../components/store/categorystore';
import { useOrderStore } from '../components/store/orderstore';
import { useCouponStore } from '../components/store/promocodestore';
import { useFlashSaleStore } from '../components/store/flashsalestore';
import { useBannerStore } from '../components/store/bannerstore';
import { 
  Package, Tag, ShoppingCart, TicketPercent, Zap, ImageIcon, 
  TrendingUp, AlertCircle, Loader2, ArrowUpRight, Store 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const productStore = useProductStore();
  const categoryStore = useCategoryStore();
  const orderStore = useOrderStore();
  const couponStore = useCouponStore();
  const flashSaleStore = useFlashSaleStore();
  const bannerStore = useBannerStore();

  const [isLoading, setIsLoading] = useState(true);

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
  const activeCampaigns = 
    (couponStore.coupons?.filter(c => c.isActive)?.length || 0) +
    (flashSaleStore.flashSales?.filter(fs => fs.isActive)?.length || 0);

  const stats = [
    { label: 'Total Products', value: productStore.products?.length || 0, icon: Package, color: 'from-[#1A3C8A] to-blue-700' },
    { label: 'Categories', value: categoryStore.categories?.length || 0, icon: Tag, color: 'from-purple-500 to-purple-700' },
    { label: 'Total Orders', value: orderStore.orders?.length || 0, icon: ShoppingCart, color: 'from-emerald-500 to-emerald-700' },
    { label: 'Active Coupons', value: couponStore.coupons?.filter(c => c.isActive)?.length || 0, icon: TicketPercent, color: 'from-pink-500 to-pink-700' },
    { label: 'Flash Sales', value: flashSaleStore.flashSales?.filter(fs => fs.isActive)?.length || 0, icon: Zap, color: 'from-amber-500 to-orange-600' },
    { label: 'Active Banners', value: bannerStore.banners?.filter(b => b.isActive)?.length || 0, icon: ImageIcon, color: 'from-indigo-500 to-indigo-700' },
  ];

  const quickLinks = [
    { title: 'Products', icon: Package, count: productStore.products?.length || 0, path: '/admin/productcrud', gradient: 'from-[#1A3C8A] to-blue-600' },
    { title: 'Categories', icon: Tag, count: categoryStore.categories?.length || 0, path: '/admin/categorycrud', gradient: 'from-purple-500 to-purple-700' },
    { title: 'Orders', icon: ShoppingCart, count: orderStore.orders?.length || 0, path: '/admin/ordercrud', gradient: 'from-emerald-500 to-teal-600' },
    { title: 'Promo Codes', icon: TicketPercent, count: couponStore.coupons?.length || 0, path: '/admin/promocodecrud', gradient: 'from-pink-500 to-rose-600' },
    { title: 'Flash Sales', icon: Zap, count: flashSaleStore.flashSales?.length || 0, path: '/admin/flashsalecrud', gradient: 'from-amber-500 to-[#FF6B35]' },
    { title: 'Banners', icon: ImageIcon, count: bannerStore.banners?.length || 0, path: '/admin/bannercrud', gradient: 'from-indigo-500 to-indigo-700' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#FF6B35] mx-auto mb-4" />
          <p className="text-[#2E2E2E] font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#1A3C8A] mb-2">Welcome back, Navin!</h1>
        <p className="text-[#7A7A7A]">Here's what's happening with your store today</p>
      </div>

      {/* Hero Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Revenue Card */}
        <div className="bg-gradient-to-br from-[#1A3C8A] to-blue-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 -mt-16 -mr-16 bg-white rounded-full opacity-10"></div>
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-lg text-blue-100">Total Revenue</p>
              <p className="text-4xl font-bold">Rs. {totalRevenue.toLocaleString()}</p>
              <p className="mt-2 text-sm text-blue-200">From {orderStore.orders?.length || 0} orders</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-gradient-to-br from-amber-500 to-[#FF6B35] rounded-3xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-lg text-amber-100">Pending Orders</p>
              <p className="text-4xl font-bold">{pendingOrders}</p>
              <p className="mt-2 text-sm text-amber-200">Need attention</p>
            </div>
            <AlertCircle className="w-12 h-12 text-amber-200" />
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="p-8 text-white shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-2 text-lg text-emerald-100">Active Campaigns</p>
              <p className="text-4xl font-bold">{activeCampaigns}</p>
              <p className="mt-2 text-sm text-emerald-200">Running promotions</p>
            </div>
            <Zap className="w-12 h-12 text-emerald-200" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-2xl font-bold text-[#2E2E2E] mb-6">Store Overview</h2>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group bg-white rounded-2xl p-6 shadow-md border border-[#EFEFEF] hover:shadow-xl hover:border-[#FF6B35]/30 transition-all duration-300"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 shadow-lg`}>
                  <Icon className="text-white w-7 h-7" />
                </div>
                <p className="text-3xl font-bold text-[#2E2E2E]">{stat.value}</p>
                <p className="text-sm text-[#7A7A7A] mt-1 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
}