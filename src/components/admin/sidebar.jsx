// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authstore';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Tag,
  Users,
  Percent,
  Zap,
  Image,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: Home },
    { path: '/admin/categorycrud', label: 'Categories', icon: Tag },
    { path: '/admin/productcrud', label: 'Products', icon: Package },
    { path: '/admin/ordercrud', label: 'Orders', icon: ShoppingCart },
    { path: '/admin/promocodecrud', label: 'Promo Codes', icon: Percent },
    { path: '/admin/flashsalecrud', label: 'Flash Sales', icon: Zap },
    { path: '/admin/bannercrud', label: 'Banners', icon: Image },
  ];

  const bottomItems = [

  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-[#EFEFEF] shadow-sm flex flex-col z-10">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-[#EFEFEF]">
        <h1 className="text-2xl font-bold text-[#1A3C8A]">ePasaley</h1>
        <ChevronRight className="ml-1 w-7 h-7 text-[#FF6B35]" />
      </div>

      {/* User Profile */}
      <div className="px-6 py-5 border-b border-[#EFEFEF]">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#FF6B35] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
            A
          </div>
          <div>
            <p className="font-semibold text-[#2E2E2E]">Hello Navin</p>
            <p className="text-sm text-[#7A7A7A]">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                    ${active
                      ? 'bg-orange-50 text-[#FF6B35] font-semibold border-r-4 border-[#FF6B35] shadow-sm'
                      : 'text-[#2E2E2E] hover:bg-orange-50 hover:text-[#FF6B35] hover:border-r-4 hover:border-[#FF6B35]'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="border-t border-[#EFEFEF] px-4 py-4">
        <ul className="space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all
                    ${active
                      ? 'bg-orange-50 text-[#FF6B35] font-semibold border-r-4 border-[#FF6B35]'
                      : 'text-[#2E2E2E] hover:bg-orange-50 hover:text-[#FF6B35]'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#E63946] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}

          <li>
            <NavLink
              to="/"
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#2E2E2E] hover:bg-blue-50 hover:text-[#1A3C8A] transition-all"
            >
              <ExternalLink className="w-5 h-5" />
              <span>Go to Home</span>
            </NavLink>
          </li>

          <li>
            <button 
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-[#2E2E2E] hover:bg-red-50 hover:text-[#E63946] transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;