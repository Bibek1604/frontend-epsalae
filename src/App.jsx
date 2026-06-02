import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'
import Home from './components/homepage/home'
import ProductDetail from './components/product-details/ProductDetail'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import TrackOrder from './pages/TrackOrder'
import AdminLogin from './pages/AdminLogin'
import LoginPage from './pages/LoginPage'
import SalePage from './pages/SalePage'
import RegisterPage from './pages/RegisterPage'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import UserProtectedRoute from './components/UserProtectedRoute'
import Navbar from './components/homepage/navbar'
import Footer from './components/homepage/Footer'
import NotFound from './pages/NotFound'
import ProfileSetup from './pages/ProfileSetup'
import AccountDashboard from './pages/AccountDashboard'
//include goto top button

function App() {
  return (
    <>
      {/* Global Toast Notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
          },
        }}
      />
      <Routes>
        {/* Admin routes - no header/footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        } />
        {/* Public routes - with header/footer */}
        <Route path="/*" element={
          <div className="relative flex flex-col min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbff_48%,_#eef3ff_100%)] text-slate-900">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/sale/:slug" element={<SalePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile-setup" element={<UserProtectedRoute><ProfileSetup /></UserProtectedRoute>} />
                <Route path="/account/*" element={<UserProtectedRoute><AccountDashboard /></UserProtectedRoute>} />
                <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                <Route path="/track-order" element={<TrackOrder />} />
                {/* 404 - Catch all unknown routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </>
  );
}

export default App
