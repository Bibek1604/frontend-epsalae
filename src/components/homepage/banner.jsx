// src/components/Banner.jsx → FINAL LUXURY COMPACT (BACKEND TITLES KEPT 100%)
import React, { useState, useEffect } from 'react'
import { useBannerStore } from '../store/bannerstore'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react'

export default function Banner() {
  const { banners, loading, fetchBanners } = useBannerStore()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  // Debug: Log banners from backend
  useEffect(() => {
    console.log('🎨 Raw banners from backend:', banners)
  }, [banners])

  // This pulls REAL title, subtitle, badge, cta from your backend
  const slides = banners?.length > 0
    ? banners
      .filter(b => b.isActive)
      .map(banner => {
        console.log('📦 Banner data:', {
          title: banner.title,
          subtitle: banner.subtitle,
          badge: banner.badge,
          buttonText: banner.buttonText,
          imageUrl: banner.imageUrl
        })
        return {
          imageUrl: banner.imageUrl?.startsWith('http')
            ? banner.imageUrl
            : `http://localhost:5000${banner.imageUrl}`,
          title: banner.title || "EPASALEY",
          subtitle: banner.subtitle || "Premium • Authentic • Delivered Fast",
          badge: banner.badge || "EXCLUSIVE",
          cta: banner.buttonText || "SHOP NOW"
        }
      })
    : [
        {
          imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=2000&h=1000&fit=crop",
          title: "EPASALEY",
          subtitle: "Luxury Redefined • Nepal's #1",
          badge: "NEW SEASON",
          cta: "EXPLORE NOW"
        }
      ]

  useEffect(() => {
    if (slides.length < 2) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [slides.length])

  const prev = () => setCurrent(c => c === 0 ? slides.length - 1 : c - 1)
  const next = () => setCurrent(c => (c + 1) % slides.length)

  if (loading) return null

  return (
    <div className="relative h-96 md:h-[520px] lg:h-[560px] overflow-hidden bg-black">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [-100, 100, -100], y: [0, 150, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute w-64 h-64 bg-[#FF6B35]/15 rounded-full blur-3xl -top-20 -left-20"
        />
        <motion.div
          animate={{ x: [50, -50, 50], y: [100, -100, 100] }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute w-56 h-56 bg-[#1A3C8A]/20 rounded-full blur-3xl bottom-10 right-10"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].imageUrl}
            alt={slides[current].title}
            className="w-full h-full object-cover brightness-[0.45] scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/40" />

          <div className="relative flex items-center justify-start h-full px-6 md:px-16 lg:px-24">
            <div className="max-w-5xl">
              {/* Badge from backend */}
              <motion.div
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="inline-flex items-center gap-3 px-8 py-3 mb-6 bg-gradient-to-r from-[#FF6B35] to-red-600 rounded-full shadow-2xl border border-white/10"
              >
                <Zap className="text-white w-7 h-7 animate-pulse" />
                <span className="text-lg font-black tracking-wider text-white">
                  {slides[current].badge}
                </span>
              </motion.div>

              {/* TITLE FROM BACKEND – SAME GOD-TIER STYLE */}
              <h1 className="text-7xl md:text-9xl lg:text-[11rem] font-black leading-none text-white">
                {slides[current].title.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 400, rotateX: -90 }}
                    animate={{ y: 0, rotateX: 0 }}
                    transition={{ delay: 0.6 + i * 0.05, type: "spring", stiffness: 100 }}
                    className="inline-block"
                    style={{ textShadow: "0 10px 40px rgba(0,0,0,0.9)" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </h1>

              {/* SUBTITLE FROM BACKEND – SAME STYLE */}
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
                className="max-w-4xl mt-8 text-3xl font-light text-gray-200 md:text-5xl drop-shadow-2xl"
              >
                {slides[current].subtitle}
              </motion.p>

              {/* CTA FROM BACKEND – SAME BUTTON */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 2.2, type: "spring", stiffness: 80 }}
                className="mt-16"
              >
                <button className="relative px-24 py-12 overflow-hidden text-4xl font-black text-black bg-white rounded-full group md:text-5xl shadow-4xl">
                  <span className="relative z-10 flex items-center gap-6">
                    {slides[current].cta}
                    <ChevronRight className="w-12 h-12 transition-transform duration-300 group-hover:translate-x-6" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] to-[#1A3C8A]"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute z-10 transition-all -translate-y-1/2 border rounded-full left-4 top-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl hover:bg-white/20 border-white/20">
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button onClick={next} className="absolute z-10 transition-all -translate-y-1/2 border rounded-full right-4 top-1/2 w-14 h-14 bg-white/10 backdrop-blur-xl hover:bg-white/20 border-white/20">
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
          <div className="absolute flex gap-3 -translate-x-1/2 bottom-8 left-1/2">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${i === current ? "w-12 bg-[#FF6B35]" : "w-2 bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Brand */}
      <div className="absolute top-6 right-8">
        <span className="text-4xl font-black tracking-widest text-white/90">EPASALEY</span>
      </div>
    </div>
  )
}