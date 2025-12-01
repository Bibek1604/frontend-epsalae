// src/components/TopCategories.jsx → COMPACT LUXURY EDITION (Best one yet)
import { useEffect } from 'react'
import { useCategoryStore } from '../store/categorystore'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getImageUrl } from '@/config'
import { ArrowRight, Zap } from 'lucide-react'

export default function TopCategories() {
  const { categories, loading, fetchCategories } = useCategoryStore()
  const navigate = useNavigate()

  useEffect(() => { fetchCategories() }, [fetchCategories])

  const cats = categories.length > 0 ? categories.slice(0, 8) : [
    { name: "Fashion" }, { name: "Mobiles" }, { name: "Beauty" }, { name: "Electronics" },
    { name: "Sports" }, { name: "Watches" }, { name: "Home & Living" }, { name: "Gaming" }
  ]

  if (loading) return (
    <div className="py-20 text-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FF6B35] rounded-full animate-spin inline-block" />
    </div>
  )

  return (
    <section className="py-16 bg-gray-50">
      <div className="px-6 mx-auto max-w-7xl">

        {/* Compact Grid – 4 on top, 4 wide below */}
        <div className="grid grid-cols-2 gap-5 mb-8 md:grid-cols-4">
          {cats.slice(0, 4).map((cat, i) => (
            <CompactCard key={cat._id || i} cat={cat} index={i} navigate={navigate} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cats.slice(4, 8).map((cat, i) => (
            <WideCompactCard key={cat._id || i} cat={cat} navigate={navigate} />
          ))}
        </div>

      </div>
    </section>
  )
}

// Tiny but powerful square card
function CompactCard({ cat, index, navigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => navigate(`/products?category=${cat._id || cat.name}`)}
      className="relative overflow-hidden transition-all duration-500 shadow-lg cursor-pointer group rounded-2xl aspect-square hover:shadow-2xl"
    >
      <img
        src={getImageUrl(cat.imageUrl) || "/api/placeholder/400/400"}
        alt={cat.name}
        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-lg font-bold tracking-tight">{cat.name}</h3>
        <p className="flex items-center gap-1 mt-1 text-sm opacity-80">
          Shop <ArrowRight className="w-4 h-4 transition group-hover:translate-x-2" />
        </p>
      </div>

      {index < 2 && (
<div></div>
      )}
    </motion.div>
  )
}

// Clean wide card (still compact)
function WideCompactCard({ cat, navigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      onClick={() => navigate(`/products?category=${cat._id || cat.name}`)}
      className="relative h-56 overflow-hidden transition-all shadow-lg cursor-pointer group rounded-2xl md:h-64 hover:shadow-2xl"
    >
      <img
        src={getImageUrl(cat.imageUrl) || "/api/placeholder/800/400"}
        alt={cat.name}
        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <h3 className="mb-2 text-3xl font-black md:text-4xl">{cat.name}</h3>
          <button className="px-8 py-3 text-sm font-bold text-black transition bg-white rounded-full hover:scale-110">
            SHOP NOW
          </button>
        </div>
      </div>
    </motion.div>
  )
}