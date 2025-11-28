// src/components/Sidebar.jsx
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
  Menu,
  X,
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
    <>
      {/* Sidebar */}
      <aside
        className={`w-80 min-h-full bg-white border-r border-gray-200/50 shadow-lg flex flex-col transition-all duration-500 ease-out`}
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-300 rounded-2xl shadow-lg">
                <LayoutDashboard className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Epasaley
                </h1>
                <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
              </div>
            </div>
            <button
              className="p-2 hover:bg-gray-100 rounded-xl transition hidden"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  active
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl shadow-violet-500/30'
                    : 'hover:bg-gray-50 text-gray-700 hover:shadow-md'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all ${active ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <span className={`font-medium text-lg ${active ? 'text-white' : 'text-gray-800'}`}>
                  {item.label}
                </span>
                {active && (
                  <div className="ml-auto w-2 h-10 bg-white/30 rounded-l-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-6 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-50 text-red-600 transition-all group">
            <div className="p-2 bg-red-100 rounded-xl group-hover:bg-red-200">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium text-lg">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}