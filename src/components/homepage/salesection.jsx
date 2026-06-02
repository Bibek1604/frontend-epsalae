// src/components/homepage/salesection.jsx
// Shows all active sale categories on the homepage
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingCart, Tag, Loader2 } from 'lucide-react'
import api from '@/components/api/base'
import { useCart } from '@/store/cartstore'
import { getImageUrl } from '@/config'
import toast from 'react-hot-toast'

function CountdownTimer({ endDate }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 })
  useEffect(() => {
    if (!endDate) return
    const tick = () => {
      const diff = new Date(endDate) - Date.now()
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0 }); return }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endDate])
  if (!endDate) return null
  const Unit = ({ v, l }) => (
    <div className="text-center">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1 min-w-[36px] text-white font-bold text-lg leading-none">{String(v).padStart(2, '0')}</div>
      <div className="text-white/70 text-[10px] mt-0.5 uppercase tracking-wide">{l}</div>
    </div>
  )
  return (
    <div className="flex items-end gap-1.5">
      {t.d > 0 && <Unit v={t.d} l="d" />}
      <Unit v={t.h} l="hr" />
      <Unit v={t.m} l="min" />
      <Unit v={t.s} l="sec" />
    </div>
  )
}

function SaleProductCard({ product, saleId }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()
  const price = product.sale_price ?? product.original_price ?? product.price
  const original = product.original_price ?? product.price
  const discount = product.discount_percentage

  const handleAdd = (e) => {
    e.stopPropagation()
    addToCart({ id: product.id, name: product.name, price, image: product.imageUrl, quantity: 1 })
    toast.success('Added to cart!')
  }
  return (
    <motion.div whileHover={{ y: -4 }} onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer group hover:shadow-md transition-shadow">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img src={getImageUrl(product.imageUrl)} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' }} />
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-[#FF6B35] text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{product.name}</p>
        <div className="mt-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-bold text-gray-900">Rs. {price?.toLocaleString()}</span>
            {discount > 0 && <span className="ml-1.5 text-xs text-gray-400 line-through">Rs. {original?.toLocaleString()}</span>}
          </div>
          <button onClick={handleAdd}
            className="p-2 bg-[#FF6B35] hover:bg-orange-500 text-white rounded-xl transition shrink-0 shadow-sm shadow-orange-200">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function SaleSection() {
  const navigate = useNavigate()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/sale-categories/active')
      .then(res => setSales(Array.isArray(res.data?.data) ? res.data.data : []))
      .catch(() => setSales([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <section className="py-12 px-4">
      <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#FF6B35]" /></div>
    </section>
  )
  if (!sales.length) return null

  return (
    <section className="py-10 px-4 space-y-12">
      {sales.map(sale => {
        const products = Array.isArray(sale.products) ? sale.products : []
        const preview = products.slice(0, 6)
        if (preview.length === 0) return null
        return (
          <div key={sale.id || sale.slug}>
            {/* Sale header */}
            <div className={`rounded-3xl overflow-hidden mb-6 ${sale.banner ? '' : 'bg-gradient-to-r from-[#0A1E46] via-[#1A3C8A] to-[#FF6B35]'}`}
              style={sale.banner ? { background: `url(${sale.banner}) center/cover no-repeat` } : {}}>
              <div className={`px-6 py-7 ${sale.banner ? 'bg-black/50' : ''}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-7xl mx-auto">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-orange-300" />
                      <span className="text-orange-300 text-xs font-bold uppercase tracking-widest">Special Sale</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">{sale.title}</h2>
                    {sale.description && <p className="text-white/70 text-sm mt-1 max-w-md">{sale.description}</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    {sale.end_date && <CountdownTimer endDate={sale.end_date} />}
                    <button onClick={() => navigate(`/sale/${sale.slug}`)}
                      className="flex items-center gap-2 bg-white text-gray-900 hover:bg-orange-50 font-semibold px-5 py-2.5 rounded-xl text-sm transition whitespace-nowrap shrink-0">
                      View All <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products grid */}
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {preview.map((p, i) => (
                <SaleProductCard key={p.id || i} product={p} saleId={sale.id} />
              ))}
            </div>
            {products.length > 6 && (
              <div className="text-center mt-5">
                <button onClick={() => navigate(`/sale/${sale.slug}`)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white font-semibold rounded-xl text-sm transition">
                  View All {products.length} Products <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )
      })}
    </section>
  )
}
