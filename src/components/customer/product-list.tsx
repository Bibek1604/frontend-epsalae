// src/components/ProductList/ProductList.tsx
// Customer-facing product listing with add to cart

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import './ProductList.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  variants: ProductVariant[];
  category: string;
}

interface ProductVariant {
  _id: string;
  sku: string;
  name: string;
  attributes: Record<string, string>;
  price: number;
}

interface ProductListProps {
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onAddToWishlist?: (productId: string) => void;
  isLoading?: boolean;
}

export const ProductList: React.FC<ProductListProps> = ({
  onAddToCart,
  onAddToWishlist,
  isLoading = false,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Mock products - replace with API call
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        _id: '507f1f77bcf86cd799439011',
        name: 'Wireless Headphones Pro',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
        price: 199.99,
        originalPrice: 249.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        rating: 4.8,
        reviews: 234,
        inStock: true,
        category: 'Electronics',
        variants: [
          {
            _id: '507f1f77bcf86cd799439012',
            sku: 'WHP-BLK-01',
            name: 'Black',
            attributes: { color: 'Black' },
            price: 199.99,
          },
          {
            _id: '507f1f77bcf86cd799439013',
            sku: 'WHP-SLV-01',
            name: 'Silver',
            attributes: { color: 'Silver' },
            price: 199.99,
          },
          {
            _id: '507f1f77bcf86cd799439014',
            sku: 'WHP-GLD-01',
            name: 'Gold',
            attributes: { color: 'Gold' },
            price: 219.99,
          },
        ],
      },
      {
        _id: '507f1f77bcf86cd799439021',
        name: 'Ultra-Soft Cotton T-Shirt',
        description: '100% organic cotton t-shirt, perfect for everyday wear',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        rating: 4.5,
        reviews: 456,
        inStock: true,
        category: 'Clothing',
        variants: [
          {
            _id: '507f1f77bcf86cd799439022',
            sku: 'TSH-BLK-S',
            name: 'Black - Small',
            attributes: { color: 'Black', size: 'S' },
            price: 29.99,
          },
          {
            _id: '507f1f77bcf86cd799439023',
            sku: 'TSH-BLK-M',
            name: 'Black - Medium',
            attributes: { color: 'Black', size: 'M' },
            price: 29.99,
          },
          {
            _id: '507f1f77bcf86cd799439024',
            sku: 'TSH-BLU-M',
            name: 'Blue - Medium',
            attributes: { color: 'Blue', size: 'M' },
            price: 29.99,
          },
        ],
      },
      {
        _id: '507f1f77bcf86cd799439031',
        name: 'Stainless Steel Water Bottle',
        description: 'Keeps drinks cold for 24 hours or hot for 12 hours',
        price: 34.99,
        originalPrice: 44.99,
        image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500',
        rating: 4.7,
        reviews: 189,
        inStock: true,
        category: 'Sports',
        variants: [
          {
            _id: '507f1f77bcf86cd799439032',
            sku: 'WB-750-BK',
            name: '750ml - Black',
            attributes: { capacity: '750ml', color: 'Black' },
            price: 34.99,
          },
          {
            _id: '507f1f77bcf86cd799439033',
            sku: 'WB-1L-BK',
            name: '1L - Black',
            attributes: { capacity: '1L', color: 'Black' },
            price: 39.99,
          },
        ],
      },
      {
        _id: '507f1f77bcf86cd799439041',
        name: 'Portable Charger 20000mAh',
        description: 'Fast charging power bank with dual USB ports',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
        rating: 4.6,
        reviews: 312,
        inStock: true,
        category: 'Electronics',
        variants: [
          {
            _id: '507f1f77bcf86cd799439042',
            sku: 'PB-20K-01',
            name: 'Standard',
            attributes: { capacity: '20000mAh' },
            price: 49.99,
          },
        ],
      },
    ];

    setProducts(mockProducts);

    // Initialize quantities
    const initialQuantities: Record<string, number> = {};
    mockProducts.forEach((product) => {
      initialQuantities[product._id] = 1;
    });
    setQuantities(initialQuantities);

    // Initialize selected variants (first variant for each product)
    const initialVariants: Record<string, string> = {};
    mockProducts.forEach((product) => {
      if (product.variants.length > 0) {
        initialVariants[product._id] = product.variants[0]._id;
      }
    });
    setSelectedVariants(initialVariants);
  }, []);

  const handleAddToCart = (product: Product) => {
    const variantId = selectedVariants[product._id];
    const variant = product.variants.find((v) => v._id === variantId);
    const quantity = quantities[product._id];

    if (variant) {
      onAddToCart(product, variant, quantity);
      // Reset quantity
      setQuantities((prev) => ({
        ...prev,
        [product._id]: 1,
      }));
    }
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
    onAddToWishlist?.(productId);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = filter === 'all' || product.category === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', ...new Set(products.map((p) => p.category))];

  return (
    <div className="product-list-container">
      {/* Header */}
      <div className="product-list-header">
        <h1>🛍️ Shop Our Collection</h1>
        <p>Discover our carefully curated selection of premium products</p>
      </div>

      {/* Filters */}
      <div className="product-filters">
        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="results-count">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state">
          <p>No products found</p>
          <button onClick={() => { setSearchTerm(''); setFilter('all'); }} className="btn-reset">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const selectedVariantId = selectedVariants[product._id];
            const selectedVariant = product.variants.find((v) => v._id === selectedVariantId);
            const isWishlisted = wishlist.has(product._id);
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <div key={product._id} className="product-card">
                {/* Image Section */}
                <div className="product-image-section">
                  <img src={product.image} alt={product.name} className="product-image" />

                  {/* Wishlist Button */}
                  <button
                    className={`wishlist-btn ${isWishlisted ? 'wishlisted' : ''}`}
                    onClick={() => toggleWishlist(product._id)}
                    title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                  </button>

                  {/* Discount Badge */}
                  {discount > 0 && <div className="discount-badge">-{discount}%</div>}

                  {/* Stock Status */}
                  <div className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                  </div>
                </div>

                {/* Product Info */}
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>

                  {/* Rating */}
                  <div className="product-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(product.rating) ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                    </div>
                    <span className="rating-text">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="product-price">
                    <span className="current-price">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Variants */}
                  {product.variants.length > 1 && (
                    <div className="product-variants">
                      <label className="variant-label">
                        {Object.keys(product.variants[0].attributes)[0].charAt(0).toUpperCase() +
                          Object.keys(product.variants[0].attributes)[0].slice(1)}
                        :
                      </label>
                      <select
                        value={selectedVariantId || ''}
                        onChange={(e) =>
                          setSelectedVariants((prev) => ({
                            ...prev,
                            [product._id]: e.target.value,
                          }))
                        }
                        className="variant-select"
                      >
                        {product.variants.map((variant) => (
                          <option key={variant._id} value={variant._id}>
                            {variant.name} - ${variant.price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="product-quantity">
                    <label>Quantity:</label>
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [product._id]: Math.max(1, prev[product._id] - 1),
                          }))
                        }
                        className="qty-btn"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={quantities[product._id]}
                        onChange={(e) =>
                          setQuantities((prev) => ({
                            ...prev,
                            [product._id]: Math.max(1, parseInt(e.target.value) || 1),
                          }))
                        }
                        className="qty-input"
                      />
                      <button
                        onClick={() =>
                          setQuantities((prev) => ({
                            ...prev,
                            [product._id]: prev[product._id] + 1,
                          }))
                        }
                        className="qty-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                >
                  <ShoppingCart size={18} />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
