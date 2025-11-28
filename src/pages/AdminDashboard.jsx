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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 bg-clip-text text-transparent mb-2">Dashboard</h1>
          <p className="text-gray-400 text-lg">Welcome to your admin dashboard</p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`${stat.bgColor} border ${stat.borderColor} rounded-2xl p-8 backdrop-blur-sm hover:scale-105 transition-transform`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-300 font-semibold text-sm">{stat.label}</h3>
                      <div className={`p-3 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
                        <Icon className={`w-6 h-6 ${stat.textColor}`} />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <p className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</p>
                      <p className="text-gray-500 text-sm">total</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CRUD Modules */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-8">Management Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module, idx) => {
                  const Icon = module.icon;
                  return (
                    <Link
                      key={idx}
                      to={module.path}
                      className="group relative overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 hover:border-cyan-500 transition-all"
                    >
                      {/* Gradient background on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${module.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                      <div className="relative p-8">
                        {/* Icon and Title */}
                        <div className={`inline-flex p-4 rounded-lg bg-gradient-to-r ${module.color} mb-4`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition">{module.title}</h3>
                        <p className="text-gray-400 text-sm mb-6">{module.description}</p>

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                          <div>
                            <p className="text-3xl font-bold text-cyan-300">{module.count}</p>
                            <p className="text-gray-500 text-xs mt-1">items</p>
                          </div>
                          <div className="text-gray-600 group-hover:text-cyan-400 transition">
                            <TrendingUp className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats Summary */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-gray-400 text-sm mb-2">Total Items</p>
                  <p className="text-4xl font-bold text-cyan-300">
                    {(productStore.products?.length || 0) + 
                     (categoryStore.categories?.length || 0) + 
                     (couponStore.coupons?.length || 0) + 
                     (flashSaleStore.flashSales?.length || 0) + 
                     (bannerStore.banners?.length || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Active Campaigns</p>
                  <p className="text-4xl font-bold text-yellow-300">
                    {(couponStore.coupons?.filter(c => c.isActive)?.length || 0) + 
                     (flashSaleStore.flashSales?.filter(fs => fs.isActive)?.length || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-2">Pending Orders</p>
                  <p className="text-4xl font-bold text-green-300">
                    {orderStore.orders?.filter(o => o.status === 'pending')?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
