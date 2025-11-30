// src/components/TopCategories.jsx - 2025 Ultra-Premium Edition
import React, { useEffect } from 'react'
import { useCategoryStore } from '../store/categorystore'
import { useNavigate } from 'react-router-dom'
import { 
  Loader2, 
  Smartphone, 
  Shirt, 
  Laptop, 
  Home, 
  Sparkles, 
  Dumbbell, 
  Headphones, 
  Sofa, 
  Watch, 
  Gamepad2, 
  Camera, 
  Package,
  ArrowRight 
} from 'lucide-react'
import { getImageUrl } from '@/config'
import { motion } from 'framer-motion'

// Icon mapping
const ICONS = {
  Mobiles: Smartphone,
  Fashion: Shirt,
  Laptops: Laptop,
  'Home & Living': Home,
  Beauty: Sparkles,
  Sports: Dumbbell,
  Electronics: Headphones,
  Furniture: Sofa,
  Watches: Watch,
  Gaming: Gamepad2,
  Cameras: Camera,
  Accessories: Package,
}

export default function TopCategories() {
  const { categories, loading, fetchCategories } = useCategoryStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const displayCategories = categories.length > 0 ? categories : [
    { name: "Mobiles" },
    { name: "Fashion" },
    { name: "Laptops" },
    { name: "Home & Living" },
    { name: "Beauty" },
    { name: "Sports" },
    { name: "Electronics" },
    { name: "Furniture" },
  ]

  return (
    <section className="py-24 overflow-hidden bg-white lg:py-32">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">

        {/* Header – Editorial Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <h2 className="text-5xl font-light tracking-tight text-gray-900 md:text-7xl">
            Shop by <span className="font-medium">Category</span>
          </h2>
          <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-500">
            Curated collections. Delivered across Nepal in 1–3 days.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="w-12 h-12 text-gray-900 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-8">

            {displayCategories.map((cat, index) => {
              const Icon = ICONS[cat.name] || Package

              return (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.07 }}
                  onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                  className="cursor-pointer group"
                >
                  <div className="relative aspect-square">

                    {/* Background Circle – Ultra Clean */}
                    <div className="absolute inset-0 transition-transform duration-700 scale-95 rounded-3xl bg-gray-50 group-hover:scale-100" />

                    {/* Black Icon Circle */}
                    <div className="relative flex flex-col items-center justify-center h-full gap-6">
                      <div className="flex items-center justify-center w-24 h-24 transition-all duration-700 bg-gray-900 rounded-full shadow-2xl md:w-28 md:h-28 ring-8 ring-white/70 group-hover:shadow-3xl group-hover:ring-emerald-500/20">
                        {cat.imageUrl && !cat.imageUrl.includes('placeholder') ? (
                          <img
                            src={getImageUrl(cat.imageUrl)}
                            alt={cat.name}
                            className="object-contain w-14 h-14"
                          />
                        ) : (
                          <Icon className="text-white w-14 h-14" />
                        )}
                      </div>

                      {/* Category Name – Bold & Minimal */}
                      <p className="text-lg font-medium tracking-tight text-gray-900 transition-colors duration-500 md:text-xl group-hover:text-emerald-600">
                        {cat.name}
                      </p>
                    </div>

                    {/* Subtle Hover Ring */}
                    <div className="absolute transition-all duration-700 -inset-4 rounded-3xl ring-1 ring-transparent group-hover:ring-emerald-600/20" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* CTA – Hidden on mobile, visible on lg+ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <button
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-4 px-12 py-5 text-lg font-medium text-white transition-all duration-500 bg-gray-900 rounded-full hover:bg-gray-800 hover:shadow-2xl group"
          >
            Explore All Categories
            <ArrowRight className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-2" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}