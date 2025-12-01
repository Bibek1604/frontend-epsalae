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
        <div className="flex justify-center px-4 mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
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
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link 
            to="/products" 
            className="flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
          >
            View All
            <span>→</span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 group rounded-xl hover:shadow-lg hover:border-teal-200"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-square bg-gray-50">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="object-cover w-full h-full transition-transform duration-500 cursor-pointer group-hover:scale-105"
                />
                
                {/* Discount Badge */}
                {product.discountPrice && product.discountPrice < product.price && (
                  <span className="absolute px-2 py-1 text-xs font-bold text-white bg-red-500 rounded top-3 left-3">
                    -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                  </span>
                )}

                {/* Wishlist Button */}
                <button className="absolute p-2 transition-all bg-white rounded-full shadow-md opacity-0 top-3 right-3 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500">
                  <Heart className="w-4 h-4" />
                </button>

                {/* Out of Stock Overlay */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="px-3 py-1.5 bg-white text-gray-900 text-sm font-medium rounded">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="mb-1 text-xs font-medium text-teal-600">{product.category}</p>
                <h3 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="mb-2 text-sm font-medium text-gray-900 transition-colors cursor-pointer line-clamp-2 hover:text-teal-600"
                >
                  {product.name}
                </h3>
                


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