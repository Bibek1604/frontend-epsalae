// src/components/admin/brandcrud.jsx
// Admin Panel for Managing Brands (localStorage based)
import React, { useState } from 'react';
import { useBrandStore } from '../store/brandstore';
import { Plus, Trash2, Edit2, X, Image, RefreshCw, Save } from 'lucide-react';

export default function BrandCrud() {
  const { brands, addBrand, updateBrand, deleteBrand, resetBrands } = useBrandStore();
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({ name: '', logo: '' });
  const [previewImage, setPreviewImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.logo) {
      alert('Please provide a logo image URL');
      return;
    }

    if (editingBrand) {
      updateBrand(editingBrand.id, formData);
    } else {
      addBrand(formData);
    }

    setFormData({ name: '', logo: '' });
    setPreviewImage('');
    setEditingBrand(null);
    setShowModal(false);
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({ name: brand.name || '', logo: brand.logo });
    setPreviewImage(brand.logo);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      deleteBrand(id);
    }
  };

  const handleLogoChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, logo: url });
    setPreviewImage(url);
  };

  const openAddModal = () => {
    setEditingBrand(null);
    setFormData({ name: '', logo: '' });
    setPreviewImage('');
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brand Management</h1>
          <p className="mt-1 text-gray-600">Manage brands displayed on homepage (stored in localStorage)</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete ALL brands?')) {
                resetBrands();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-red-700 transition bg-red-100 rounded-lg hover:bg-red-200"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-6 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Add Brand
          </button>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="relative p-4 transition bg-white border border-gray-200 rounded-xl hover:shadow-lg group"
          >
            <div className="flex items-center justify-center h-24 mb-3 bg-gray-50 rounded-lg">
              <img
                src={brand.logo}
                alt={brand.name || 'Brand'}
                className="object-contain w-16 h-16"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                }}
              />
            </div>
            {brand.name && (
              <p className="text-sm font-medium text-center text-gray-700 truncate">
                {brand.name}
              </p>
            )}
            
            {/* Action Buttons */}
            <div className="absolute flex gap-1 transition opacity-0 top-2 right-2 group-hover:opacity-100">
              <button
                onClick={() => handleEdit(brand)}
                className="p-1.5 bg-blue-100 rounded-lg hover:bg-blue-200 transition"
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(brand.id)}
                className="p-1.5 bg-red-100 rounded-lg hover:bg-red-200 transition"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {brands.length === 0 && (
        <div className="py-16 text-center">
          <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900">No brands yet</h3>
          <p className="mt-1 text-gray-600">Add your first brand to display on homepage</p>
          <button
            onClick={openAddModal}
            className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Add Brand
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBrand ? 'Edit Brand' : 'Add New Brand'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 transition rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Logo URL */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Logo Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={handleLogoChange}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Preview */}
              {previewImage && (
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="object-contain w-20 h-20"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100?text=Invalid+URL';
                    }}
                  />
                </div>
              )}

              {/* Name (Optional) */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Brand Name <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Apple, Nike"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 text-gray-700 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center flex-1 gap-2 px-4 py-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Save className="w-4 h-4" />
                  {editingBrand ? 'Update' : 'Add Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
