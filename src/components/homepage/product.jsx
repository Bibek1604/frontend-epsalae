import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../store/productstore";
import { Loader2, ShoppingCart } from "lucide-react";

export default function ProductsGrid() {
  const navigate = useNavigate();
  const { products, loading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fallback products in case none are available
  const fallbackProducts = [
    {
      id: 1,
      name: "Color Mastery in Web Design: A Guide to Creating Visually Stunning Websites",
      imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138ed1cb?w=600&h=800&fit=crop",
      price: 49.0,
      stock: 66,
    },
    {
      id: 2,
      name: "Speedy Design Solutions: Mastering the Art of Quick and Effective Design Systems",
      imageUrl: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600&h=800&fit=crop",
      price: 59.0,
      stock: 151,
    },
    {
      id: 3,
      name: "Responsive Web Design Best Practices",
      imageUrl: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&h=800&fit=crop",
      price: 99.0,
      stock: 0,
    },
  ];

  // Map real products to display format
  const displayProducts = (products && products.length > 0)
    ? products.slice(0, 6).map(product => ({
        id: product.id || product._id,
        name: product.name,
        imageUrl: product.imageUrl ? (product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5000${product.imageUrl}`) : fallbackProducts[0].imageUrl,
        price: product.price || 0,
        discountPrice: product.discountPrice,
        stock: product.stock || 0,
        isActive: product.isActive,
      }))
    : fallbackProducts;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Featured Products</h1>
        <p className="text-gray-600 mb-12">Browse our amazing collection of products</p>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden h-96">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Status Badge */}
                  {product.stock > 0 ? (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 shadow-md bg-green-100 text-green-800">
                      <span className="w-2 h-2 rounded-full bg-green-600" />
                      In Stock
                    </span>
                  ) : (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 shadow-md bg-red-100 text-red-800">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      Out of Stock
                    </span>
                  )}

                  {/* Discount Badge */}
                  {product.discountPrice && product.discountPrice > 0 && (
                    <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-md bg-orange-400 text-white">
                      {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                    </span>
                  )}

                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product.id}`);
                    }}
                    className="absolute inset-0 w-full h-full bg-black/0 hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <div className="bg-white rounded-full p-4 shadow-lg hover:scale-110 transition-transform">
                      <ShoppingCart className="w-6 h-6 text-blue-600" />
                    </div>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-4">
                    {product.name}
                  </h3>

                  {/* Price and Stock */}
                  <div className="mt-auto pt-5 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Price</p>
                        <div className="mt-2">
                          {product.discountPrice && product.discountPrice > 0 ? (
                            <>
                              <p className="text-lg font-bold text-blue-600">Rs. {product.discountPrice.toFixed(2)}</p>
                              <p className="text-xs text-gray-400 line-through">Rs. {product.price.toFixed(2)}</p>
                            </>
                          ) : (
                            <p className="text-lg font-bold text-gray-900">Rs. {product.price.toFixed(2)}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</p>
                        <p className="mt-2 text-lg font-bold text-gray-900">{product.stock}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
                        <p className={`mt-2 text-lg font-bold ${product.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                          {product.isActive ? '✓' : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
