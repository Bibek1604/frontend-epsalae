// src/components/admin/bannercrud.jsx
import { useState, useEffect } from 'react';
import { useBannerStore } from '../store/bannerstore';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit, Trash2, Upload, Loader2, X } from 'lucide-react';

export default function BannerCRUD() {
  const { banners, loading, fetchBanners, addBanner, updateBanner, deleteBanner } = useBannerStore();
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', subtitle: '', imageUrl: '', isActive: true });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBanners();
  }, []);

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
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setForm(prev => ({ ...prev, imageUrl: evt.target.result }));
      setUploading(false);
      toast.success('Image selected!');
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
        subtitle: form.subtitle.trim(),
        imageUrl: form.imageUrl,
        isActive: form.isActive,
      };

      if (editingBanner) {
        await updateBanner(editingBanner.id || editingBanner._id, payload);
        toast.success('Banner updated!');
      } else {
        await addBanner(payload);
        toast.success('Banner created!');
      }

      setShowModal(false);
      setEditingBanner(null);
      setForm({ title: '', subtitle: '', imageUrl: '', isActive: true });
      setErrors({});
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
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (banner) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      await deleteBanner(banner.id || banner._id);
      toast.success('Banner deleted!');
    } catch (err) {
      toast.error('Failed to delete banner');
    }
  };

  const handleOpenModal = () => {
    setEditingBanner(null);
    setForm({ title: '', subtitle: '', imageUrl: '', isActive: true });
    setErrors({});
    setShowModal(true);
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 bg-clip-text text-transparent mb-2">Banners</h1>
              <p className="text-gray-400">Manage promotional banners for your store</p>
            </div>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              <Plus className="w-5 h-5" /> Add Banner
            </button>
          </div>

          {/* Banners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
              </div>
            ) : banners && banners.length > 0 ? (
              banners.map(banner => (
                <div key={banner.id || banner._id} className="group relative rounded-2xl overflow-hidden shadow-2xl bg-gray-800 border border-gray-700 hover:border-pink-500 transition-all">
                  {/* Image */}
                  <img
                    src={banner.imageUrl ? (banner.imageUrl.startsWith('http') ? banner.imageUrl : `http://localhost:5000${banner.imageUrl}`) : '/placeholder.png'}
                    alt={banner.title}
                    className="w-full h-64 object-cover"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      banner.isActive
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Overlay with Actions */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleEdit(banner)}
                      className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:scale-110 transition"
                    >
                      <Edit className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner)}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:scale-110 transition"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent text-white">
                    <h3 className="text-xl font-bold truncate">{banner.title}</h3>
                    {banner.subtitle && <p className="text-sm text-gray-300 truncate mt-1">{banner.subtitle}</p>}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-400 text-lg">No banners yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">{editingBanner ? 'Edit' : 'Create'} Banner</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    placeholder="Enter banner title"
                    value={form.title}
                    onChange={e => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }); }}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition ${
                      errors.title ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Subtitle (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter banner subtitle"
                    value={form.subtitle}
                    onChange={e => setForm({ ...form, subtitle: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 transition"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Banner Image *</label>
                  <div className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                    errors.imageUrl ? 'border-red-500 bg-red-500/5' : 'border-gray-600 hover:border-pink-500 bg-gray-800/50'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="pointer-events-none">
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${
                        uploading ? 'animate-spin text-pink-400' : 'text-gray-400'
                      }`} />
                      <p className="text-gray-300 font-medium">
                        {uploading ? 'Uploading...' : form.imageUrl ? 'Click to change image' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                  {errors.imageUrl && <p className="text-red-400 text-sm mt-1">{errors.imageUrl}</p>}
                </div>

                {/* Image Preview */}
                {form.imageUrl && (
                  <div className="relative">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, imageUrl: '' })}
                      className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Active Toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => setForm({ ...form, isActive: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-600 text-pink-600 cursor-pointer"
                    />
                    <span className="text-gray-300 font-medium">Active</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-700">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                  >
                    {editingBanner ? 'Update Banner' : 'Create Banner'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg transition border border-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}