// src/components/BrandsSection.jsx → ULTRA-PREMIUM GOOGLE-STYLE NEPALI BRANDS (2025 FINAL)
// Now uses localStorage via brandstore for admin management
import React from 'react'
import { motion } from 'framer-motion'
import { useBrandStore } from '../store/brandstore'

export default function BrandsSection() {
  // Get brands from localStorage store
  const { brands } = useBrandStore()

  // If no brands, don't render section
  if (!brands || brands.length === 0) return null

  const duplicated = [...brands, ...brands]

  return (
    <section className="py-10 sm:py-16 overflow-hidden bg-white border-t border-b border-gray-100">
      <div className="px-4 sm:px-6 mx-auto max-w-7xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-3 text-3xl sm:text-5xl font-black text-center text-gray-900 md:text-6xl"
        >
          Trusted Global Brands
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 sm:mb-14 text-base sm:text-xl text-center text-gray-600"
        >
          Authentic • Original • Delivered Across Nepal
        </motion.p>

        {/* Main Infinite Marquee */}
        <div className="relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {duplicated.map((brand, i) => (
              <motion.div
                key={`${brand.id}-${i}`}
                whileHover={{ scale: 1.15 }}
                className="flex-shrink-0 mx-5 sm:mx-10"
              >
                <div className="relative flex items-center justify-center w-32 h-32 sm:w-48 sm:h-48 overflow-hidden transition-all duration-500 bg-white border border-gray-200 shadow-lg group rounded-3xl hover:shadow-2xl hover:border-gray-300">
                  <img
                    src={brand.logo}
                    alt={brand.name || 'Brand'}
                    className="object-contain w-20 h-20 sm:w-32 sm:h-32 transition-all duration-700 filter grayscale group-hover:grayscale-0"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100?text=Brand';
                    }}
                  />
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/5 to-transparent group-hover:opacity-100" />
                  {brand.name && (
                    <div className="absolute transition-opacity duration-300 -translate-x-1/2 opacity-0 bottom-3 left-1/2 group-hover:opacity-100">
                      <span className="px-3 py-1 text-xs font-bold text-gray-700 rounded-full shadow bg-white/90">
                        {brand.name}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reverse Row */}
        {brands.length >= 4 && (
          <div className="mt-8 sm:mt-16">
            <div className="flex animate-marquee-reverse whitespace-nowrap">
              {duplicated.slice(0, Math.min(8, brands.length * 2)).map((brand, i) => (
                <motion.div
                  key={`rev-${brand.id}-${i}`}
                  whileHover={{ scale: 1.1 }}
                  className="flex-shrink-0 mx-6 sm:mx-12"
                >
                  <div className="flex items-center justify-center w-28 h-28 p-4 sm:w-40 sm:h-40 sm:p-8 transition-all border border-gray-100 shadow-md bg-gray-50/80 backdrop-blur-sm rounded-2xl hover:shadow-xl duration-400">
                    <img
                      src={brand.logo}
                      alt={brand.name || 'Brand'}
                      className="object-contain transition-opacity duration-500 w-20 h-20 sm:w-28 sm:h-28 opacity-70 hover:opacity-100"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100?text=Brand';
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Animation Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 35s linear infinite;
        }
        .animate-marquee:hover,
        .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}