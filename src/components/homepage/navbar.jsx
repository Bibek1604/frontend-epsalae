import { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, Package, LogIn, X, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/store/cartstore';
import { useAuthStore } from '../store/authstore';

export default function Navbar() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { isLoggedIn } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="text-3xl font-bold bg-gradient-to-r from-[#2A2F4F] to-[#0078FF] bg-clip-text text-transparent hover:opacity-80 transition"
            >
              Epasaley
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFB200] focus:border-transparent transition-all text-gray-800"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            {/* Products Link */}
            <button 
              onClick={() => navigate('/products')}
              className="hidden md:flex items-center gap-2 hover:text-[#FFB200] transition"
            >
              <Grid className="h-5 w-5" />
              <span className="font-medium">Products</span>
            </button>

            {/* Show Track Order only for logged in users */}
            {isLoggedIn ? (
              <button 
                onClick={() => navigate('/track-order')}
                className="hidden md:flex items-center gap-2 hover:text-[#FFB200] transition"
              >
                <Package className="h-5 w-5" />
                <span className="font-medium">Track Order</span>
              </button>
            ) : (
              <button 
                onClick={() => navigate('/admin/login')}
                className="hidden md:flex items-center gap-2 hover:text-[#FFB200] transition"
              >
                <LogIn className="h-5 w-5" />
                <span className="font-medium">Login</span>
              </button>
            )}
            <button className="relative hover:text-[#FFB200] transition">
              <Heart className="h-5 w-5" />
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="relative hover:text-[#FFB200] transition"
            >
              <ShoppingBag className="h-7 w-7" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FFB200] text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="md:hidden">
              <Menu className="h-7 w-7" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}