// src/pages/admin/CategoriesPage.tsx
// Admin categories management page

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, ChevronDown } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import useAdminApi, { Category } from '@/hooks/useAdminApi';
import './categories-page.css';

export const CategoriesPage: React.FC = () => {
  const { loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } =
    useAdminApi();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    isActive: true,
  });

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories(1, 50);
        setCategories(data);
      } finally {
        setPageLoading(false);
      }
    };
    loadCategories();
  }, [fetchCategories]);

  // Show toast
  useEffect(() => {
    if (error) {
      setToast({ type: 'error', message: error });
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        await updateCategory(editingId, formData);
        setToast({ type: 'success', message: 'Category updated successfully' });
      } else {
        await createCategory(formData);
        setToast({ type: 'success', message: 'Category created successfully' });
      }

      // Reload categories
      const data = await fetchCategories(1, 50);
      setCategories(data);

      // Reset form
      setFormData({ name: '', slug: '', description: '', image: '', isActive: true });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err) {
      setToast({
        type: 'error',
        message: editingId ? 'Failed to update category' : 'Failed to create category',
      });
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      isActive: category.isActive,
    });
    setEditingId(category._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await deleteCategory(id);
      setToast({ type: 'success', message: 'Category deleted successfully' });
      const data = await fetchCategories(1, 50);
      setCategories(data);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete category' });
    }
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', image: '', isActive: true });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  return (
    <AdminLayout currentPage="categories">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Categories</h1>
            <p>Manage your product categories</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <Plus size={20} />
            New Category
          </button>
        </div>

        {/* Toast Notification */}
        {toast && (
          <div className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)}>×</button>
          </div>
        )}

        {/* Loading State */}
        {pageLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading categories...</p>
          </div>
        ) : (
          <>
            {/* Categories Table */}
            <div className="table-container">
              {categories.length === 0 ? (
                <div className="empty-state">
                  <p>No categories found</p>
                  <button className="btn btn-primary" onClick={handleOpenModal}>
                    Create First Category
                  </button>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category._id}>
                        <td>
                          <div className="cell-content">
                            {category.image && (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="cell-image"
                              />
                            )}
                            <span>{category.name}</span>
                          </div>
                        </td>
                        <td>
                          <code>{category.slug}</code>
                        </td>
                        <td>
                          <span className="description-cell">
                            {category.description.substring(0, 50)}...
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${category.isActive ? 'active' : 'inactive'}`}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <div className="actions">
                            <button
                              className="action-btn edit"
                              onClick={() => handleEdit(category)}
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDelete(category._id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                <h2>{editingId ? 'Edit Category' : 'Create Category'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Electronics"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Slug *</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g., electronics"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Category description"
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
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

export default CategoriesPage;
