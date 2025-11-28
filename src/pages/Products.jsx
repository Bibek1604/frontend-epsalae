import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Grid, LayoutGrid, X, ChevronDown, ChevronUp, ShoppingCart, Loader2, Heart, Check, ChevronRight } from 'lucide-react';
import { useProductStore } from '../components/store/productstore';
import { useCategoryStore } from '../components/store/categorystore';
import { useCart } from '../store/cartstore';
import { getImageUrl as getImage } from '@/config';

export default function Products() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { products, loading, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { addToCart } = useCart();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 300000]);
  const [viewMode, setViewMode] = useState('grid');
  const [brandSearch, setBrandSearch] = useState('');
  
  // Filter panel states
  const [showBrand, setShowBrand] = useState(true);
  const [showPrice, setShowPrice] = useState(true);




  // Fetch data on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...(products || [])];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(product => {
        const productCategoryId = product.category?.id || product.category?._id || product.categoryId || product.category;
        return productCategoryId === selectedCategory || product.category?.name === selectedCategory;
      });
    }

    // Filter by price range
    result = result.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case 'name':
        result.sort((a, b) => a.name?.localeCompare(b.name));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'popular':
      default:
        // Keep original order for popular
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart({
        id: product.id || product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.imageUrl,
        quantity: 1,
      });
    }
  };

  const getImageUrl = (imageUrl) => {
    return getImage(imageUrl, 'https://via.placeholder.com/400x400?text=No+Image');
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  // Filter categories based on brand search
  const filteredCategories = categories.filter(cat =>
    cat.name?.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-4">
          <button onClick={() => navigate('/')} className="text-teal-600 hover:text-teal-700">Home</button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {selectedCategory !== 'all' 
              ? categories.find(c => (c.id || c._id) === selectedCategory)?.name || 'Products'
              : 'All Products'
            }
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} for {selectedCategory !== 'all' 
            ? categories.find(c => (c.id || c._id) === selectedCategory)?.name || 'products'
            : 'all products'
          }
        </h1>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                  Advanced
                </button>
              </div>

              {/* Brand/Category Filter */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <button 
                  onClick={() => setShowBrand(!showBrand)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-semibold text-gray-900">Brand</span>
                  {showBrand ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {showBrand && (
                  <div className="mt-4 space-y-3">
                    {/* Search Brand */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search brand ..."
                        value={brandSearch}
                        onChange={(e) => setBrandSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                      />
                    </div>
                    
                    {/* Brand List */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {filteredCategories.map((category) => {
                        const isSelected = selectedCategory === (category.id || category._id);
                        const productCount = products.filter(p => {
                          const catId = p.category?.id || p.category?._id || p.categoryId || p.category;
                          return catId === (category.id || category._id);
                        }).length;
                        
                        return (
                          <button
                            key={category.id || category._id}
                            onClick={() => setSelectedCategory(isSelected ? 'all' : (category.id || category._id))}
                            className="flex items-center justify-between w-full py-1.5 text-left group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500">
                                {category.name?.charAt(0)}
                              </div>
                              <span className={`text-sm ${isSelected ? 'text-teal-600 font-medium' : 'text-gray-700'}`}>
                                {category.name}
                              </span>
                              <span className="text-xs text-gray-400">{productCount}</span>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="border-b border-gray-200 pb-6 mb-6">
                <button 
                  onClick={() => setShowPrice(!showPrice)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-semibold text-gray-900">Price</span>
                  {showPrice ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                
                {showPrice && (
                  <div className="mt-4">
                    {/* Price Range Slider */}
                    <div className="relative pt-6 pb-2">
                      <div className="relative h-2 bg-gray-200 rounded-full">
                        <div 
                          className="absolute h-2 bg-teal-500 rounded-full"
                          style={{
                            left: `${(priceRange[0] / 300000) * 100}%`,
                            right: `${100 - (priceRange[1] / 300000) * 100}%`
                          }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="300000"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="absolute w-full h-2 opacity-0 cursor-pointer top-6"
                      />
                      <input
                        type="range"
                        min="0"
                        max="300000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="absolute w-full h-2 opacity-0 cursor-pointer top-6"
                      />
                    </div>
                    
                    {/* Price Labels */}
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Rs. {priceRange[0].toLocaleString()}</span>
                      <span>Rs. {priceRange[1].toLocaleString()}</span>
                    </div>
                    
                    {/* Price Inputs */}
                    <div className="flex items-center gap-2 mt-4">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-teal-500"
                      />
                      <span className="text-gray-400">—</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                )}
              </div>




            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              {/* View Toggle */}
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-teal-100 text-teal-600' : 'hover:bg-gray-50'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-teal-500 bg-white cursor-pointer"
                  >
                    <option value="popular">Popular</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A-Z</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              </div>
            ) : filteredProducts.length === 0 ? (
              /* No Results */
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
              </div>
            ) : (
              /* Products Grid */
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id || product._id}
                    className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:border-teal-100 transition-all duration-300 group"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
                      <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        onClick={() => navigate(`/product/${product.id || product._id}`)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      />
                      
                      {/* New Arrival Badge */}
                      <span className="absolute top-3 left-3 px-2 py-1 bg-teal-600 text-white text-xs font-medium rounded">
                        • New Arrival
                      </span>

                      {/* Wishlist Button */}
                      <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 transition-all">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Brand/Category */}
                      <p className="text-xs text-gray-500 mb-1">
                        {product.category?.name || 'Brand'}
                      </p>
                      
                      {/* Product Name */}
                      <h3 
                        onClick={() => navigate(`/product/${product.id || product._id}`)}
                        className="font-medium text-gray-900 mb-2 cursor-pointer hover:text-teal-600 transition-colors line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      {/* Price & Stock */}
                      <div className="flex items-center justify-between">
                        <span className="text-teal-600 font-semibold">
                          Rs. {(product.discountPrice || product.price)?.toLocaleString()}
                        </span>
                        {product.stock > 0 && (
                          <span className="text-xs text-red-500">
                            {product.stock < 20 ? `${product.stock} items left!` : 'In Stock'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
