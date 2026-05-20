import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, Eye, Package, CalendarDays } from 'lucide-react'
import toast from 'react-hot-toast'
import { profileEndpoints } from '@/components/api/userapi'
import { useCart } from '@/store/cartstore'

export default function OrdersPage() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await profileEndpoints.orders({ page: 1, limit: 100 })
        const data = res.data?.data || res.data || {}
        const list = Array.isArray(data.orders) ? data.orders : Array.isArray(data) ? data : []
        setOrders(list)
      } catch (e) {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const reorder = (order) => {
    (order.items || []).forEach((item) => {
      addToCart({
        id: item.productId || item.id,
        _id: item.productId || item.id,
        name: item.name,
        price: Number(item.price || 0),
        image: item.imageUrl,
        quantity: Number(item.quantity || 1),
      })
    })
    toast.success('Items added back to cart')
  }

  if (loading) {
    return (
      <div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_70px_-50px_rgba(15,23,42,0.55)] sm:p-8">
        <div className="h-8 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-[1.75rem] bg-slate-100" />
          ))}
        </div>
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_70px_-50px_rgba(15,23,42,0.55)] sm:p-8">
        <h3 className="text-2xl font-semibold text-slate-900">My Orders</h3>
        <p className="mt-1 text-sm text-slate-500">View invoices, reorder past purchases, and track delivery status.</p>
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">No orders yet.</div>
      </div>
    )
  }

  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-[0_18px_70px_-50px_rgba(15,23,42,0.55)] sm:p-8">
      <div className="mb-5">
        <h3 className="text-2xl font-semibold text-slate-900">My Orders</h3>
        <p className="mt-1 text-sm text-slate-500">View invoices, reorder past purchases, and track delivery status.</p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => {
          const orderId = o.id || o._id
          return (
            <div key={orderId} className="rounded-[1.75rem] border border-slate-100 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbff_100%)] p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-40px_rgba(15,23,42,0.5)] sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Order</p>
                    <h4 className="mt-1 text-lg font-semibold text-slate-900">#{orderId}</h4>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'}</span>
                      <span>•</span>
                      <span>{o.items?.length || 0} items</span>
                      <span>•</span>
                      <span className="capitalize">{o.status || 'pending'}</span>
                      <span>•</span>
                      <span>Rs. {Number(o.totalAmount || 0).toLocaleString()}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => navigate(`/account/orders/${orderId}`)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <Eye className="h-4 w-4" /> View invoice
                  </button>
                  <button onClick={() => reorder(o)} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
                    <RotateCcw className="h-4 w-4" /> Reorder
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
