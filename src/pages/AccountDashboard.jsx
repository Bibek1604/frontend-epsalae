import { Link, Routes, Route } from 'react-router-dom'
import ProfileSetup from './ProfileSetup'
import OrdersPage from './AccountOrders'
import AddressesPage from './AccountAddresses'
import WishlistPage from './AccountWishlist'
import SecurityPage from './AccountSecurity'
import OrderInvoice from './OrderInvoice'
import { User, ShoppingBag, MapPin, Heart, ShieldCheck, LogOut } from 'lucide-react'
import { useUserAuth } from '@/components/store/authstore'

function Sidebar(){
  const { logoutUser } = useUserAuth()
  const logout = logoutUser
  return (
    <aside className="rounded-[2rem] bg-white p-4 shadow-[0_18px_70px_-50px_rgba(15,23,42,0.55)] lg:sticky lg:top-8">
      <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,_rgba(26,60,138,0.08),_rgba(255,107,53,0.08))] p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Account</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Dashboard</h2>
      </div>
      <nav className="mt-4 space-y-2">
        <Link to="." className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50"><User className="h-4 w-4 text-slate-500" /> My Profile</Link>
        <Link to="orders" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50"><ShoppingBag className="h-4 w-4 text-slate-500" /> My Orders</Link>
        <Link to="addresses" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50"><MapPin className="h-4 w-4 text-slate-500" /> Saved Addresses</Link>
        <Link to="wishlist" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50"><Heart className="h-4 w-4 text-slate-500" /> Wishlist</Link>
        <Link to="security" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 transition hover:bg-slate-50"><ShieldCheck className="h-4 w-4 text-slate-500" /> Security Settings</Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-red-600 transition hover:bg-red-50"><LogOut className="h-4 w-4" /> Logout</button>
      </nav>
    </aside>
  )
}

export default function AccountDashboard(){
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbff_52%,_#eef3ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <Sidebar />
          <main className="lg:col-span-3">
            <Routes>
              <Route index element={<ProfileSetup/>} />
              <Route path="orders" element={<OrdersPage/>} />
              <Route path="orders/:orderId" element={<OrderInvoice/>} />
              <Route path="addresses" element={<AddressesPage/>} />
              <Route path="wishlist" element={<WishlistPage/>} />
              <Route path="security" element={<SecurityPage/>} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  )
}
