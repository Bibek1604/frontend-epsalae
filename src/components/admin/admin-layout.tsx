// src/layouts/AdminLayout.tsx
// Admin panel layout with navigation and main content area

import React, { useState } from 'react';
import { Menu, X, LogOut, Settings, Home } from 'lucide-react';
import './admin-layout.css';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home size={20} />,
      path: '/admin',
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <span className="nav-icon">📁</span>,
      path: '/admin/categories',
    },
    {
      id: 'products',
      label: 'Products',
      icon: <span className="nav-icon">📦</span>,
      path: '/admin/products',
    },
    {
      id: 'coupons',
      label: 'Coupons',
      icon: <span className="nav-icon">🎟️</span>,
      path: '/admin/coupons',
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: <span className="nav-icon">📋</span>,
      path: '/admin/orders',
    },
    {
      id: 'users',
      label: 'Users',
      icon: <span className="nav-icon">👥</span>,
      path: '/admin/users',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <span className="nav-icon">📊</span>,
      path: '/admin/analytics',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      path: '/admin/settings',
    },
  ];

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">🛍️</div>
          {sidebarOpen && <h1>Store Admin</h1>}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => navigateTo(item.path)}
              title={item.label}
            >
              <span className="nav-icon-wrapper">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="sidebar-footer">
            <p className="version">v1.0.0</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Top Bar */}
        <header className="admin-header">
          <div className="header-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="page-title">
              {navItems.find((item) => item.id === currentPage)?.label || 'Admin Panel'}
            </h2>
          </div>

          <div className="header-right">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search..."
              className="header-search"
              disabled
            />

            {/* Notifications (placeholder) */}
            <button className="header-icon" title="Notifications">
              <span className="icon-badge">🔔</span>
            </button>

            {/* User Menu */}
            <div className="user-menu">
              <button
                className="user-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                title="User menu"
              >
                <span className="user-avatar">👤</span>
                {sidebarOpen && <span className="user-name">Admin</span>}
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <a href="#profile" className="dropdown-item">
                    Profile
                  </a>
                  <a href="#settings" className="dropdown-item">
                    Settings
                  </a>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item logout"
                    onClick={() => {
                      localStorage.removeItem('authToken');
                      window.location.href = '/login';
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="admin-content">{children}</main>

        {/* Footer */}
        <footer className="admin-footer">
          <p>&copy; 2026 Store Admin Panel. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
