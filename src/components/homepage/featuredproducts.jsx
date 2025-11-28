import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/productstore';
import { Zap, TrendingUp } from 'lucide-react';

export default function FeaturedProducts() {
  const navigate = useNavigate();
  const { products, loading, fetchProductsWithOffers } = useProductStore();
  const [visible, setVisible] = useState(8);

  useEffect(() => {
    fetchProductsWithOffers({ limit: 12 });
  }, [fetchProductsWithOffers]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-product.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  const getDiscountPercent = (before, after) => {
    if (!before || !after) return 0;
    return Math.round(((before - after) / before) * 100);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-lg">
        <div className="text-center py-12">
          <div className="animate-spin inline-block">
            <Zap className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">🎉 Special Offers</h2>
        <p className="text-gray-600 text-center py-8">No special offers available</p>
      </div>
    );
  }

  const visibleProducts = products.slice(0, visible);

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 p-8 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-red-600 animate-pulse" />
        <div>
          <h2 className="text-3xl font-bold text-gray-900">🎉 Special Offers</h2>
          <p className="text-gray-600 text-sm">Limited time deals - Save big today!</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {visibleProducts.map((product) => (
          <div
            key={product.id || product._id}
            onClick={() => navigate(`/product/${product._id || product.id}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 border-red-100 cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative h-40 bg-gray-200 overflow-hidden">
              <img
                src={getImageUrl(product.imageUrl)}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = '/placeholder-product.jpg';
                }}
              />

              {/* Discount Badge - Large & Prominent */}
              {product.discountPrice > 0 && (
                <div className="absolute top-2 right-2 bg-gradient-to-br from-red-500 to-red-600 text-white px-3 py-2 rounded-lg shadow-lg font-bold text-center">
                  <div className="text-2xl">{getDiscountPercent(product.price, product.discountPrice)}%</div>
                  <div className="text-xs">OFF</div>
                </div>
              )}

              {/* Hot Deal Badge */}
              <div className="absolute bottom-2 left-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingUp size={12} />
                Hot Deal
              </div>
            </div>

            {/* Content */}
            <div className="p-3">
              {/* Product Name */}
              <h3 className="font-bold text-sm mb-2 line-clamp-2 text-gray-900 h-9">
                {product.name}
              </h3>

              {/* Pricing */}
              <div className="mb-3 p-2 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-red-600">
                    ₹{product.discountPrice > 0 ? product.discountPrice?.toLocaleString() : product.price?.toLocaleString() || 'N/A'}
                  </span>
                  {product.discountPrice > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.price?.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.discountPrice > 0 && (
                  <div className="text-xs text-green-700 font-bold">
                    💰 Save ₹{(product.price - product.discountPrice)?.toLocaleString()}
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div className="text-xs mb-3">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    In Stock ({product.stock} left)
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-600 font-semibold">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                disabled={product.stock === 0}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 rounded-lg hover:from-red-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed font-bold text-sm transition-all transform hover:scale-105 disabled:hover:scale-100"
              >
                {product.stock > 0 ? '🛒 Buy Now' : 'Unavailable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visible < products.length && (
        <div className="text-center">
          <button
            onClick={() => setVisible(visible + 8)}
            className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold transition-all transform hover:scale-105"
          >
            Load More Deals 👇
          </button>
        </div>
      )}
    </div>
  );
}
