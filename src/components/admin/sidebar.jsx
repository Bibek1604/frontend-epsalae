// src/components/Sidebar.jsx - Modern Admin Sidebar
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';
import toast from 'react-hot-toast';
import {
  LayoutDashboard,
  Package,
  Tag,
  Zap,
  Image,
  ShoppingCart,
  PercentCircle,
  LogOut,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { label: 'Products', icon: Package, path: '/admin/productcrud' },
    { label: 'Categories', icon: Tag, path: '/admin/categorycrud' },
    { label: 'Flash Sales', icon: Zap, path: '/admin/flashsalecrud' },
    { label: 'Banners', icon: Image, path: '/admin/bannercrud' },
    { label: 'Orders', icon: ShoppingCart, path: '/admin/ordercrud' },
    { label: 'Promo Codes', icon: PercentCircle, path: '/admin/promocodecrud' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <aside className="w-72 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/30">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ePasaley</h1>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  active 
                    ? 'bg-white/20' 
                    : 'bg-gray-800 group-hover:bg-gray-700'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium flex-1 text-left">{item.label}</span>
                {active && (
                  <ChevronRight className="w-4 h-4 opacity-60" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all group"
        >
          <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-red-500/20 transition-colors">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}