// BrandsSection.jsx - Clean brand carousel
import React from 'react';

export default function BrandsSection() {
  const brands = [
    { name: "Apple", logo: "https://cdn.worldvectorlogo.com/logos/apple-11.svg" },
    { name: "Samsung", logo: "https://cdn.worldvectorlogo.com/logos/samsung-6.svg" },
    { name: "Nike", logo: "https://cdn.worldvectorlogo.com/logos/nike-4.svg" },
    { name: "Adidas", logo: "https://cdn.worldvectorlogo.com/logos/adidas-8.svg" },
    { name: "Sony", logo: "https://cdn.worldvectorlogo.com/logos/sony-2.svg" },
    { name: "LG", logo: "https://cdn.worldvectorlogo.com/logos/lg-6.svg" },
    { name: "Dell", logo: "https://cdn.worldvectorlogo.com/logos/dell-11.svg" },
    { name: "Google", logo: "https://cdn.worldvectorlogo.com/logos/google-2.svg" },
  ];

  // Duplicate array for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-12 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Shop by Brands
        </h2>

        {/* Infinite Scrolling Marquee */}
        <div className="relative">
          <div className="flex animate-marquee">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="mx-6 flex-shrink-0"
              >
                <div className="bg-white rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all duration-300 p-6 w-32 h-32 flex items-center justify-center">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tailwind Animation Keyframes */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}