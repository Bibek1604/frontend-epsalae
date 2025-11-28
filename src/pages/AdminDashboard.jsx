import { useState, useEffect } from 'react';
import { useProductStore } from '../components/store/productstore';
import { useCategoryStore } from '../components/store/categorystore';
import { useOrderStore } from '../components/store/orderstore';
import { useCouponStore } from '../components/store/promocodestore';
import { useFlashSaleStore } from '../components/store/flashsalestore';
import { useBannerStore } from '../components/store/bannerstore';
import { Package, Tag, ShoppingCart, Ticket, Zap, Image, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = [
    {
      label: 'Total Products',
      value: productStore.products?.length || 0,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-300',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
    },
    {
      label: 'Total Categories',
      value: categoryStore.categories?.length || 0,
      icon: Tag,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-300',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
    },
    {
      label: 'Total Orders',
      value: orderStore.orders?.length || 0,
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-300',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
    },
    {
      label: 'Active Coupons',
      value: couponStore.coupons?.filter(c => c.isActive)?.length || 0,
      icon: Ticket,
      color: 'from-pink-500 to-pink-600',
      textColor: 'text-pink-300',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30',
    },
    {
      label: 'Active Flash Sales',
      value: flashSaleStore.flashSales?.filter(fs => fs.isActive)?.length || 0,
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600',
      textColor: 'text-yellow-300',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
    },
    {
      label: 'Active Banners',
      value: bannerStore.banners?.filter(b => b.isActive)?.length || 0,
      icon: Image,
      color: 'from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-300',
      bgColor: 'bg-indigo-500/20',
      borderColor: 'border-indigo-500/30',
    },
  ];

  const modules = [
    {
      title: 'Products',
      description: 'Manage all products in your store',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      path: '/admin/productcrud',
      count: productStore.products?.length || 0,
    },
    {
      title: 'Categories',
      description: 'Manage product categories',
      icon: Tag,
      color: 'from-purple-500 to-purple-600',
      path: '/admin/categorycrud',
      count: categoryStore.categories?.length || 0,
    },
    {
      title: 'Orders',
      description: 'Manage customer orders',
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      path: '/admin/ordercrud',
      count: orderStore.orders?.length || 0,
    },
    {
      title: 'Coupons',
      description: 'Manage promotion codes',
      icon: Ticket,
      color: 'from-pink-500 to-pink-600',
      path: '/admin/promocodecrud',
      count: couponStore.coupons?.length || 0,
    },
    {
      title: 'Flash Sales',
      description: 'Manage flash sales',
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600',
      path: '/admin/flashsalecrud',
      count: flashSaleStore.flashSales?.length || 0,
    },
    {
      title: 'Banners',
      description: 'Manage promotional banners',
      icon: Image,
      color: 'from-indigo-500 to-indigo-600',
      path: '/admin/bannercrud',
      count: bannerStore.banners?.length || 0,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with your store.</p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                <p className="text-indigo-100 text-sm font-medium mb-2">Total Revenue</p>
                <p className="text-3xl font-bold mb-1">
                  Rs. {orderStore.orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString() || 0}
                </p>
                <p className="text-indigo-200 text-sm">From {orderStore.orders?.length || 0} orders</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
                <p className="text-emerald-100 text-sm font-medium mb-2">Pending Orders</p>
                <p className="text-3xl font-bold mb-1">
                  {orderStore.orders?.filter(o => o.status === 'pending')?.length || 0}
                </p>
                <p className="text-emerald-200 text-sm">Awaiting processing</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
                <p className="text-amber-100 text-sm font-medium mb-2">Active Campaigns</p>
                <p className="text-3xl font-bold mb-1">
                  {(couponStore.coupons?.filter(c => c.isActive)?.length || 0) + 
                   (flashSaleStore.flashSales?.filter(fs => fs.isActive)?.length || 0)}
                </p>
                <p className="text-amber-200 text-sm">Running promotions</p>
              </div>
            </div>

            {/* CRUD Modules */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Access</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {modules.map((module, idx) => {
                  const Icon = module.icon;
                  return (
                    <Link
                      key={idx}
                      to={module.path}
                      className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-100 transition-all"
                    >
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${module.color} mb-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">{module.title}</h3>
                      <p className="text-2xl font-bold text-gray-900">{module.count}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
