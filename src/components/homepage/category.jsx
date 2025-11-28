// category.jsx - Popular Categories
import React, { useEffect } from 'react';
import { useCategoryStore } from '../store/categorystore';
import { useNavigate } from 'react-router-dom';
import { Loader2, Smartphone, Shirt, Laptop, Home, Sparkles, Dumbbell, Headphones, Sofa } from 'lucide-react';
import { getImageUrl } from '@/config';

export default function TopCategories() {
  const { categories, loading, fetchCategories } = useCategoryStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fallback categories with Lucide icons
  const fallbackCategories = [
    { name: "Mobiles", icon: Smartphone, iconUrl: "https://cdn-icons-png.flaticon.com/128/10427/10427966.png" },
    { name: "Fashion", icon: Shirt, iconUrl: "https://cdn-icons-png.flaticon.com/128/10425/10425082.png" },
    { name: "Laptops", icon: Laptop, iconUrl: "https://cdn-icons-png.flaticon.com/128/8660/8660342.png" },
    { name: "Home", icon: Home, iconUrl: "https://cdn-icons-png.flaticon.com/128/10425/10425194.png" },
    { name: "Beauty", icon: Sparkles, iconUrl: "https://cdn-icons-png.flaticon.com/128/10427/10427361.png" },
    { name: "Sports", icon: Dumbbell, iconUrl: "https://cdn-icons-png.flaticon.com/128/10427/10427663.png" },
    { name: "Electronics", icon: Headphones, iconUrl: "https://cdn-icons-png.flaticon.com/128/10425/10425209.png" },
    { name: "Furniture", icon: Sofa, iconUrl: "https://cdn-icons-png.flaticon.com/128/10425/10425158.png" },
  ];

  // Map real categories to display format
  const displayCategories = (categories && categories.length > 0)
    ? categories.map((cat, idx) => ({
        name: cat.name,
        imageUrl: getImageUrl(cat.imageUrl, fallbackCategories[idx % fallbackCategories.length].iconUrl),
        icon: fallbackCategories[idx % fallbackCategories.length].icon,
      }))
    : fallbackCategories;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Popular Category
          </h2>
          <button 
            onClick={() => navigate('/products')}
            className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1"
          >
            View All
            <span>→</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-6">
            {displayCategories.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <div
                  key={cat.name}
                  onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
                  className="group cursor-pointer flex flex-col items-center"
                >
                  {/* Circle with Icon */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-teal-100 group-hover:border-2 group-hover:border-teal-500 transition-all duration-300">
                    {cat.imageUrl && !cat.imageUrl.includes('flaticon') ? (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                      />
                    ) : IconComponent ? (
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-gray-600 group-hover:text-teal-600 transition-colors" />
                    ) : (
                      <img
                        src={cat.imageUrl}
                        alt={cat.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                      />
                    )}
                  </div>

                  {/* Category Name */}
                  <p className="text-center text-gray-700 text-xs sm:text-sm font-medium group-hover:text-teal-600 transition-colors">
                    {cat.name}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}