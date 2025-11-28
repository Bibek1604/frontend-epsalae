import { useState } from 'react';
import { Search, ShoppingCart, Heart, Menu, X, User, ChevronDown, Package, LogIn, Grid } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '@/store/cartstore';
import { useAuthStore } from '../store/authstore';

export default function Navbar() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isLoggedIn, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Brands', path: '/products' },
    { name: 'New', path: '/products?sort=newest' },
    { name: 'About Us', path: '#' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Main Navbar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">ePasaley</span>
            </Link>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path + link.name}
                  to={link.path}
                  className="text-gray-600 hover:text-teal-600 transition-colors font-medium"
                >
                  {link.name}
                </Link>
              ))}
              <div className="relative">
                <button className="flex items-center gap-1 text-gray-600 hover:text-teal-600 transition-colors font-medium">
                  ENG
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <button className="p-2 text-gray-600 hover:text-teal-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <button className="p-2 text-gray-600 hover:text-teal-600 transition-colors">
                <Heart className="h-5 w-5" />
              </button>

              {/* Cart */}
              <button 
                onClick={() => navigate('/cart')}
                className="relative p-2 text-gray-600 hover:text-teal-600 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* User/Login */}
              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 text-gray-600 hover:text-teal-600 transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </button>
                  
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <Link
                          to="/track-order"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                        >
                          <Package className="h-4 w-4" />
                          Track Order
                        </Link>
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                        >
                          <Grid className="h-4 w-4" />
                          Admin Panel
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        <button
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                            navigate('/');
                          }}
                          className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full"
                        >
                          <LogIn className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link to="/admin/login" className="p-2 text-gray-600 hover:text-teal-600 transition-colors">
                  <User className="h-5 w-5" />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-teal-600 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Top Banner */}
        <div className="bg-teal-700 text-white text-center py-2 text-sm font-medium">
          Top quality items from verified brands
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </form>
              
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path + link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-teal-50 hover:text-teal-600 font-medium transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}