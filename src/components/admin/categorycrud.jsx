// src/pages/CategoryCrud.jsx
import { useState, useEffect } from 'react';
import { useCategoryStore } from '../store/categorystore';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus, Edit2, Trash2, Search, Upload, X, Loader2,
  Tag, Image as ImageIcon, CheckCircle, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { openCloudinaryWidget } from '../../utils/cloudinary';
import { getImageUrl } from '@/config';

export default function CategoryCrud() {
  const { categories, loading, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: null,
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto-generate slug from name
  const handleNameChange = (name) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setForm(prev => ({ ...prev, name, slug }));
  };

  // Cloudinary Upload
  const openUploadWidget = () => {
    setUploading(true);
    openCloudinaryWidget(
      {
        cloudName: 'dycex9eui',
        uploadPreset: 'epasaley-categories',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 1,
        showSkipCropButton: false,
        styles: {
          palette: {
            window: "#ffffff",
            sourceBg: "#f8f8f8",
            windowBorder: "#FF6B35",
            tabIcon: "#FF6B35",
            inactiveTabIcon: "#555",
            link: "#FF6B35",
            action: "#FF6B35"
          }
        }
      },
      (error, result) => {
        setUploading(false);
        if (!error && result?.event === 'success') {
          setForm(prev => ({ ...prev, imageUrl: result.info.secure_url }));
          toast.success('Image uploaded!');
        }
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Category name is required');
    if (!form.description.trim()) return toast.error('Description is required');
    if (!form.imageUrl) return toast.error('Please upload an image');

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl,
      isActive: form.isActive,
    };

    try {
      if (editingCat?._id) {
        await updateCategory(editingCat._id, payload);
        toast.success('Category updated successfully!');
      } else {
        await addCategory(payload);
        toast.success('Category created successfully!');
      }
      closeModal();
      fetchCategories();
    } catch {
      toast.error('Failed to save category');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCat(null);
    setForm({ name: '', slug: '', description: '', imageUrl: null, isActive: true });
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      imageUrl: cat.imageUrl || null,
      isActive: cat.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}" permanently?`)) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = categories.filter(cat =>
    cat.name?.toLowerCase().includes(search.toLowerCase()) ||
    cat.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 lg:p-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-6 mb-10 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#1A3C8A] mb-2">Categories</h1>
              <p className="text-[#7A7A7A]">Organize your products with beautiful categories</p>
            </div>
            <button
              onClick={() => {
                setEditingCat(null);
                setForm({ name: '', slug: '', description: '', imageUrl: null, isActive: true });
                setShowModal(true);
              }}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
              Add New Category
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#7A7A7A]" />
            <input
              type="text"
              placeholder="Search by name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white rounded-2xl shadow-lg border border-[#EFEFEF] focus:border-[#FF6B35] focus:outline-none text-lg transition"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-16 h-16 animate-spin text-[#FF6B35]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg border border-[#EFEFEF]">
              <div className="flex items-center justify-center w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-2xl">
                <Tag className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-[#2E2E2E]">No categories found</h3>
              <p className="text-[#7A7A7A] mt-2">Create your first category to organize products</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-[#EFEFEF] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] text-white">
                      <th className="px-8 py-6 font-bold text-left">Category</th>
                      <th className="px-8 py-6 font-bold text-left">Slug</th>
                      <th className="px-8 py-6 font-bold text-center">Products</th>
                      <th className="px-8 py-6 font-bold text-center">Status</th>
                      <th className="px-8 py-6 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((cat, i) => (
                      <tr
                        key={cat._id}
                        className={`border-b border-gray-100 hover:bg-orange-50/40 transition-all ${
                          i % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                        }`}
                      >
                        {/* Category Info */}
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 overflow-hidden border-2 border-gray-200 shadow-md rounded-xl">
                              {cat.imageUrl ? (
                                <img
                                  src={getImageUrl(cat.imageUrl)}
                                  alt={cat.name}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                                  <ImageIcon className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-[#2E2E2E] text-lg">{cat.name}</p>
                              <p className="text-sm text-[#7A7A7A]">{cat.description || 'No description'}</p>
                            </div>
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="px-8 py-6">
                          <code className="px-4 py-2 font-mono text-sm text-gray-700 bg-gray-100 rounded-lg">
                            /{cat.slug}
                          </code>
                        </td>

                        {/* Product Count (you can pass count from backend later) */}
                        <td className="px-8 py-6 text-center">
                          <span className="px-4 py-2 text-sm font-bold text-blue-700 bg-blue-100 rounded-full">
                            24 Products
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-8 py-6 text-center">
                          {cat.isActive ? (
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-100 text-emerald-700 rounded-full font-bold">
                              <Eye className="w-5 h-5" /> Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 rounded-full">
                              <EyeOff className="w-5 h-5" /> Inactive
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-8 py-6">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => handleEdit(cat)}
                              className="p-3.5 bg-[#1A3C8A] text-white rounded-xl hover:bg-[#163180] transition shadow-lg"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(cat._id, cat.name)}
                              className="p-3.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition shadow-lg"
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

      {/* PREMIUM MODAL — Same as Product Page */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] text-white p-8 rounded-t-3xl relative">
              <button
                onClick={closeModal}
                className="absolute p-2 transition rounded-full top-6 right-6 bg-white/20 hover:bg-white/30"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold">
                {editingCat ? 'Edit Category' : 'Create New Category'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Name */}
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Category Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Fashion, Electronics, Home & Living"
                  className="w-full px-6 py-5 text-lg border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] focus:outline-none transition"
                />
              </div>

              {/* Auto Slug */}
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Slug (Auto-generated)</label>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">yourstore.com/</span>
                  <input
                    readOnly
                    value={form.slug}
                    placeholder="fashion"
                    className="flex-1 px-6 py-4 text-gray-600 cursor-not-allowed bg-gray-50 rounded-xl"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Description *</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Brief description for SEO and display..."
                  className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] resize-none transition"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-4">Category Image (1:1) *</label>
                {!form.imageUrl ? (
                  <button
                    type="button"
                    onClick={openUploadWidget}
                    disabled={uploading}
                    className="w-full py-6 bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] text-white font-bold rounded-2xl hover:shadow-2xl transition flex items-center justify-center gap-4 disabled:opacity-70"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-7 h-7 animate-spin" />
                        Uploading Image...
                      </>
                    ) : (
                      <>
                        <Upload className="w-7 h-7" />
                        Upload Category Image
                      </>
                    )}
                  </button>
                ) : (
                  <div className="relative overflow-hidden border-2 border-gray-300 border-dashed shadow-xl rounded-2xl">
                    <img
                      src={getImageUrl(form.imageUrl)}
                      alt="Category"
                      className="object-cover w-full h-80"
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition opacity-0 bg-black/40 hover:opacity-100">
                      <button
                        type="button"
                        onClick={openUploadWidget}
                        className="px-8 py-4 bg-white text-[#1A3C8A] font-bold rounded-xl hover:bg-gray-100 transition"
                      >
                        Change Image
                      </button>
                    </div>
                    <button
                      onClick={() => setForm(prev => ({ ...prev, imageUrl: null }))}
                      className="absolute p-3 text-white bg-red-600 rounded-full top-4 right-4 hover:bg-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Status Toggle */}
              <div className="flex items-center gap-4 py-4">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.isActive}
                  onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-6 h-6 text-[#FF6B35] rounded focus:ring-[#FF6B35]"
                />
                <label htmlFor="active" className="text-lg font-medium cursor-pointer">
                  Category is Active (Visible on site)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-5 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-70"
                >
                  {editingCat ? 'Update Category' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-10 py-5 font-bold text-gray-700 transition border-2 border-gray-300 rounded-2xl hover:bg-gray-50"
                >
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