import { Routes, Route } from 'react-router-dom'
import Sidebar from './sidebar'
import AdminDashboard from '../../pages/AdminDashboard'
import ProductCrud from './productcrud'
import CategoryCrud from './categorycrud'
import OrderCrud from './ordercrud'
import PromoCodCrud from './promocodecrud'
import FlashSaleCrud from './flashsale'
import BannerCrud from './bannercrud'
import BrandCrud from './brandcrud'

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - stays consistent */}
      <Sidebar />
      {/* Main Content - changes based on route */}
      <div className="flex-1 p-6 ml-64 overflow-auto">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/categorycrud" element={<CategoryCrud />} />
          <Route path="/productcrud" element={<ProductCrud />} />
          <Route path="/ordercrud" element={<OrderCrud />} />
          <Route path="/promocodecrud" element={<PromoCodCrud />} />
          <Route path="/flashsalecrud" element={<FlashSaleCrud />} />
          <Route path="/bannercrud" element={<BannerCrud />} />
          <Route path="/brandcrud" element={<BrandCrud />} />
        </Routes>
      </div>
    </div>
  )
}
