import React from "react";

export default function ProductsGrid() {
  const products = [
    {
      id: 1,
      title: "Color Mastery in Web Design: A Guide to Creating Visually Stunning Websites",
      cover: "https://images.unsplash.com/photo-1558655146-9f40138ed1cb?w=600&h=800&fit=crop",
      status: "Published",
      price: 49.0,
      sales: 66,
      revenue: 1900.08,
    },
    {
      id: 2,
      title: "Speedy Design Solutions: Mastering the Art of Quick and Effective Design Systems",
      cover: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600&h=800&fit=crop",
      status: "Published",
      price: 59.0,
      sales: 151,
      revenue: 6597.9,
    },
    {
      id: 3,
      title: "Responsive Web Design Best Practices",
      cover: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=800&fit=crop",
      status: "Draft",
      price: 99.0,
      sales: null,
      revenue: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Flash sales</h1>
        <p className="text-gray-600 mb-12">Manage and view your product listings</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            >
              {/* Book Cover Image */}
              <div className="relative">
                <img
                  src={product.cover}
                  alt={product.title}
                  className="w-full h-96 object-cover"
                />
                {/* Floating Status Badge */}
                <span
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 shadow-md ${
                    product.status === "Published"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      product.status === "Published" ? "bg-green-600" : "bg-gray-600"
                    }`}
                  />
                  {product.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-3 mb-6">
                  {product.title}
                </h3>

                {/* Stats */}
                <div className="mt-auto pt-5 border-t border-gray-200">
                  <div className="grid grid-cols-3 text-center">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </p>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        ₹{product.price.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </p>
                      <p className="mt-1 text-lg font-bold text-gray-900">
                        {product.sales ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </p>
                      <p className="mt-1 text-lg font-bold text-emerald-600">
                        {product.revenue ? `₹${product.revenue.toFixed(2)}` : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}