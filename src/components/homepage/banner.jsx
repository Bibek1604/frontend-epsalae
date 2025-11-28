// banner.jsx - Fetches real banners from store
import React, { useState, useEffect } from 'react';
import { useBannerStore } from '../store/bannerstore';
import { Loader2 } from 'lucide-react';

const Banner = () => {
  const { banners, loading, fetchBanners } = useBannerStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback banners in case none are available
  const fallbackBanners = [
    { imageUrl: 'https://images.unsplash.com/photo-1441986300917-646728096785?w=1920&h=800&fit=crop', title: 'Summer Sale – Up to 70% Off', subtitle: 'Limited time only' },
    { imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=800&fit=crop', title: 'New Arrivals 2025', subtitle: 'Shop the latest trends' },
    { imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52a?w=1920&h=800&fit=crop', title: 'Free Shipping Worldwide', subtitle: 'On orders over $50' },
    { imageUrl: 'https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=1920&h=800&fit=crop', title: 'Black Friday Deals', subtitle: 'Starting Now!' },
  ];

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Map real banners to display format
  const displayBanners = (banners && banners.length > 0 && banners.filter(b => b.isActive))
    ? banners.filter(b => b.isActive).map(banner => ({
        imageUrl: banner.imageUrl ? (banner.imageUrl.startsWith('http') ? banner.imageUrl : `http://localhost:5000${banner.imageUrl}`) : fallbackBanners[0].imageUrl,
        title: banner.title || 'Special Offer',
        subtitle: banner.subtitle || 'Shop Now!',
      }))
    : fallbackBanners;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));
    }, 3500);
    return () => clearInterval(interval);
  }, [displayBanners.length]);

  const goPrev = () => setCurrentIndex((prev) => (prev === 0 ? displayBanners.length - 1 : prev - 1));
  const goNext = () => setCurrentIndex((prev) => (prev === displayBanners.length - 1 ? 0 : prev + 1));

  if (loading) {
    return (
      <div className="flex justify-center py-6 px-4">
        <div className="w-full max-w-7xl lg:w-[90%] h-[380px] md:h-[450px] rounded-tl-[40px] rounded-tr-[20px] rounded-bl-[30px] rounded-br-[50px] bg-gray-200 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-6 px-4">
      {/* 70% width + shorter height + unique corners */}
      <div className="relative w-full max-w-7xl lg:w-[90%] h-[380px] md:h-[450px] overflow-hidden 
                      rounded-tl-[40px] rounded-tr-[20px] rounded-bl-[30px] rounded-br-[50px] 
                      shadow-2xl group">
        
        {displayBanners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Main Image */}
            <div
              className="absolute inset-0 bg-cover bg-center rounded-tl-[40px] rounded-tr-[20px] rounded-bl-[30px] rounded-br-[50px]"
              style={{ backgroundImage: `url(${banner.imageUrl})` }}
            />

            {/* Hover zoom layer */}
            <div
              className="absolute inset-0 bg-cover bg-center scale-100 group-hover:scale-105 transition-transform duration-[12s] rounded-tl-[40px] rounded-tr-[20px] rounded-bl-[30px] rounded-br-[50px]"
              style={{ backgroundImage: `url(${banner.imageUrl})` }}
            />

            {/* Blackish overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tl-[40px] rounded-tr-[20px] rounded-bl-[30px] rounded-br-[50px]" />

            {/* Text Content */}
            <div className="relative h-full flex items-center px-8 md:px-12">
              <div className={`max-w-md transition-all duration-1000 ${
                index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-2xl mb-3 leading-tight">
                  {banner.title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-6">
                  {banner.subtitle}
                </p>
                <button className="px-7 py-3 bg-white text-black font-bold text-base rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-xl">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-3xl opacity-0 group-hover:opacity-100 transition-all z-10">
          ‹
        </button>
        <button onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center text-3xl opacity-0 group-hover:opacity-100 transition-all z-10">
          ›
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {displayBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === currentIndex 
                  ? 'w-10 h-2.5 bg-white' 
                  : 'w-2.5 h-2.5 bg-white/60 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;