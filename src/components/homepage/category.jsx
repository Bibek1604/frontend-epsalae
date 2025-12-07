// src/components/TopCategories.jsx → COMPACT LUXURY EDITION (Best one yet)
import { useEffect, useState } from 'react'
import { useCategoryStore } from '../store/categorystore'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getImageUrl } from '@/config'
import { ArrowRight, Zap, Sparkles } from 'lucide-react'

// Placeholder for failed images
const CATEGORY_PLACEHOLDER = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

export default function TopCategories() {
  const { categories, loading, fetchCategories } = useCategoryStore()
  const navigate = useNavigate()

  useEffect(() => { fetchCategories() }, [fetchCategories])

  // Only show categories from backend
  const cats = categories.length > 0 ? categories.slice(0, 8) : []

  if (loading) return (
    <div className="py-20 text-center bg-gray-50">
      <div className="w-14 h-14 border-4 border-gray-200 border-t-[#FF6B35] rounded-full animate-spin inline-block" />
      <p className="mt-4 text-gray-500">Loading categories...</p>
    </div>
  )

  // Don't show section if no categories from backend
  if (cats.length === 0) return null

  return (
    <section className="py-16 bg-gray-50">
      <div className="px-6 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-semibold text-[#1A3C8A] bg-blue-50 rounded-full"
          >
            <Sparkles className="w-4 h-4" />
            Browse by Category
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 md:text-4xl"
          >
            Shop Our Collections
          </motion.h2>
        </div>

        {/* Compact Grid – 4 on top, 4 wide below */}
        <div className="grid grid-cols-2 gap-5 mb-8 md:grid-cols-4">
          {cats.slice(0, 4).map((cat, i) => (
            <CompactCard key={cat._id || cat.id || i} cat={cat} index={i} navigate={navigate} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cats.slice(4, 8).map((cat, i) => (
            <WideCompactCard key={cat._id || cat.id || i} cat={cat} navigate={navigate} />
          ))}
        </div>

      </div>
    </section>
  )
}

// Tiny but powerful square card with enhanced interactions
function CompactCard({ cat, index, navigate }) {
  const [imgSrc, setImgSrc] = useState(getImageUrl(cat.imageUrl) || CATEGORY_PLACEHOLDER);
  const catId = cat._id || cat.id;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/products?category=${catId}`)}
      className="relative overflow-hidden transition-all duration-500 shadow-lg cursor-pointer group rounded-2xl aspect-square hover:shadow-2xl card-shine"
    >
      <img
        src={imgSrc}
        alt={cat.name}
        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        onError={() => setImgSrc(CATEGORY_PLACEHOLDER)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity group-hover:opacity-90" />

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="text-lg font-bold tracking-tight">{cat.name}</h3>
        <p className="flex items-center gap-1 mt-1 text-sm transition-all opacity-80 group-hover:gap-3 group-hover:opacity-100">
          Shop Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
        </p>
      </div>

      {/* Subtle glow on hover */}
      <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 ring-2 ring-white/30 rounded-2xl" />
    </motion.div>
  )
}

// Clean wide card with enhanced hover
function WideCompactCard({ cat, navigate }) {
  const [imgSrc, setImgSrc] = useState(getImageUrl(cat.imageUrl) || CATEGORY_PLACEHOLDER);
  const catId = cat._id || cat.id;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate(`/products?category=${catId}`)}
      className="relative h-56 overflow-hidden transition-all shadow-lg cursor-pointer group rounded-2xl md:h-64 hover:shadow-2xl"
    >
      <img
        src={imgSrc}
        alt={cat.name}
        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        onError={() => setImgSrc(CATEGORY_PLACEHOLDER)}
      />
      <div className="absolute inset-0 transition-all bg-gradient-to-r from-black/70 via-black/20 to-black/70 group-hover:from-black/80 group-hover:to-black/80" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <motion.h3 
            className="mb-4 text-3xl font-black md:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            {cat.name}
          </motion.h3>
          <button className="px-8 py-3 text-sm font-bold text-black transition-all bg-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl btn-press">
            SHOP NOW
          </button>
        </div>
      </div>
    </motion.div>
  )
}