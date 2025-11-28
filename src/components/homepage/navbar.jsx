import { Search, ShoppingBag, Heart, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/store/cartstore';

export default function Navbar() {
  const navigate = useNavigate();
  const { cart } = useCart();

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
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FFB200] focus:border-transparent transition-all text-gray-800"
              />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate('/orders')}
              className="hidden md:flex items-center gap-2 hover:text-[#FFB200] transition"
            >
              <User className="h-6 w-6" />
              <span className="font-medium">Orders</span>
            </button>
            <button className="relative hover:text-[#FFB200] transition">
              <Heart className="h-6 w-6" />
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