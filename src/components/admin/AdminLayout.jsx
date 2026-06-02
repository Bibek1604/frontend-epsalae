import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import AdminDashboard from '../../pages/AdminDashboard';
import ProductCrud from './productcrud';
import CategoryCrud from './categorycrud';
import OrderCrud from './ordercrud';
import PromoCodCrud from './promocodecrud';
import FlashSaleCrud from './flashsale';
import BannerCrud from './bannercrud';
import BrandCrud from './brandcrud';
import SaleCrud from './salecrud';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4F6FA] font-sans">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main column: header + content + footer */}
      <div className="flex flex-col flex-1 min-h-screen lg:ml-64">
        {/* Top Header */}
        <AdminHeader
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 mt-16 p-5 md:p-7 overflow-auto">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/categorycrud" element={<CategoryCrud />} />
            <Route path="/productcrud" element={<ProductCrud />} />
            <Route path="/ordercrud" element={<OrderCrud />} />
            <Route path="/promocodecrud" element={<PromoCodCrud />} />
            <Route path="/flashsalecrud" element={<FlashSaleCrud />} />
            <Route path="/bannercrud" element={<BannerCrud />} />
            <Route path="/brandcrud" element={<BrandCrud />} />
            <Route path="/salecrud" element={<SaleCrud />} />
          </Routes>
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}
