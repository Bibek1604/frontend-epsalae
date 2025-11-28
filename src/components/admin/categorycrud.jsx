import { useState, useEffect } from 'react';
import { useCategoryStore } from '../store/categorystore';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit, Trash2, Search, Loader2, Upload, X } from 'lucide-react';
import { openCloudinaryWidget } from '../../utils/cloudinary';

export default function CategoryCRUD() {
  const { categories, loading, error, fetchCategories, addCategory, updateCategory, deleteCategory } = useCategoryStore();

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [failedImages, setFailedImages] = useState(new Set());

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Debug: log categories when they change
  useEffect(() => {
    if (categories.length > 0) {
      console.log('📋 Categories loaded:', categories);
      categories.forEach((cat, idx) => {
        console.log(`Category ${idx}: ${cat.name}`);
        console.log(`  - ID: ${cat.id || cat._id}`);
        console.log(`  - imageUrl present: ${!!cat.imageUrl}`);
        console.log(`  - imageUrl type: ${typeof cat.imageUrl}`);
        if (cat.imageUrl) {
          console.log(`  - imageUrl start: ${String(cat.imageUrl).substring(0, 50)}...`);
        }
      });
    }
  }, [categories]);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: null,
    isActive: true,
  });

  const handleNameChange = (name) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setForm({ ...form, name, slug });
  };

  const openUploadWidget = async () => {
    console.log('🖼️ Starting image upload...');
    setUploading(true);
    
    try {
      await openCloudinaryWidget(
        {
          cloudName: 'dycex9eui',
          uploadPreset: 'epasaley-categories',
          sources: ['local'],
          multiple: false,
        },
        (err, result) => {
          setUploading(false);
          if (!err && result?.event === 'success') {
            console.log('✅ Image uploaded:', result.info.secure_url);
            setForm(prev => ({ ...prev, imageUrl: result.info.secure_url }));
            toast.success('Image uploaded successfully!');
          } else if (err) {
            console.error('❌ Upload error:', err);
            toast.error('Upload failed. Please try again.');
          }
        }
      );
    } catch (error) {
      setUploading(false);
      console.error('❌ Widget error:', error);
      toast.error('Upload widget error. Please refresh and try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.name.trim()) {
      return toast.error('Category name is required');
    }
    if (!form.description.trim()) {
      return toast.error('Description is required');
    }
    
    // Image is required
    if (!form.imageUrl) {
      return toast.error('Please upload an image');
    }

    // Only send fields that backend accepts
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      imageUrl: form.imageUrl,
      isActive: form.isActive,
    };

    console.log('📤 Sending category payload:', payload);
    console.log('🔍 Editing category ID:', editingCat?._id);

    try {
      if (editingCat && editingCat._id) {
        console.log('✏️ Updating category:', editingCat._id);
        await updateCategory(editingCat._id, payload);
        toast.success('Updated!');
      } else {
        console.log('➕ Creating new category');
        await addCategory(payload);
        toast.success('Created!');
      }
      setShowModal(false);
      setEditingCat(null);
      setForm({  name: '', slug: '', description: '', imageUrl: null, isActive: true });
      // Refresh categories to show new/updated items
      setTimeout(() => fetchCategories(), 500);
    } catch (error) {
      console.error('❌ Category error:', error);
      toast.error('Failed to save category');
    }
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setForm(cat);
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted successfully!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete category');
        console.error('Delete error:', err);
      }
    }
  };

  const filtered = Array.isArray(categories) 
    ? categories.filter(c =>
        (c?.name?.toLowerCase?.() || '').includes(search.toLowerCase()) ||
        (c?.id?.includes?.(search) || false) ||
        (c?.slug?.includes?.(search) || false)
      )
    : [];

  return (
    <>
      <Toaster />
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Categories
          </h1>
          <button
            onClick={() => {
              setEditingCat(null);
              setForm({ id: Date.now().toString(36), name: '', slug: '', description: '', imageUrl: '', isActive: true });
              setShowModal(true);
            }}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl"
          >
            <Plus /> Add Category
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full mb-8 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-600 focus:outline-none transition"
        />

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-violet-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map(cat => (
                <div key={cat.id || cat._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="relative h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                    {cat.imageUrl && !failedImages.has(cat.id || cat._id) ? (
                      <>
                        <img 
                          src={`http://localhost:5000${cat.imageUrl}`}
                          alt={cat.name} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={() => {
                            console.error('❌ Image load error for:', cat.name, cat.id || cat._id);
                            console.error('  ImageUrl:', cat.imageUrl);
                            setFailedImages(prev => new Set([...prev, cat.id || cat._id]));
                          }}
                          onLoad={() => {
                            console.log('✅ Image loaded successfully for:', cat.name);
                          }}
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100">
                        <Upload className="w-12 h-12 text-violet-300 mb-2" />
                        <p className="text-sm font-medium text-violet-700">{cat.name}</p>
                        <p className="text-xs text-violet-500">No image</p>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{cat.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">/{cat.slug}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{cat.description}</p>
                    <div className="flex gap-2 pt-4 border-t">
                      <button onClick={() => handleEdit(cat)} className="flex-1 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2">
                        <Edit size={16} /> Edit
                      </button>
                      <button onClick={() => handleDelete(cat.id || cat._id, cat.name)} className="flex-1 py-2 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No categories found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-6 flex items-center justify-between border-b">
              <h2 className="text-2xl font-bold">{editingCat ? '✏️ Edit' : '➕ New'} Category</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* ID Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category ID</label>
                <input 
                  required 
                  placeholder="e.g., cat-001" 
                  value={form.id} 
                  onChange={e => setForm({ ...form, id: e.target.value })} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-600 focus:outline-none transition bg-gray-50"
                />
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category Name</label>
                <input 
                  required 
                  placeholder="e.g., Electronics" 
                  value={form.name} 
                  onChange={e => handleNameChange(e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-600 focus:outline-none transition"
                />
              </div>

              {/* Slug Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Slug (Auto-generated)</label>
                <input 
                  readOnly 
                  placeholder="auto-generated-slug" 
                  value={form.slug} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  required 
                  placeholder="Describe this category..." 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-600 focus:outline-none transition resize-none h-24"
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Category Image</label>
                <button 
                  type="button" 
                  onClick={openUploadWidget} 
                  disabled={uploading} 
                  className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Upload size={20} />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                
                {/* Image Preview */}
                {form.imageUrl ? (
                  <div className="mt-4 relative">
                    <img 
                      src={form.imageUrl.startsWith('http') ? form.imageUrl : `http://localhost:5000${form.imageUrl}`}
                      alt="preview" 
                      className="w-full h-48 object-cover rounded-xl border-2 border-violet-300 shadow-md"
                      onError={(e) => {
                        console.error('Preview image failed to load');
                        e.target.style.display = 'none';
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setForm(prev => ({ ...prev, imageUrl: null }))}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 p-6 border-2 border-dashed border-gray-300 rounded-xl text-center bg-gray-50">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No image selected</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
                >
                  {editingCat ? '💾 Update Category' : '✨ Create Category'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
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