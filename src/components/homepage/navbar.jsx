// src/components/Navbar.jsx
import { useState } from 'react'
import { Search, ShoppingBag, Heart, Menu, Package, LogIn, X, Grid, Home, ChevronDown, User, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/store/cartstore'
import { useAuthStore } from '../store/authstore'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../../assets/logo1080.png'

export default function Navbar() {
  const navigate = useNavigate()
  const { cart } = useCart()
  const { isLoggedIn, logout } = useAuthStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMobileMenuOpen(false)
    }
  }

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'All Products', path: '/products', icon: Grid },
  ]

  return (
    <>
      {/* Ultra-Premium Sticky Navbar */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="px-6 mx-auto max-w-7xl">

          <div className="flex items-center justify-between h-20">

            {/* Logo - Premium Gradient */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Epasaley Logo" 
                  className="object-contain w-16 h-16"
                />
              </div>
              <span className="text-2xl font-light tracking-tight text-gray-900">
                Epasaley
              </span>
            </Link>

            {/* Desktop Search - Clean & Elegant */}
            <form onSubmit={handleSearch} className="flex-1 hidden max-w-2xl mx-12 lg:flex">
              <div className="relative w-full group">
                <Search className="absolute w-5 h-5 text-gray-400 transition-colors -translate-y-1/2 left-5 top-1/2 group-focus-within:text-gray-900" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-4 pl-12 pr-10 text-lg text-gray-900 transition-all duration-300 border border-transparent bg-gray-50/70 backdrop-blur rounded-2xl focus:outline-none focus:bg-white focus:border-gray-300 focus:shadow-lg placeholder:text-gray-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute text-gray-400 -translate-y-1/2 right-4 top-1/2 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>

            {/* Desktop Navigation & Actions */}
            <div className="flex items-center gap-1">

              {/* Nav Links */}
              <nav className="items-center hidden gap-1 lg:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-2 px-6 py-3 font-medium text-gray-700 transition-all rounded-2xl hover:text-gray-900 hover:bg-gray-100"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                ))}
              </nav>

              {/* Right Icons */}
              <div className="flex items-center gap-3 ml-6">

                {/* Track Order - Always Visible */}
                <Link
                  to="/track-order"
                  className="items-center hidden gap-2 px-5 py-3 font-medium text-white transition-all shadow-lg lg:flex rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:shadow-xl hover:shadow-emerald-500/30"
                >
                  <Package className="w-5 h-5" />
                  Track Order
                </Link>

                {/* Wishlist */}
                <button className="p-3 text-gray-600 transition-all rounded-2xl hover:text-red-600 hover:bg-red-50">
                  <Heart className="w-6 h-6" />
                </button>

                {/* Cart with Badge */}
                <button
                  onClick={() => navigate('/cart')}
                  className="relative p-3 text-gray-600 transition-all rounded-2xl hover:text-gray-900 hover:bg-gray-100 group"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {cart.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute flex items-center justify-center w-6 h-6 text-xs font-bold text-white rounded-full shadow-lg -top-1 -right-1 bg-gradient-to-r from-gray-900 to-gray-700"
                    >
                      {cart.length}
                    </motion.span>
                  )}
                </button>

                {/* User Menu */}
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 px-5 py-3 font-medium transition-all bg-gray-100 rounded-2xl hover:bg-gray-200"
                    >
                      <User className="w-5 h-5" />
                      <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setUserMenuOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 z-50 w-56 mt-3 overflow-hidden bg-white border border-gray-100 shadow-2xl rounded-3xl"
                          >
                            <Link
                              to="/profile"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-6 py-4 transition hover:bg-gray-50"
                            >
                              <User className="w-5 h-5 text-gray-600" />
                              <span className="font-medium">My Profile</span>
                            </Link>
                            <Link
                              to="/orders"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-6 py-4 transition hover:bg-gray-50"
                            >
                              <Package className="w-5 h-5 text-gray-600" />
                              <span className="font-medium">My Orders</span>
                            </Link>
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-6 py-4 transition hover:bg-gray-50"
                            >
                              <Grid className="w-5 h-5 text-gray-600" />
                              <span className="font-medium">Admin Panel</span>
                            </Link>
                            <hr className="border-gray-100" />
                            <button
                              onClick={() => {
                                logout()
                                setUserMenuOpen(false)
                                navigate('/')
                              }}
                              className="flex items-center w-full gap-3 px-6 py-4 font-medium text-red-600 transition hover:bg-red-50"
                            >
                              <LogIn className="w-5 h-5" />
                              Logout
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                ) : null}

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-3 transition lg:hidden rounded-2xl hover:bg-gray-100"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Full Luxury Experience */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border-t border-gray-100 lg:hidden"
            >
              <div className="px-6 py-8 space-y-6">

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute w-6 h-6 text-gray-400 -translate-y-1/2 left-5 top-1/2" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-5 pr-12 text-lg pl-14 bg-gray-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-200"
                  />
                </form>

                {/* Mobile Links */}
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 px-6 py-4 text-lg font-medium transition rounded-2xl hover:bg-gray-100"
                    >
                      <link.icon className="w-6 h-6 text-gray-600" />
                      {link.name}
                    </Link>
                  ))}

                  <Link
                    to="/track-order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 font-semibold text-white shadow-lg rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700"
                  >
                    <Package className="w-6 h-6" />
                    Track Your Order
                  </Link>

                  {isLoggedIn && (
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="flex items-center w-full gap-4 px-6 py-4 font-medium text-red-600 transition rounded-2xl bg-red-50 hover:bg-red-100"
                    >
                      <LogIn className="w-6 h-6" />
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}