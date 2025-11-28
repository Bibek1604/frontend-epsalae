import { Routes, Route } from 'react-router-dom'
import Sidebar from './sidebar'
import AdminDashboard from '../../pages/AdminDashboard'
import ProductCrud from './productcrud'
import CategoryCrud from './categorycrud'
import OrderCrud from './ordercrud'
import PromoCodCrud from './promocodecrud'
import FlashSaleCrud from './flashsale'
import BannerCrud from './bannercrud'

export default function AdminLayout() {
  return (
    <div className="flex w-full gap-4 bg-gray-100">
      {/* Sidebar - stays consistent */}
      <Sidebar />

      {/* Main Content - changes based on route */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/productcrud" element={<ProductCrud />} />
          <Route path="/categorycrud" element={<CategoryCrud />} />
          <Route path="/ordercrud" element={<OrderCrud />} />
          <Route path="/promocodecrud" element={<PromoCodCrud />} />
          <Route path="/flashsalecrud" element={<FlashSaleCrud />} />
          <Route path="/bannercrud" element={<BannerCrud />} />
        </Routes>
      </div>
    </div>
  )
}
