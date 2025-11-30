import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/homepage/home'
import ProductDetail from './components/product-details/ProductDetail'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import TrackOrder from './pages/TrackOrder'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/homepage/navbar'
import Footer from './components/homepage/Footer'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
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
          <div className="flex flex-col min-h-screen bg-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
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
    </BrowserRouter>
  )
}

export default App
