// src/components/admin/wishlistcrud.jsx
import { useEffect, useState } from 'react'
import { Heart, Search, ChevronDown, ChevronUp, User, ShoppingBag } from 'lucide-react'
import api from '../api/base'
import { getImageUrl } from '@/config'

export default function WishlistCrud() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    api.get('/user/admin/wishlists')
      .then(res => setData(res.data?.data || res.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false))
  }, [])

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }))

  const filtered = data.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const totalItems = data.reduce((s, u) => s + (u.wishlist?.length || 0), 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Wishlists</h1>
          <p className="mt-1 text-sm text-gray-500">
            {data.length} customers · {totalItems} total wishlist items
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: 'Customers with wishlists', value: data.length, icon: User, color: 'bg-blue-50 text-blue-600' },
          { label: 'Total wishlist items', value: totalItems, icon: Heart, color: 'bg-rose-50 text-rose-600' },
          { label: 'Avg. items / customer', value: data.length ? (totalItems / data.length).toFixed(1) : 0, icon: ShoppingBag, color: 'bg-purple-50 text-purple-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <Heart className="mb-3 h-10 w-10 text-gray-200" />
          <p className="text-gray-400">{search ? 'No customers match your search.' : 'No customers have wishlists yet.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(u => {
            const uid = String(u.userId)
            const open = !!expanded[uid]
            return (
              <div key={uid} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                {/* User row */}
                <button
                  onClick={() => toggle(uid)}
                  className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-gray-50"
                >
                  {/* Avatar */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-sm font-bold text-white">
                    {u.avatarUrl
                      ? <img src={u.avatarUrl} alt={u.name} className="h-full w-full object-cover" />
                      : (u.name?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-semibold text-gray-900">{u.name || '—'}</p>
                    <p className="truncate text-xs text-gray-500">{u.email}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                    <Heart className="h-3 w-3" /> {u.wishlist?.length || 0}
                  </span>
                  {open
                    ? <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
                    : <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />}
                </button>

                {/* Expanded product cards */}
                {open && (
                  <div className="border-t border-gray-100 p-4">
                    {!u.wishlist?.length ? (
                      <p className="text-sm text-gray-400">No items.</p>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {u.wishlist.map((p, idx) => {
                          const price = Number(p.hasOffer && p.discountPrice ? p.discountPrice : p.price) || 0
                          const pid = p._id || p.id || idx
                          return (
                            <div key={pid} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                              <img
                                src={getImageUrl(p.imageUrl, 'https://via.placeholder.com/60')}
                                alt={p.name}
                                onError={e => { e.target.src = 'https://via.placeholder.com/60?text=?' }}
                                className="h-14 w-14 shrink-0 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-medium text-gray-800">{p.name}</p>
                                <p className="mt-0.5 text-xs font-semibold text-gray-700">
                                  Rs.{price.toLocaleString()}
                                  {p.hasOffer && (
                                    <span className="ml-1.5 text-[10px] font-normal text-rose-500 line-through">
                                      Rs.{Number(p.price).toLocaleString()}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
