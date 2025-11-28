// src/components/admin/ProductCRUD.jsx
import { useState, useEffect } from 'react';
import { useProductStore } from '../store/productstore';
import { useCategoryStore } from '../store/categorystore';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit, Trash2, Upload, Loader2, Search, X, Check } from 'lucide-react';

export default function ProductCRUD() {
  const { products, loading, fetchProducts, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const defaultForm = {
    name: '',
    description: '',
    price: '',
    discountPrice: 0,
    stock: '',
    category_id: '',
    hasOffer: false,
    isActive: true,
    imageUrl: '',
  };

  const [form, setForm] = useState(defaultForm);

  // Load products and categories on mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // File upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setForm((prev) => ({ ...prev, imageUrl: base64 }));
      setPreviewImage(base64);
      toast.success('Image selected');
      setUploading(false);
    };
    
    reader.onerror = () => {
      toast.error('Failed to read file');
      setUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  // Form change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Save product
  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : 0,
        stock: parseInt(form.stock) || 0,
        category_id: form.category_id,
        hasOffer: form.hasOffer,
        isActive: form.isActive,
        imageUrl: form.imageUrl,
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id || editingProduct._id, productData);
        toast.success('Product updated successfully');
      } else {
        await addProduct(productData);
        toast.success('Product added successfully');
      }

      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to save product');
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      discountPrice: product.discountPrice || 0,
      stock: product.stock || 0,
      category_id: product.category_id || '',
      hasOffer: product.hasOffer || false,
      isActive: product.isActive !== false,
      imageUrl: product.imageUrl || '',
    });
    setPreviewImage(product.imageUrl ? `http://localhost:5000${product.imageUrl}` : null);
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setForm(defaultForm);
    setPreviewImage(null);
    setEditingProduct(null);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getCategoryName = (categoryId) => {
    return categories.find((c) => (c.id || c._id) === categoryId)?.name || 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Product Management</h1>
        <p className="text-gray-400">Manage your product catalog efficiently</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <span className="ml-3 text-gray-300">Loading products...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No products found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="text-left px-6 py-4 text-white font-semibold">Product</th>
                <th className="text-left px-6 py-4 text-white font-semibold">Category</th>
                <th className="text-left px-6 py-4 text-white font-semibold">Price</th>
                <th className="text-left px-6 py-4 text-white font-semibold">Stock</th>
                <th className="text-left px-6 py-4 text-white font-semibold">Offer</th>
                <th className="text-left px-6 py-4 text-white font-semibold">Status</th>
                <th className="text-center px-6 py-4 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr
                  key={product.id || product._id}
                  className={`border-b border-gray-700 hover:bg-gray-700 transition ${
                    index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'
                  }`}
                >
                  {/* Product Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.imageUrl && (
                        <img
                          src={`http://localhost:5000${product.imageUrl}`}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover bg-gray-600"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      )}
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-gray-400 text-sm">{product.description?.substring(0, 30)}...</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm font-medium">
                      {getCategoryName(product.category_id)}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">Rs. {product.price.toFixed(2)}</div>
                    {product.discountPrice > 0 && (
                      <div className="text-green-400 text-sm">-Rs. {product.discountPrice.toFixed(2)}</div>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.stock > 0
                          ? 'bg-green-900 text-green-200'
                          : 'bg-red-900 text-red-200'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>

                  {/* Offer Badge */}
                  <td className="px-6 py-4">
                    {product.hasOffer ? (
                      <span className="bg-orange-900 text-orange-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit">
                        <Check size={16} /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">No</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.isActive
                          ? 'bg-blue-900 text-blue-200'
                          : 'bg-gray-700 text-gray-300'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id || product._id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto border border-gray-700">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between border-b border-gray-700 z-10">
              <h2 className="text-2xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:bg-blue-800 p-2 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Image Upload Section */}
              <div className="bg-gray-700 rounded-lg p-4">
                <label className="block text-white font-semibold mb-3">Product Image</label>
                <div className="flex items-center gap-4">
                  {/* Preview */}
                  <div className="w-24 h-24 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="text-gray-400" size={32} />
                    )}
                  </div>

                  {/* Upload Input */}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer disabled:opacity-50"
                    />
                    <p className="text-gray-400 text-sm mt-1">JPG, PNG, WebP up to 5MB</p>
                  </div>
                </div>
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Product Name */}
                <div>
                  <label className="block text-white font-semibold mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-white font-semibold mb-2">Category *</label>
                  <select
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id || cat._id} value={cat.id || cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-white font-semibold mb-2">Price (Rs.) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Discount Price */}
                <div>
                  <label className="block text-white font-semibold mb-2">Discount (Rs.)</label>
                  <input
                    type="number"
                    name="discountPrice"
                    value={form.discountPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-white font-semibold mb-2">Stock Units</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Description - Full Width */}
              <div>
                <label className="block text-white font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="4"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition resize-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasOffer"
                    checked={form.hasOffer}
                    onChange={handleChange}
                    className="w-5 h-5 rounded bg-gray-700 border border-gray-600 cursor-pointer"
                  />
                  <span className="text-white">Has Special Offer</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="w-5 h-5 rounded bg-gray-700 border border-gray-600 cursor-pointer"
                  />
                  <span className="text-white">Active</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-700 border-t border-gray-600 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={uploading || loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2"
              >
                {uploading || loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}