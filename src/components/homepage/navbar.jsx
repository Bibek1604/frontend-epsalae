import { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, Package, LogIn, X, Grid, Home, ChevronDown, User } from 'lucide-react';
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
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: Grid },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Main Navbar */}
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
                <span className="text-white font-black text-lg">E</span>
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Epasaley
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search products, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </form>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium"
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Track Order / Login */}
              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium"
                  >
                    <User className="h-4 w-4" />
                    <span>Account</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                        <Link
                          to="/track-order"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          <Package className="h-4 w-4" />
                          Track Order
                        </Link>
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
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
                <Link 
                  to="/admin/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              )}

              {/* Wishlist */}
              <button className="relative p-2.5 rounded-xl text-gray-600 hover:text-red-500 hover:bg-red-50 transition-all">
                <Heart className="h-5 w-5" />
              </button>

              {/* Cart */}
              <button 
                onClick={() => navigate('/cart')}
                className="relative p-2.5 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                <ShoppingBag className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </form>

              {/* Mobile Nav Links */}
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium"
                  >
                    <link.icon className="h-5 w-5" />
                    {link.name}
                  </Link>
                ))}
                
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/track-order"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium"
                    >
                      <Package className="h-5 w-5" />
                      Track Order
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium"
                    >
                      <Grid className="h-5 w-5" />
                      Admin Panel
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all font-medium"
                  >
                    <LogIn className="h-5 w-5" />
                    Login
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}