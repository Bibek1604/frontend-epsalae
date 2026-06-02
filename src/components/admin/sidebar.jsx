import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../store/authstore';
import api from '../api/base';
import {
  LayoutDashboard, Package, ShoppingCart, Tag,
  Percent, Zap, Image, LogOut, ExternalLink, Award, X, BadgePercent
} from 'lucide-react';

const menuItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/categorycrud', label: 'Categories', icon: Tag },
  { path: '/admin/productcrud', label: 'Products', icon: Package },
  { path: '/admin/ordercrud', label: 'Orders', icon: ShoppingCart },
  { path: '/admin/promocodecrud', label: 'Promo Codes', icon: Percent },
  { path: '/admin/flashsalecrud', label: 'Flash Sales', icon: Zap },
  { path: '/admin/bannercrud', label: 'Banners', icon: Image },
  { path: '/admin/brandcrud', label: 'Brands', icon: Award },
  { path: '/admin/salecrud', label: 'Sale Categories', icon: BadgePercent },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAdminAuth();
  const adminName = admin?.name || admin?.firstName || 'Admin';
  const adminInitial = adminName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); } catch (e) {}
    logoutAdmin();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-[#0F172A] flex flex-col z-30
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1A3C8A] to-[#FF6B35] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">E</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              ePasaley <span className="text-[#FF6B35]">Admin</span>
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin profile chip */}
        <div className="mx-4 mt-5 mb-3 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-amber-400 flex items-center justify-center text-white font-bold text-base shrink-0">
            {adminInitial}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm truncate">{adminName}</p>
            <p className="text-white/40 text-xs">Administrator</p>
          </div>
        </div>

        {/* Nav label */}
        <p className="px-6 text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">Main Menu</p>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto space-y-0.5">
          {menuItems.map(({ path, label, icon: Icon, exact }) => (
            <NavLink
              key={path}
              to={path}
              end={exact}
              onClick={() => window.innerWidth < 1024 && onClose?.()}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-[#FF6B35] text-white shadow-lg shadow-orange-500/25'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
                }
              `}
            >
              <Icon className="w-4.5 h-4.5 shrink-0" size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 pb-4 pt-3 border-t border-white/10 space-y-0.5 mt-2">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all"
          >
            <ExternalLink size={18} />
            View Store
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
