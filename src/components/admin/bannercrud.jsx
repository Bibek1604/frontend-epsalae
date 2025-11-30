// src/components/admin/BannerCRUD.jsx
import { useState, useEffect } from 'react';
import { useBannerStore } from '../store/bannerstore';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Upload, Loader2, X, Eye, CheckCircle } from 'lucide-react';
import { getImageUrl } from '@/config';

export default function BannerCRUD() {
  const { banners, loading, fetchBanners, addBanner, updateBanner, deleteBanner } = useBannerStore();

  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.title?.trim()) newErrors.title = 'Title is required';
    if (!form.imageUrl) newErrors.imageUrl = 'Please upload a banner image';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setForm(prev => ({ ...prev, imageUrl: evt.target.result }));
      setUploading(false);
      toast.success('Image uploaded successfully!');
    };
    reader.onerror = () => {
      setUploading(false);
      toast.error('Failed to read image');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    try {
      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle?.trim() || '',
        imageUrl: form.imageUrl,
        isActive: form.isActive,
      };

      if (editingBanner) {
        await updateBanner(editingBanner._id || editingBanner.id, payload);
        toast.success('Banner updated!');
      } else {
        await addBanner(payload);
        toast.success('Banner created!');
      }

      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save banner');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl || '',
      isActive: banner.isActive ?? true,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (banner) => {
    if (!window.confirm(`Delete banner "${banner.title}" permanently?`)) return;
    try {
      await deleteBanner(banner._id || banner.id);
      toast.success('Banner deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBanner(null);
    setForm({ title: '', subtitle: '', imageUrl: '', isActive: true });
    setErrors({});
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 lg:p-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-6 mb-10 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#1A3C8A] mb-2">Banners</h1>
              <p className="text-[#7A7A7A]">Manage hero banners & promotional sliders</p>
            </div>
            <button
              onClick={closeModal}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
              Add New Banner
            </button>
          </div>

          {/* Loading & Empty State */}
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-16 h-16 animate-spin text-[#FF6B35]" />
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-[#EFEFEF]">
              <div className="flex items-center justify-center w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-3xl">
                <Upload className="w-16 h-16 text-[#1A3C8A]/30" />
              </div>
              <h3 className="text-2xl font-bold text-[#2E2E2E]">No banners yet</h3>
              <p className="text-[#7A7A7A] mt-2">Create your first promotional banner!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner) => (
                <div
                  key={banner._id || banner.id}
                  className="bg-white rounded-3xl shadow-xl border border-[#EFEFEF] overflow-hidden hover:shadow-2xl transition-all group"
                >
                  {/* Image */}
                  <div className="relative bg-gray-100 aspect-video">
                    <img
                      src={getImageUrl(banner.imageUrl, '/placeholder-banner.jpg')}
                      alt={banner.title}
                      className="object-cover w-full h-full"
                    />
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2
                        ${banner.isActive 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-gray-100 text-gray-600'}`}
                      >
                        {banner.isActive ? <CheckCircle className="w-5 h-5" /> : null}
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#2E2E2E] mb-2">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-[#7A7A7A] text-sm mb-4">{banner.subtitle}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 px-6 pb-6">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="flex-1 py-3 bg-[#1A3C8A] text-white rounded-xl hover:bg-[#163180] transition font-semibold"
                    >
                      <Edit2 className="inline w-5 h-5 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner)}
                      className="flex-1 py-3 font-semibold text-white transition bg-red-500 rounded-xl hover:bg-red-600"
                    >
                      <Trash2 className="inline w-5 h-5 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PREMIUM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] text-white p-8 rounded-t-3xl relative">
              <button
                onClick={closeModal}
                className="absolute p-2 transition rounded-full top-6 right-6 bg-white/20 hover:bg-white/30"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold">
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-7">
              {/* Title */}
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Banner Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Sale 2025"
                  value={form.title}
                  onChange={(e) => {
                    setForm({ ...form, title: e.target.value });
                    setErrors({ ...errors, title: '' });
                  }}
                  className={`w-full px-6 py-4 border-2 rounded-2xl transition
                    ${errors.title ? 'border-red-400' : 'border-[#EFEFEF] focus:border-[#FF6B35]'}`}
                />
                {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Subtitle (Optional)</label>
                <input
                  type="text"
                  placeholder="Up to 50% off on selected items"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Banner Image * (Recommended: 1920×600)</label>
                <div className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition
                  ${errors.imageUrl ? 'border-red-400 bg-red-50' : 'border-[#EFEFEF] hover:border-[#FF6B35] bg-gray-50'}`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${uploading ? 'animate-bounce' : ''} text-[#7A7A7A]`} />
                  <p className="text-lg font-medium text-[#2E2E2E]">
                    {uploading ? 'Uploading...' : form.imageUrl ? 'Click to replace image' : 'Click to upload or drag & drop'}
                  </p>
                  <p className="text-sm text-[#7A7A7A] mt-2">PNG, JPG up to 5MB</p>
                </div>
                {errors.imageUrl && <p className="mt-2 text-sm text-red-600">{errors.imageUrl}</p>}
              </div>

              {/* Image Preview */}
              {form.imageUrl && (
                <div className="relative overflow-hidden shadow-lg rounded-2xl">
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="object-cover w-full h-64"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, imageUrl: '' })}
                    className="absolute p-3 text-white transition bg-red-500 rounded-full shadow-lg top-4 right-4 hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Active Toggle */}
              <div className="flex items-center gap-4 py-4">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-6 h-6 text-[#FF6B35] rounded focus:ring-[#FF6B35]"
                />
                <label htmlFor="active" className="text-lg font-medium cursor-pointer">
                  Banner is Active
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 py-5 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
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