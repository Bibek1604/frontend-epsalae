import React, { useEffect } from 'react'
import { useProductStore } from '../store/productstore'
import { getImageUrl } from '@/config'
import { formatProductName } from '@/lib/utils'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { useCart } from '@/store/cartstore'
import { Link, useNavigate } from 'react-router-dom'

export default function FeaturedCarousel(){
  const { products, loading, fetchProductsWithOffers } = useProductStore()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => { fetchProductsWithOffers({ limit: 12 }) }, [fetchProductsWithOffers])

  if(loading || !products || products.length === 0) return null

  return (
    <section className="py-6 sm:py-10">
      <div className="px-3 sm:px-6 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Hot Deals</h3>
          <Link to="/products" className="text-sm text-[#1A3C8A] font-medium flex items-center gap-2">View all <ArrowRight className="w-4 h-4"/></Link>
        </div>

        <div className="overflow-x-auto -mx-4 px-3 sm:px-4">
          <div className="flex gap-4 w-max py-2">
            {products.slice(0,12).map(p => (
              <article key={p._id || p.id} className="w-44 sm:w-56 flex-shrink-0 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="aspect-square p-3 flex items-center justify-center bg-gray-50">
                  <img src={getImageUrl(p.imageUrl)} alt={p.name} className="object-contain w-full h-full" onError={(e)=> e.target.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'} />
                </div>
                <div className="p-3">
                  <h4 onClick={() => navigate(`/product/${p._id || p.id}`)} className="text-sm font-semibold text-gray-900 cursor-pointer line-clamp-2">{formatProductName(p.name)}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-sm font-bold">Rs. {((p.discountPrice && p.discountPrice<p.price) ? p.discountPrice : p.price)?.toLocaleString()}</div>
                    <button onClick={(e)=>{ e.stopPropagation(); addToCart({ id: p._id||p.id, name: p.name, price: p.discountPrice||p.price, image: getImageUrl(p.imageUrl), quantity:1 }) }} className="p-2 text-white bg-[#1A3C8A] rounded-full">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
