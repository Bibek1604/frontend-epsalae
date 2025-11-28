// banner.jsx - Modern clean banner design
import React, { useState, useEffect } from 'react';
import { useBannerStore } from '../store/bannerstore';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '@/config';

const Banner = () => {
  const { banners, loading, fetchBanners } = useBannerStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback banners in case none are available
  const fallbackBanners = [
    { 
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-646728096785?w=1920&h=800&fit=crop', 
      title: 'New Collection', 
      subtitle: 'Discover amazing products at great prices',
      buttonText: 'Shop Now'
    },
    { 
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=800&fit=crop', 
      title: 'Best Deals', 
      subtitle: 'Up to 50% off on selected items',
      buttonText: 'View Deals'
    },
    { 
      imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52a?w=1920&h=800&fit=crop', 
      title: 'Free Shipping', 
      subtitle: 'On all orders above Rs. 1000',
      buttonText: 'Order Now'
    },
  ];

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Map real banners to display format
  const displayBanners = (banners && banners.length > 0 && banners.filter(b => b.isActive))
    ? banners.filter(b => b.isActive).map(banner => ({
        imageUrl: getImageUrl(banner.imageUrl, fallbackBanners[0].imageUrl),
        title: banner.title || 'Special Offer',
        subtitle: banner.subtitle || 'Shop Now!',
        buttonText: banner.buttonText || 'Shop Now'
      }))
    : fallbackBanners;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [displayBanners.length]);

  const goPrev = () => setCurrentIndex((prev) => (prev === 0 ? displayBanners.length - 1 : prev - 1));
  const goNext = () => setCurrentIndex((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="h-[400px] md:h-[500px] bg-gray-100 rounded-2xl flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-2xl bg-gradient-to-r from-teal-50 to-cyan-50 group">
        
        {displayBanners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out flex items-center ${
              index === currentIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            }`}
          >
            {/* Content Section */}
            <div className="w-full md:w-1/2 px-8 md:px-12 lg:px-16 z-10">
              <span className="inline-block px-4 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-full mb-4">
                Featured
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                {banner.title}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md">
                {banner.subtitle}
              </p>
              <button className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-teal-600/25">
                {banner.buttonText}
              </button>
            </div>

            {/* Image Section */}
            <div className="hidden md:block absolute right-0 top-0 w-1/2 h-full">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-50 via-teal-50/80 to-transparent" />
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button 
          onClick={goPrev} 
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white hover:bg-teal-50 text-gray-700 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 border border-gray-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={goNext} 
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white hover:bg-teal-50 text-gray-700 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all z-20 border border-gray-200"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-8 md:left-12 lg:left-16 flex gap-2 z-20">
          {displayBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentIndex 
                  ? 'w-8 h-2 bg-teal-600' 
                  : 'w-2 h-2 bg-gray-300 hover:bg-teal-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;