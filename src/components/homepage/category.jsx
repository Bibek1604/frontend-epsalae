// src/components/TopCategories.jsx → Clean Equal Grid
import { useEffect, useState } from 'react'
import { useCategoryStore } from '../store/categorystore'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getImageUrl } from '@/config'
import { ArrowRight, Sparkles } from 'lucide-react'

// Placeholder for failed images
const CATEGORY_PLACEHOLDER = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

export default function TopCategories() {
  const { categories, loading, fetchCategories } = useCategoryStore()
  const navigate = useNavigate()

  useEffect(() => { fetchCategories() }, [fetchCategories])

  // Only show categories from backend - limit to 8
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
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
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

        {/* Equal Grid - 2 cols mobile, 3 cols tablet, 4 cols desktop */}
        <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {cats.map((cat, i) => (
            <CategoryCard key={cat._id || cat.id || i} cat={cat} index={i} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Equal size category card
function CategoryCard({ cat, index, navigate }) {
  const [imgSrc, setImgSrc] = useState(getImageUrl(cat.imageUrl) || CATEGORY_PLACEHOLDER);
  const catId = cat._id || cat.id;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/products?category=${catId}`)}
      className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm cursor-pointer group rounded-2xl hover:shadow-xl hover:border-transparent"
    >
      {/* Image Container - Fixed aspect ratio */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={imgSrc}
          alt={cat.name}
          className="object-contain w-full h-full p-4 transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgSrc(CATEGORY_PLACEHOLDER)}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-black/10 group-hover:opacity-100" />
      </div>

      {/* Content */}
      <div className="p-4 text-center border-t border-gray-100">
        <h3 className="font-semibold text-gray-900 transition-colors group-hover:text-[#FF6B35] line-clamp-1">
          {cat.name}
        </h3>
        <p className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-500 transition-all group-hover:text-[#1A3C8A] group-hover:gap-2">
          Shop Now 
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </p>
      </div>
    </motion.div>
  )
}