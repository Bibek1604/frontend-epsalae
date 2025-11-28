// category.jsx
import React, { useEffect } from 'react';
import { useCategoryStore } from '../store/categorystore';
import { Loader2 } from 'lucide-react';

export default function TopCategories() {
  const { categories, loading, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fallback categories if none are available
  const fallbackCategories = [
    { name: "Mobiles", icon: "https://cdn-icons-png.flaticon.com/128/10427/10427966.png", color: "from-blue-500 to-cyan-500" },
    { name: "Fashion", icon: "https://cdn-icons-png.flaticon.com/128/10425/10425082.png", color: "from-pink-500 to-rose-500" },
    { name: "Laptops", icon: "https://cdn-icons-png.flaticon.com/128/8660/8660342.png", color: "from-purple-500 to-indigo-500" },
    { name: "Home", icon: "https://cdn-icons-png.flaticon.com/128/10425/10425194.png", color: "from-orange-400 to-red-500" },
    { name: "Beauty", icon: "https://cdn-icons-png.flaticon.com/128/10427/10427361.png", color: "from-fuchsia-500 to-purple-600" },
    { name: "Sports", icon: "https://cdn-icons-png.flaticon.com/128/10427/10427663.png", color: "from-green-500 to-emerald-600" },
    { name: "Electronics", icon: "https://cdn-icons-png.flaticon.com/128/10425/10425209.png", color: "from-teal-500 to-blue-600" },
    { name: "Furniture", icon: "https://cdn-icons-png.flaticon.com/128/10425/10425158.png", color: "from-amber-600 to-yellow-500" },
  ];

  // Map real categories to display format
  const displayCategories = (categories && categories.length > 0)
    ? categories.map((cat, idx) => ({
        name: cat.name,
        imageUrl: cat.imageUrl ? (cat.imageUrl.startsWith('http') ? cat.imageUrl : `http://localhost:5000${cat.imageUrl}`) : fallbackCategories[idx % fallbackCategories.length].icon,
        color: fallbackCategories[idx % fallbackCategories.length].color,
      }))
    : fallbackCategories;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-[#2A2F4F]">
          Shop by Top Categories
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#FFB200]" />
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-8 lg:gap-12">
            {displayCategories.map((cat, idx) => (
              <div
                key={cat.name}
                className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-3"
              >
                <div className="relative mx-auto w-28 h-28 sm:w-32 sm:h-32 mb-5">
                  {/* Gradient Circle Background */}
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${cat.color} opacity-20 group-hover:opacity-40 blur-xl transition-all duration-500`} />
                  
                  {/* Main Circle with Icon */}
                  <div className="relative w-full h-full bg-white rounded-full shadow-xl group-hover:shadow-2xl border-4 border-white group-hover:border-[#FFB200] flex items-center justify-center transition-all duration-300 overflow-hidden">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Shine Effect */}
                    <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                  </div>
                </div>

                <p className="text-center font-semibold text-gray-700 text-sm sm:text-base group-hover:text-[#FFB200] transition-colors duration-300">
                  {cat.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}