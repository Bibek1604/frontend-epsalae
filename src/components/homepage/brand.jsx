// BrandsSection.jsx
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
    { name: "HP", logo: "https://cdn.worldvectorlogo.com/logos/hewlett-packard-enterprise-1.svg" },
    { name: "Google", logo: "https://cdn.worldvectorlogo.com/logos/google-2.svg" },
    { name: "Microsoft", logo: "https://cdn.worldvectorlogo.com/logos/microsoft-6.svg" },
  ];

  // Duplicate array for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-[#2A2F4F]">
          Shop by Top Brands
        </h2>

        {/* Infinite Scrolling Marquee */}
        <div className="relative">
          <div className="flex animate-marquee whitespace-nowrap">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={`${brand.name}-${index}`}
                className="mx-8 flex-shrink-0"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 w-40 h-40 flex items-center justify-center border-2 border-transparent hover:border-[#FFB200] hover:scale-110">
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optional: Second row moving opposite direction (for cool effect) */}
        <div className="mt-12">
          <div className="flex animate-marquee-reverse">
            {duplicatedBrands.slice(0, 8).map((brand, index) => (
              <div key={`reverse-${index}`} className="mx-8 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-lg p-6 w-36 h-36 flex items-center justify-center opacity-60 hover:opacity-100 transition-all">
                  <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
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
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 20s linear infinite;
        }
        .animate-marquee:hover,
        .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}