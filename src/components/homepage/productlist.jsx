import { useState, useEffect } from 'react';
import { useProductStore } from '../store/productstore';
import toast from 'react-hot-toast';
import { Search, Filter, Loader2, ShoppingCart, Eye } from 'lucide-react';

export default function ProductList() {
  const { products, loading, pagination, fetchProducts } = useProductStore();
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(12);

  // Fetch products on mount and when filters change
  useEffect(() => {
    fetchProducts({ page, search: search || undefined, limit });
  }, [page, search, limit, fetchProducts]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder-product.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `http://localhost:5000${imageUrl}`;
  };

  const getDiscountPercent = (before, after) => {
    if (!before || !after) return 0;
    return Math.round(((before - after) / before) * 100);
  };

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      toast.error('Out of stock');
      return;
    }
    toast.success(`${product.name} added to cart!`);
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🛍️ Products</h1>
          <p className="text-gray-600">Browse our collection of amazing products</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="🔍 Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={6}>6 per page</option>
              <option value={12}>12 per page</option>
              <option value={24}>24 per page</option>
              <option value={48}>48 per page</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <div
                  key={product.id || product._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={getImageUrl(product.imageUrl)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />

                    {/* Discount Badge */}
                    {product.hasOffer && product.beforePrice > product.afterPrice && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        -{getDiscountPercent(product.beforePrice, product.afterPrice)}%
                      </div>
                    )}

                    {/* Stock Status */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Out of Stock</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Category & Stock */}
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {product.category_id?.substring(0, 3).toUpperCase()}
                      </span>
                      <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-bold text-sm mb-2 line-clamp-2 h-10 text-gray-900">
                      {product.name}
                    </h3>

                    {/* Description */}
                    {product.description && (
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Prices */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-blue-600">
                          ₹{product.afterPrice?.toLocaleString() || 'N/A'}
                        </span>
                        {product.beforePrice > product.afterPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.beforePrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {product.beforePrice > product.afterPrice && (
                        <p className="text-xs text-green-600 font-semibold">
                          Save ₹{(product.beforePrice - product.afterPrice)?.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium text-sm flex items-center justify-center gap-2 transition"
                      >
                        <ShoppingCart size={16} />
                        Add
                      </button>
                      <button className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 font-medium text-sm flex items-center justify-center gap-2 transition">
                        <Eye size={16} />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12 pb-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition font-medium"
                >
                  ← Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 rounded-lg font-medium transition ${
                          page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {pagination.totalPages > 5 && <span className="px-3 py-2">...</span>}
                </div>

                <button
                  onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
                  disabled={page === pagination.totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition font-medium"
                >
                  Next →
                </button>

                <div className="ml-4 text-gray-600 font-medium">
                  Page <span className="font-bold">{page}</span> of{' '}
                  <span className="font-bold">{pagination.totalPages}</span> ({pagination.total} total)
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
