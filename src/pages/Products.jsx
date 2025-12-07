// src/pages/Products.jsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import {
  Grid3x3, List, Filter, ShoppingCart, Heart, Zap,
  ChevronRight, Sparkles, Loader2, X
} from 'lucide-react';
import { useProductStore } from '../components/store/productstore';
import { useCategoryStore } from '../components/store/categorystore';
import { useCart } from '../store/cartstore';
import { getImageUrl as getImage } from '@/config';
import toast from 'react-hot-toast';

// Fallback image for failed loads
const PRODUCT_PLACEHOLDER = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600';

// Image component with error handling
function ProductImg({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgSrc(PRODUCT_PLACEHOLDER)}
    />
  );
}

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { addToCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    setSearchParams(params);
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    let result = products ? [...products] : [];

    // Filter by selected category (if not 'all')
    if (selectedCategory !== 'all') {
      result = result.filter(p => {
        const catId = p.category_id || p.categoryId || p.category?._id || p.category?.id || p.category;
        return catId === selectedCategory || String(catId) === String(selectedCategory);
      });
    }

    result = result.filter(p => {
      const price = p.discountPrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (sortBy === 'price-low') result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    if (sortBy === 'price-high') result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [products, selectedCategory, priceRange, sortBy]);

  const popularProducts = [...filteredProducts]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 10);

  // Helper to get category name for a product
  const getCategoryName = (product) => {
    if (product.category?.name) return product.category.name;
    const catId = product.category_id || product.categoryId || product.category?._id || product.category?.id || product.category;
    if (!catId) return 'General';
    const foundCat = categories.find(c => 
      c._id === catId || c.id === catId || 
      String(c._id) === String(catId) || String(c.id) === String(catId)
    );
    return foundCat?.name || 'General';
  };

  // Helper to count products in a category
  const getProductCountForCategory = (categoryId) => {
    return products?.filter(p => {
      const catId = p.category_id || p.categoryId || p.category?._id || p.category?.id || p.category;
      return catId === categoryId || String(catId) === String(categoryId);
    }).length || 0;
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (product.stock <= 0) return toast.error('Out of stock', { icon: '❌' });
    addToCart({
      id: product.id || product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.imageUrl,
      quantity: 1
    });
  };

  const currentCategoryName = selectedCategory === 'all'
    ? 'All Products'
    : categories.find(c => (c.id || c._id) === selectedCategory)?.name || 'Collection';

  return (
    <MotionConfig transition={{ duration: 0.4, ease: "easeOut" }}>
      <div className="min-h-screen bg-gray-50">

        {/* Clean Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-6 py-10 mx-auto max-w-7xl">
            <nav className="mb-6 text-sm text-gray-500">
              <button onClick={() => navigate('/')} className="hover:text-gray-900">Home</button>
              <ChevronRight className="inline w-4 h-4 mx-2" />
              <span className="font-medium text-gray-900">{currentCategoryName}</span>
            </nav>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-5xl font-light tracking-tight text-gray-900 lg:text-6xl">
                  {currentCategoryName}
                </h1>
                <p className="mt-4 text-xl text-gray-600">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-3 px-8 py-4 font-medium text-gray-700 transition border border-gray-300 rounded-full lg:hidden hover:bg-gray-50"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
        </header>



        <div className="px-6 py-12 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-4">

            {/* Sticky Filters - Floating, No Card */}
            <aside className="hidden lg:block">
              <div className="sticky space-y-12 top-8">
                {/* Categories */}
                <div>
                  <h3 className="mb-6 text-sm font-semibold tracking-wider text-gray-500 uppercase">Category</h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`block w-full text-left py-3 px-4 rounded-lg font-medium transition ${
                        selectedCategory === 'all'
                          ? 'bg-gray-900 text-white'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map(cat => {
                      const catId = cat.id || cat._id;
                      const count = getProductCountForCategory(catId);
                      const active = selectedCategory === catId || String(selectedCategory) === String(catId);
                      return (
                        <button
                          key={catId}
                          onClick={() => setSelectedCategory(catId)}
                          className={`block w-full text-left py-3 px-4 rounded-lg font-medium transition ${
                            active ? 'bg-gray-900 text-white' : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {cat.name} <span className="text-gray-400">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="mb-6 text-sm font-semibold tracking-wider text-gray-500 uppercase">Price Range</h3>
                  <input
                    type="range"
                    min="0"
                    max="300000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                    className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-900"
                  />
                  <div className="flex justify-between mt-4 text-sm font-medium text-gray-700">
                    <span>₹0</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between pb-6 mb-12 border-b border-gray-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-lg transition ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-lg transition ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-6 py-3 font-medium text-gray-700 transition border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="flex justify-center py-32">
                  <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-32 text-center">
                  <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 border-2 border-dashed rounded-xl" />
                  <h3 className="text-2xl font-medium text-gray-900">No products found</h3>
                  <p className="mt-2 text-gray-500">Try adjusting your filters</p>
                </div>
              ) : (
                <div className={`grid gap-12 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {filteredProducts.map((product) => (
                    <motion.article
                      key={product.id || product._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ y: -16 }}
                      onClick={() => navigate(`/product/${product.id || product._id}`)}
                      className="cursor-pointer group"
                    >
                      <div className="overflow-hidden transition bg-white border border-gray-200 rounded-2xl hover:border-gray-300">
                        <div className="relative overflow-hidden aspect-square bg-gray-50">
                          <ProductImg
                            src={getImage(product.imageUrl)}
                            alt={product.name}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                          />
                          {product.stock < 20 && product.stock > 0 && (
                            <div className="absolute px-3 py-1 text-xs font-semibold text-white bg-gray-900 rounded-full top-4 left-4">
                              Only {product.stock} left
                            </div>
                          )}
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="absolute p-4 transition bg-white rounded-full shadow-lg opacity-0 bottom-4 right-4 group-hover:opacity-100 opacity"
                          >
                            <ShoppingCart className="w-6 h-6 text-gray-900" />
                          </button>
                        </div>

                        <div className="p-8">
                          <p className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                            {getCategoryName(product)}
                          </p>
                          <h3 className="mt-3 text-xl font-medium text-gray-900 transition group-hover:text-gray-700 line-clamp-2" title={product.name}>
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between mt-6">
                            <div>
                              {product.discountPrice ? (
                                <>
                                  <span className="text-2xl font-light text-gray-900">
                                    ₹{product.discountPrice.toLocaleString()}
                                  </span>
                                  <span className="ml-4 text-lg text-gray-400 line-through">
                                    ₹{product.price.toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <span className="text-2xl font-light text-gray-900">
                                  ₹{product.price.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <span className={`px-4 py-2 text-xs font-semibold rounded-full ${
                              product.stock > 0 ? 'bg-gray-100 text-gray-700' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {product.stock > 0 ? 'In Stock' : 'Sold Out'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filters Sheet */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-0 left-0 right-0 p-8 bg-white rounded-t-3xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-medium">Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)}>
                    <X className="w-8 h-8 text-gray-600" />
                  </button>
                </div>
                {/* Same filter UI as desktop */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}