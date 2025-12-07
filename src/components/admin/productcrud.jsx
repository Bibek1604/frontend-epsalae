// src/pages/ProductCrud.jsx
import { useState, useEffect } from 'react';
import { useProductStore } from '../store/productstore';
import { useCategoryStore } from '../store/categorystore';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus, Edit2, Trash2, Upload, Loader2, Search, X,
  Package, Tag, DollarSign, CheckCircle, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { getImageUrl } from '@/config';

export default function ProductCrud() {
  const { products, loading, fetchProducts, addProduct, updateProduct, deleteProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const defaultForm = {
    name: '', description: '', price: '', discountPrice: 0,
    stock: '', category_id: '', hasOffer: false, isActive: true, imageUrl: ''
  };
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result;
      setForm(prev => ({ ...prev, imageUrl: base64 }));
      setPreviewImage(base64);
      toast.success('Image selected');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category_id) {
      return toast.error('Name, Price & Category required');
    }
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        discountPrice: parseFloat(form.discountPrice) || 0,
        stock: parseInt(form.stock) || 0,
      };
      
      const productId = editingProduct?._id || editingProduct?.id;
      console.log('💾 Saving product:', { productId, isEdit: !!productId, data });
      
      if (productId) {
        await updateProduct(productId, data);
        toast.success('Product updated!');
      } else {
        await addProduct(data);
        toast.success('Product created!');
      }
      closeModal();
      // Refresh products list to show updated data
      await fetchProducts();
    } catch (error) {
      console.error('❌ Save failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to save');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    // Get category ID from various possible fields
    const catId = product.category_id || product.categoryId || product.category?._id || product.category?.id || product.category || '';
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      discountPrice: product.discountPrice || 0,
      stock: product.stock || 0,
      category_id: catId,
      hasOffer: product.hasOffer || false,
      isActive: product.isActive !== false,
      imageUrl: product.imageUrl || '',
    });
    setPreviewImage(product.imageUrl ? getImageUrl(product.imageUrl) : null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      console.log('🗑️ Attempting to delete product:', id);
      await deleteProduct(id);
      toast.success('Product deleted');
      fetchProducts(); // Refresh the list after delete
    } catch (error) {
      console.error('❌ Delete failed:', error);
      toast.error(error?.response?.data?.message || 'Delete failed');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setForm(defaultForm);
    setPreviewImage(null);
  };

  // Helper to get category name by ID (checks both id and _id)
  const getCategoryName = (catId) => {
    if (!catId) return '—';
    const found = categories.find(c => 
      c._id === catId || c.id === catId || 
      String(c._id) === String(catId) || String(c.id) === String(catId)
    );
    return found?.name || '—';
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    getCategoryName(p.category_id || p.categoryId)?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 lg:p-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-6 mb-10 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#1A3C8A] mb-2">Products</h1>
              <p className="text-[#7A7A7A]">Manage your store inventory</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
              Add New Product
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#7A7A7A]" />
            <input
              type="text"
              placeholder="Search by product name or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white rounded-2xl shadow-lg border border-[#EFEFEF] focus:border-[#FF6B35] focus:outline-none text-lg transition"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-16 h-16 animate-spin text-[#FF6B35]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center bg-white shadow-lg rounded-3xl">
              <Package className="w-24 h-24 text-[#1A3C8A]/20 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#2E2E2E]">No products found</h3>
              <p className="text-[#7A7A7A] mt-2">Add your first product to get started!</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-[#EFEFEF] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] text-white">
                      <th className="px-6 py-5 font-bold text-left">Product</th>
                      <th className="px-6 py-5 font-bold text-left">Category</th>
                      <th className="px-6 py-5 font-bold text-center">Price</th>
                      <th className="px-6 py-5 font-bold text-center">Stock</th>
                      <th className="px-6 py-5 font-bold text-center">Offer</th>
                      <th className="px-6 py-5 font-bold text-center">Status</th>
                      <th className="px-6 py-5 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((product, i) => (
                      <tr
                        key={product._id || product.id}
                        className={`border-b border-gray-100 hover:bg-orange-50/30 transition-all ${
                          i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'
                        }`}
                      >
                        {/* Product */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="overflow-hidden border-2 border-gray-200 w-14 h-14 rounded-xl">
                              {product.imageUrl ? (
                                <img
                                  src={getImageUrl(product.imageUrl)}
                                  alt={product.name}
                                  className="object-cover w-full h-full"
                                  onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<div class="flex items-center justify-center w-full h-full bg-gray-200"><svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>' }}
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                                  <Package className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-[#2E2E2E]">{product.name}</p>
                              <p className="text-sm text-[#7A7A7A] line-clamp-1">{product.description || 'No description'}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-5">
                          <span className="px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-full">
                            {getCategoryName(product.category_id || product.categoryId || product.category?._id || product.category?.id || product.category)}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-5 text-center">
                          <div className="font-bold text-[#1A3C8A]">Rs. {product.price}</div>
                          {product.discountPrice > 0 && (
                            <div className="text-sm text-gray-500 line-through">Rs. {product.discountPrice}</div>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-5 text-center">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
                            product.stock > 0
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {product.stock > 0 ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {product.stock}
                          </span>
                        </td>

                        {/* Offer */}
                        <td className="px-6 py-5 text-center">
                          {product.hasOffer ? (
                            <span className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white rounded-full text-sm font-bold">
                              Yes
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5 text-center">
                          {product.isActive ? (
                            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full bg-emerald-100 text-emerald-700">
                              <Eye className="w-4 h-4" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-full">
                              <EyeOff className="w-4 h-4" /> Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-3 bg-[#1A3C8A] text-white rounded-xl hover:bg-[#163180] transition shadow-md"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id || product.id)}
                              className="p-3 text-white transition bg-red-500 shadow-md rounded-xl hover:bg-red-600"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SAME BEAUTIFUL MODAL AS CATEGORY PAGE */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] text-white p-8 rounded-t-3xl relative">
              <button onClick={closeModal} className="absolute p-2 transition rounded-full top-6 right-6 bg-white/20 hover:bg-white/30">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h2>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-8 space-y-7">
              {/* Same form fields as before — clean & branded */}
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Product Name *</label>
                <input required name="name" value={form.name} onChange={handleChange} placeholder="iPhone 15 Pro Max" className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition text-lg" />
              </div>
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Category *</label>
                <select required name="category_id" value={form.category_id} onChange={handleChange} className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition text-lg">
                  <option value="">Select category</option>
                  {categories.map(c => {
                    const catId = c._id || c.id;
                    return <option key={catId} value={catId}>{c.name}</option>;
                  })}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Price (Rs.) *</label>
                  <input required type="number" name="price" value={form.price} onChange={handleChange} placeholder="29999" className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition" />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Discount Price</label>
                  <input type="number" name="discountPrice" value={form.discountPrice} onChange={handleChange} placeholder="24999" className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition" />
                </div>
              </div>
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Stock Quantity</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="100" className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition" />
              </div>
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe this product..." className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] resize-none transition" />
              </div>

              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-4">Product Image</label>
                <button type="button" onClick={() => document.getElementById('file-upload').click()} disabled={uploading}
                  className="w-full py-5 bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] text-white font-bold rounded-2xl hover:shadow-xl transition flex items-center justify-center gap-3 disabled:opacity-70">
                  {uploading ? <Loader2 className="animate-spin" /> : <Upload className="w-6 h-6" />}
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {previewImage && (
                  <div className="relative mt-6 overflow-hidden shadow-lg rounded-2xl">
                    <img src={previewImage} alt="Preview" className="object-cover w-full h-64" />
                    <button type="button" onClick={() => { setPreviewImage(null); setForm(p => ({ ...p, imageUrl: '' })); }}
                      className="absolute top-3 right-3 p-2.5 bg-red-600 text-white rounded-full hover:bg-red-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-8 py-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="hasOffer" checked={form.hasOffer} onChange={handleChange} className="w-6 h-6 text-[#FF6B35] rounded" />
                  <span className="text-lg font-medium">Has Special Offer</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="w-6 h-6 text-[#1A3C8A] rounded" />
                  <span className="text-lg font-medium">Product is Active</span>
                </label>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" className="flex-1 py-5 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={closeModal} className="px-10 py-5 font-bold text-gray-700 transition border-2 border-gray-300 rounded-2xl hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}