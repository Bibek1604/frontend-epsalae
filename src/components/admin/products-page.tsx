// src/pages/admin/ProductsPage.tsx
// Admin products management page with variants support

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import useAdminApi, { Product, Category } from '@/hooks/useAdminApi';
import './products-page.css';

export const ProductsPage: React.FC = () => {
  const { loading, error, fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct } =
    useAdminApi();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: 0,
    originalPrice: 0,
    image: '',
    category: '',
    sku: '',
    stock: 0,
    rating: 0,
    isActive: true,
    isFeatured: false,
  });

  // Load products and categories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(1, 50, { category: filterCategory }),
          fetchCategories(1, 100),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } finally {
        setPageLoading(false);
      }
    };
    loadData();
  }, [fetchProducts, fetchCategories, filterCategory]);

  // Show toast
  useEffect(() => {
    if (error) {
      setToast({ type: 'error', message: error });
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['price', 'originalPrice', 'stock', 'rating'].includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateProduct(editingId, formData);
        setToast({ type: 'success', message: 'Product updated successfully' });
      } else {
        await createProduct(formData);
        setToast({ type: 'success', message: 'Product created successfully' });
      }

      // Reload products
      const data = await fetchProducts(1, 50, { category: filterCategory });
      setProducts(data);

      // Reset form
      setFormData({
        name: '',
        slug: '',
        description: '',
        shortDescription: '',
        price: 0,
        originalPrice: 0,
        image: '',
        category: '',
        sku: '',
        stock: 0,
        rating: 0,
        isActive: true,
        isFeatured: false,
      });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err) {
      setToast({
        type: 'error',
        message: editingId ? 'Failed to update product' : 'Failed to create product',
      });
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      image: product.image,
      category: product.category,
      sku: product.sku,
      stock: product.stock,
      rating: product.rating,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });
    setEditingId(product._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await deleteProduct(id);
      setToast({ type: 'success', message: 'Product deleted successfully' });
      const data = await fetchProducts(1, 50, { category: filterCategory });
      setProducts(data);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete product' });
    }
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: 0,
      originalPrice: 0,
      image: '',
      category: '',
      sku: '',
      stock: 0,
      rating: 0,
      isActive: true,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  // Filter products
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate discount percentage
  const getDiscount = (price: number, originalPrice?: number): number => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <AdminLayout currentPage="products">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Products</h1>
            <p>Manage your product inventory and details</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <Plus size={20} />
            New Product
          </button>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)}>×</button>
          </div>
        )}

        {/* Filters */}
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <span className="result-count">{filteredProducts.length} products</span>
        </div>

        {/* Loading State */}
        {pageLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            {/* Products Table */}
            <div className="table-container">
              {filteredProducts.length === 0 ? (
                <div className="empty-state">
                  <ImageIcon size={48} />
                  <p>No products found</p>
                  <button className="btn btn-primary" onClick={handleOpenModal}>
                    Create First Product
                  </button>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const discount = getDiscount(product.price, product.originalPrice);
                      return (
                        <tr key={product._id}>
                          <td>
                            <div className="cell-content">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="cell-image"
                                />
                              )}
                              <div className="product-info">
                                <strong>{product.name}</strong>
                                {discount > 0 && <span className="discount-badge">-{discount}%</span>}
                              </div>
                            </div>
                          </td>
                          <td>
                            <code>{product.sku}</code>
                          </td>
                          <td>
                            {categories.find((c) => c._id === product.category)?.name || 'N/A'}
                          </td>
                          <td>
                            <div className="price-cell">
                              <span className="current-price">${product.price.toFixed(2)}</span>
                              {product.originalPrice && (
                                <span className="original-price">
                                  ${product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                          </td>
                          <td>
                            <span className="rating">⭐ {product.rating.toFixed(1)}</span>
                          </td>
                          <td>
                            <span className={`badge ${product.isActive ? 'active' : 'inactive'}`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="actions">
                              <button
                                className="action-btn edit"
                                onClick={() => handleEdit(product)}
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                className="action-btn delete"
                                onClick={() => handleDelete(product._id)}
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingId ? 'Edit Product' : 'Create Product'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="form-section">
                  <h4>Basic Information</h4>

                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Wireless Headphones Pro"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Slug *</label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        placeholder="e.g., wireless-headphones-pro"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>SKU *</label>
                      <input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="e.g., WHP-001"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Short Description</label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      placeholder="Brief description for listings"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed product description"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="form-section">
                  <h4>Pricing & Inventory</h4>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Price *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Original Price</label>
                      <input
                        type="number"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label>Stock *</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Media */}
                <div className="form-section">
                  <h4>Category & Media</h4>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Product Image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Rating & Status */}
                <div className="form-section">
                  <h4>Rating & Status</h4>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Rating (0-5)</label>
                      <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                        min="0"
                        max="5"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="form-group checkbox">
                    <label>
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleCheckboxChange}
                      />
                      Active
                    </label>
                  </div>

                  <div className="form-group checkbox">
                    <label>
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleCheckboxChange}
                      />
                      Featured Product
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Processing...' : editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
