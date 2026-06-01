import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, ChevronDown, ExternalLink, LogOut, User, Settings, Menu, X } from 'lucide-react';
import { useAdminAuth } from '../store/authstore';
import api from '../api/base';

const routeTitles = {
  '/admin': 'Dashboard',
  '/admin/categorycrud': 'Categories',
  '/admin/productcrud': 'Products',
  '/admin/ordercrud': 'Orders',
  '/admin/promocodecrud': 'Promo Codes',
  '/admin/flashsalecrud': 'Flash Sales',
  '/admin/bannercrud': 'Banners',
  '/admin/brandcrud': 'Brands',
};

export default function AdminHeader({ onToggleSidebar, sidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAdminAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pageTitle = routeTitles[location.pathname] || 'Admin';
  const adminName = admin?.name || admin?.firstName || 'Admin';
  const adminInitial = adminName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (e) {}
    logoutAdmin();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-20 h-16 bg-white border-b border-gray-100 shadow-sm flex items-center px-4 gap-4">
      {/* Sidebar Toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#1A3C8A] transition-colors lg:hidden"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Logo (visible on mobile when sidebar closed) */}
      <Link to="/admin" className="flex items-center gap-1 lg:hidden">
        <span className="text-xl font-bold text-[#1A3C8A]">ePasaley</span>
        <span className="text-xl font-bold text-[#FF6B35]">.</span>
      </Link>

      {/* Page Title */}
      <div className="hidden lg:flex flex-col">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Admin Panel</span>
        <span className="text-lg font-bold text-[#1A3C8A] leading-tight">{pageTitle}</span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-auto lg:mx-0 lg:ml-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products, orders..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]/20 focus:border-[#1A3C8A] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* View Store */}
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-[#1A3C8A] hover:bg-blue-50 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          <span>View Store</span>
        </Link>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#1A3C8A] transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B35] rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200 mx-1" />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(v => !v)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#1A3C8A] to-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              {adminInitial}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{adminName}</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 mb-1">
                <p className="font-semibold text-gray-800 text-sm">{adminName}</p>
                <p className="text-xs text-gray-400">{admin?.email || 'admin@epasaley.com'}</p>
              </div>
              <Link
                to="/"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1A3C8A] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Store
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
