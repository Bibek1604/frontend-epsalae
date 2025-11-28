import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/homepage/home'
import ProductDetail from './components/product-details/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import OrderHistory from './pages/OrderHistory'
import OrderDetail from './pages/OrderDetail'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/homepage/navbar'
import Footer from './components/homepage/Footer'

function App() {
  return (
    <BrowserRouter>
      <div className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
