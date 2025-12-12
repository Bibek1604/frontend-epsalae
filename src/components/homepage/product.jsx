import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProductStore } from "../store/productstore";
import { useCategoryStore } from "../store/categorystore";
import { Loader2, ShoppingCart, Heart, Star, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "@/store/cartstore";
import { getImageUrl } from "@/config";
import { formatProductName } from "@/lib/utils";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

// Placeholder for failed images - Generic product placeholder
const PLACEHOLDER = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600';

// Image component with error handling and loading state
function ProductImage({ src, alt, className, onClick }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 shimmer" />
      )}
      <img
        src={hasError ? PLACEHOLDER : imgSrc}
        alt={alt}
        onClick={onClick}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setImgSrc(PLACEHOLDER);
          setIsLoading(false);
        }}
      />
    </div>
  );
}

export default function ProductsGrid() {
  const navigate = useNavigate();
  const { products, loading, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Get category name helper
  const getCategoryName = (product) => {
    // If category is populated as object with name
    if (product.category?.name) return product.category.name;
    
    // Get category ID from various possible fields
    const catId = product.category_id || product.categoryId || product.category?._id || product.category?.id || product.category;
    
    if (!catId) return 'General';
    
    // Find category by ID (check both id and _id)
    const foundCat = categories.find(c => 
      c._id === catId || c.id === catId || 
      String(c._id) === String(catId) || String(c.id) === String(catId)
    );
    
    return foundCat?.name || 'General';
  };

  // Limit products shown on homepage
  const PRODUCTS_LIMIT = 12;
  const totalProducts = products?.length || 0;
  const hasMoreProducts = totalProducts > PRODUCTS_LIMIT;
  
  // Map products to display format - limited to homepage display
  const displayProducts = (products && products.length > 0)
    ? products
        .slice(0, PRODUCTS_LIMIT)
        .map(product => ({
          id: product.id || product._id,
          name: product.name,
          imageUrl: getImageUrl(product.imageUrl, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'),
          price: product.price || 0,
          discountPrice: product.discountPrice,
          stock: product.stock || 0,
          isActive: product.isActive,
          category: getCategoryName(product),
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
    } else {
      toast.error('This product is out of stock', { icon: '❌' });
    }
  };

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="flex justify-center px-4 mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-[#FF6B35] animate-spin" />
              <Sparkles className="absolute w-5 h-5 text-[#1A3C8A] -top-1 -right-1 animate-pulse" />
            </div>
            <p className="text-lg text-gray-600">Loading amazing products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6">
        {/* Section Header - Enhanced */}
        <div className="flex flex-col items-center justify-between gap-4 mb-12 md:flex-row">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-3 text-sm font-semibold text-[#FF6B35] bg-orange-50 rounded-full"
            >
              <Sparkles className="w-4 h-4" />
              Curated Collection
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 md:text-4xl"
            >
              Featured Products
            </motion.h2>
          </div>
          <Link 
            to="/products" 
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all rounded-full shadow-lg bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] hover:shadow-xl hover:scale-105 btn-press"
          >
            View All {totalProducts > PRODUCTS_LIMIT ? `${totalProducts}+ ` : ''}Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Products Grid - Animated */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6"
        >
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={cardVariants}
              className="overflow-hidden transition-all duration-500 bg-white border border-gray-100 shadow-sm group rounded-2xl hover:shadow-xl hover:border-transparent hover-lift card-shine"
            >
              {/* Image Container */}
              <div className="relative overflow-hidden aspect-square bg-white">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="object-contain w-full h-full p-2 transition-transform duration-700 cursor-pointer group-hover:scale-105"
                />
                
                {/* Discount Badge - Enhanced */}
                {product.discountPrice && product.discountPrice < product.price && (
                  <motion.span 
                    initial={{ scale: 0, rotate: -12 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg top-3 left-3 shadow-lg"
                  >
                    -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </motion.span>
                )}

                {/* Wishlist Button - Enhanced */}
                <button className="absolute p-2.5 transition-all bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 top-3 right-3 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 hover:scale-110">
                  <Heart className="w-5 h-5" />
                </button>

                {/* Quick View Overlay */}
                <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/20 group-hover:opacity-100">
                  <button 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="px-6 py-2 text-sm font-semibold text-gray-900 transition-transform bg-white rounded-full shadow-lg hover:scale-105"
                  >
                    Quick View
                  </button>
                </div>

                {/* Out of Stock Overlay */}
                {product.stock === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <span className="px-4 py-2 text-sm font-bold text-white bg-gray-900 rounded-full">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Content - Enhanced */}
              <div className="p-4">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[#FF6B35]">{product.category}</p>
                <h3 
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="mb-3 font-semibold text-gray-900 transition-colors cursor-pointer line-clamp-2 hover:text-[#1A3C8A]"
                >
                  {formatProductName(product.name)}
                </h3>

                {/* Price - Enhanced */}
                <div className="flex items-baseline gap-2 mb-4">
                  {product.discountPrice && product.discountPrice < product.price ? (
                    <>
                      <span className="text-xl font-bold text-gray-900">
                        Rs. {product.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        Rs. {product.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-gray-900">
                      Rs. {product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button - Enhanced */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.stock === 0}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all btn-press ${
                    product.stock > 0
                      ? 'bg-gradient-to-r from-[#1A3C8A] to-[#2d4ea8] text-white hover:shadow-lg hover:shadow-blue-500/25'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}