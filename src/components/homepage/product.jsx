import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProductStore } from "../store/productstore";
import { Loader2, ShoppingCart, Heart, Star } from "lucide-react";
import { useCart } from "@/store/cartstore";
import { getImageUrl } from "@/config";

export default function ProductsGrid() {
  const navigate = useNavigate();
  const { products, loading, fetchProducts } = useProductStore();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Map real products to display format
  const displayProducts = (products && products.length > 0)
    ? products.slice(0, 8).map(product => ({
        id: product.id || product._id,
        name: product.name,
        imageUrl: getImageUrl(product.imageUrl, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'),
        price: product.price || 0,
        discountPrice: product.discountPrice,
        stock: product.stock || 0,
        isActive: product.isActive,
        category: product.category?.name || 'General',
      }))
    : [];

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.imageUrl,
        quantity: 1,
      });
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            <p className="text-gray-500">Loading products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link 
            to="/products" 
            className="text-teal-600 hover:text-teal-700 font-medium text-sm flex items-center gap-1"
          >
            View All
            <span>→</span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-teal-200 transition-all duration-300"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                />
                
                {/* Discount Badge */}
                {product.discountPrice && product.discountPrice < product.price && (
                  <span className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                    -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                  </span>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all">
                  <Heart className="w-4 h-4" />
                </button>

                {/* Out of Stock Overlay */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-3 py-1.5 bg-white text-gray-900 text-sm font-medium rounded">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-teal-600 font-medium mb-1">{product.category}</p>
                <h3 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="font-medium text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-teal-600 transition-colors text-sm"
                >
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                  ))}
                  <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  {product.discountPrice && product.discountPrice < product.price ? (
                    <>
                      <span className="text-lg font-bold text-gray-900">
                        Rs. {product.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        Rs. {product.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.stock === 0}
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                    product.stock > 0
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}