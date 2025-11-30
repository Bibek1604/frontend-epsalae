// category.jsx - Premium Blue-Green Categories
import React, { useEffect } from 'react';
import { useCategoryStore } from '../store/categorystore';
import { useNavigate } from 'react-router-dom';
import { Loader2, Smartphone, Shirt, Laptop, Home, Sparkles, Dumbbell, Headphones, Sofa, ArrowRight } from 'lucide-react';
import { getImageUrl } from '@/config';

export default function TopCategories() {
  const { categories, loading, fetchCategories } = useCategoryStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fallback categories with colors
  const fallbackCategories = [
    { name: "Mobiles", icon: Smartphone, color: "from-blue-500 to-cyan-400", bg: "bg-blue-50" },
    { name: "Fashion", icon: Shirt, color: "from-pink-500 to-rose-400", bg: "bg-pink-50" },
    { name: "Laptops", icon: Laptop, color: "from-violet-500 to-purple-400", bg: "bg-violet-50" },
    { name: "Home", icon: Home, color: "from-amber-500 to-orange-400", bg: "bg-amber-50" },
    { name: "Beauty", icon: Sparkles, color: "from-rose-500 to-pink-400", bg: "bg-rose-50" },
    { name: "Sports", icon: Dumbbell, color: "from-green-500 to-emerald-400", bg: "bg-green-50" },
    { name: "Electronics", icon: Headphones, color: "from-indigo-500 to-blue-400", bg: "bg-indigo-50" },
    { name: "Furniture", icon: Sofa, color: "from-teal-500 to-cyan-400", bg: "bg-teal-50" },
  ];

  const displayCategories = (categories && categories.length > 0)
    ? categories.map((cat, idx) => ({
        name: cat.name,
        imageUrl: getImageUrl(cat.imageUrl),
        icon: fallbackCategories[idx % fallbackCategories.length].icon,
        color: fallbackCategories[idx % fallbackCategories.length].color,
        bg: fallbackCategories[idx % fallbackCategories.length].bg,
      }))
    : fallbackCategories;

  return (
    <section className="py-16 bg-[#F7F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <p className="text-gray-500 mt-1">Browse our popular categories</p>
          </div>
          <button 
            onClick={() => navigate('/products')}
            className="group flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#4A90E2] text-[#4A90E2] hover:text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-lg border border-gray-200 hover:border-[#4A90E2]"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-[#4A90E2]" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-6">
            {displayCategories.map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                  className="group cursor-pointer"
                >
                  <div className={`relative ${cat.bg} rounded-2xl p-6 flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:shadow-[#4A90E2]/10 hover:-translate-y-1 border border-transparent hover:border-[#4A90E2]/20`}>
                    {/* Gradient Circle */}
                    <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {cat.imageUrl && !cat.imageUrl.includes('placeholder') ? (
                        <img
                          src={cat.imageUrl}
                          alt={cat.name}
                          className="w-8 h-8 md:w-10 md:h-10 object-contain"
                        />
                      ) : IconComponent ? (
                        <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-white" />
                      ) : null}
                    </div>

                    {/* Category Name */}
                    <p className="text-center text-gray-800 text-sm font-semibold group-hover:text-[#4A90E2] transition-colors">
                      {cat.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}