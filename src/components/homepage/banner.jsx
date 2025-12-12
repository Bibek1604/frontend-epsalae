// src/components/Banner.jsx → Premium Image-Focused Banner
import React, { useState, useEffect } from 'react'
import { useBannerStore } from '../store/bannerstore'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { API_BASE_URL } from '@/config'

export default function Banner() {
  const { banners, loading, fetchBanners } = useBannerStore()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  const slides = banners?.length > 0
    ? banners
      .filter(b => b.isActive)
      .map(banner => ({
        imageUrl: banner.imageUrl?.startsWith('http')
          ? banner.imageUrl
          : `${API_BASE_URL}${banner.imageUrl}`,
        title: banner.title || "",
        link: banner.link || "/products"
      }))
    : []

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const prev = () => setCurrent(c => c === 0 ? slides.length - 1 : c - 1)
  const next = () => setCurrent(c => (c + 1) % slides.length)

  if (loading) return (
    <section className="py-4 md:py-6 lg:py-8">
      <div className="px-4 mx-auto max-w-7xl md:px-6 lg:px-8">
        <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100 animate-pulse" style={{ aspectRatio: '1920/600' }} />
      </div>
    </section>
  )
  
  if (slides.length === 0) return null

  return (
    <section className="py-4 md:py-6 lg:py-8 bg-white">
      <div className="px-4 mx-auto max-w-7xl md:px-6 lg:px-8">
        {/* Premium Banner Container */}
        <div 
          className="relative overflow-hidden bg-gray-900 rounded-2xl md:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
          style={{ aspectRatio: '1920/600' }}
        >
          {/* Main Image Slider */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* Banner Image - Full Display */}
              <motion.img
                src={slides[current].imageUrl}
                alt={slides[current].title || "Banner"}
                className="object-cover w-full h-full"
                initial={{ scale: 1.02 }}
                animate={{ scale: 1 }}
                transition={{ duration: 5, ease: "easeOut" }}
                onClick={() => slides[current].link && (window.location.href = slides[current].link)}
                style={{ cursor: slides[current].link ? 'pointer' : 'default' }}
              />
              
              {/* Subtle Premium Vignette Effect */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.15)_100%)]" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows - Minimal Premium Style */}
          {slides.length > 1 && (
            <>
              <button 
                onClick={prev}
                className="absolute z-10 flex items-center justify-center w-10 h-10 transition-all duration-300 -translate-y-1/2 rounded-full opacity-0 md:w-12 md:h-12 left-3 md:left-6 top-1/2 bg-white/90 hover:bg-white hover:scale-110 group-hover:opacity-100 shadow-lg hover:shadow-xl"
                style={{ opacity: 1 }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-800 md:w-6 md:h-6" />
              </button>
              <button 
                onClick={next}
                className="absolute z-10 flex items-center justify-center w-10 h-10 transition-all duration-300 -translate-y-1/2 rounded-full opacity-0 md:w-12 md:h-12 right-3 md:right-6 top-1/2 bg-white/90 hover:bg-white hover:scale-110 group-hover:opacity-100 shadow-lg hover:shadow-xl"
                style={{ opacity: 1 }}
              >
                <ChevronRight className="w-5 h-5 text-gray-800 md:w-6 md:h-6" />
              </button>
            </>
          )}

          {/* Slide Indicators - Premium Pill Style */}
          {slides.length > 1 && (
            <div className="absolute z-10 flex gap-2 -translate-x-1/2 bottom-4 md:bottom-6 left-1/2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i === current 
                      ? "w-8 bg-white shadow-lg" 
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}