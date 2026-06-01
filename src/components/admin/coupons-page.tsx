// src/pages/admin/CouponsPage.tsx
// Admin coupons management page with discount code configuration

import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import useAdminApi, { Coupon, Category } from '@/hooks/useAdminApi';
import './coupons-page.css';

export const CouponsPage: React.FC = () => {
  const { loading, error, fetchCoupons, fetchCategories, createCoupon, updateCoupon, deleteCoupon } =
    useAdminApi();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount: 0,
    discountType: 'percentage',
    minOrderAmount: 0,
    maxUseCount: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    applicableCategories: [] as string[],
    applicableProducts: [] as string[],
  });

  // Load coupons and categories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [couponsData, categoriesData] = await Promise.all([
          fetchCoupons(1, 50),
          fetchCategories(1, 100),
        ]);
        setCoupons(couponsData);
        setCategories(categoriesData);
      } finally {
        setPageLoading(false);
      }
    };
    loadData();
  }, [fetchCoupons, fetchCategories]);

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
      [name]: ['discount', 'minOrderAmount', 'maxUseCount'].includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      applicableCategories: prev.applicableCategories.includes(categoryId)
        ? prev.applicableCategories.filter((id) => id !== categoryId)
        : [...prev.applicableCategories, categoryId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate dates
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setToast({ type: 'error', message: 'End date must be after start date' });
      return;
    }

    try {
      if (editingId) {
        await updateCoupon(editingId, formData);
        setToast({ type: 'success', message: 'Coupon updated successfully' });
      } else {
        await createCoupon(formData);
        setToast({ type: 'success', message: 'Coupon created successfully' });
      }

      // Reload coupons
      const data = await fetchCoupons(1, 50);
      setCoupons(data);

      // Reset form
      setFormData({
        code: '',
        description: '',
        discount: 0,
        discountType: 'percentage',
        minOrderAmount: 0,
        maxUseCount: 0,
        startDate: '',
        endDate: '',
        isActive: true,
        applicableCategories: [],
        applicableProducts: [],
      });
      setEditingId(null);
      setIsModalOpen(false);
    } catch (err) {
      setToast({
        type: 'error',
        message: editingId ? 'Failed to update coupon' : 'Failed to create coupon',
      });
    }
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount: coupon.discount,
      discountType: coupon.discountType,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxUseCount: coupon.maxUseCount || 0,
      startDate: coupon.startDate.split('T')[0],
      endDate: coupon.endDate.split('T')[0],
      isActive: coupon.isActive,
      applicableCategories: coupon.applicableCategories || [],
      applicableProducts: coupon.applicableProducts || [],
    });
    setEditingId(coupon._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) {
      return;
    }

    try {
      await deleteCoupon(id);
      setToast({ type: 'success', message: 'Coupon deleted successfully' });
      const data = await fetchCoupons(1, 50);
      setCoupons(data);
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete coupon' });
    }
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({
      code: '',
      description: '',
      discount: 0,
      discountType: 'percentage',
      minOrderAmount: 0,
      maxUseCount: 0,
      startDate: '',
      endDate: '',
      isActive: true,
      applicableCategories: [],
      applicableProducts: [],
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  // Filter coupons
  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if coupon is active
  const isCouponValid = (coupon: Coupon): boolean => {
    const now = new Date();
    const start = new Date(coupon.startDate);
    const end = new Date(coupon.endDate);
    return now >= start && now <= end;
  };

  return (
    <AdminLayout currentPage="coupons">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1>Coupons</h1>
            <p>Manage discount codes and promotional offers</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <Plus size={20} />
            New Coupon
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
            placeholder="Search by code or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="result-count">{filteredCoupons.length} coupons</span>
        </div>

        {/* Loading State */}
        {pageLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading coupons...</p>
          </div>
        ) : (
          <>
            {/* Coupons Table */}
            <div className="table-container">
              {filteredCoupons.length === 0 ? (
                <div className="empty-state">
                  <p>No coupons found</p>
                  <button className="btn btn-primary" onClick={handleOpenModal}>
                    Create First Coupon
                  </button>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Description</th>
                      <th>Discount</th>
                      <th>Usage</th>
                      <th>Valid Period</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCoupons.map((coupon) => {
                      const isValid = isCouponValid(coupon);
                      const usagePercentage = coupon.maxUseCount
                        ? (coupon.currentUseCount / coupon.maxUseCount) * 100
                        : 0;

                      return (
                        <tr key={coupon._id}>
                          <td>
                            <code className="coupon-code">{coupon.code}</code>
                          </td>
                          <td>
                            <span className="description">{coupon.description || '—'}</span>
                          </td>
                          <td>
                            <div className="discount-cell">
                              <span className="discount-value">
                                {coupon.discountType === 'percentage' ? (
                                  <>{coupon.discount}%</>
                                ) : (
                                  <>${coupon.discount.toFixed(2)}</>
                                )}
                              </span>
                              <span className="discount-type">
                                {coupon.discountType === 'percentage' ? 'off' : 'fixed'}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="usage-cell">
                              {coupon.maxUseCount > 0 ? (
                                <>
                                  <span className="usage-count">
                                    {coupon.currentUseCount}/{coupon.maxUseCount}
                                  </span>
                                  <div className="usage-bar">
                                    <div
                                      className="usage-fill"
                                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                    ></div>
                                  </div>
                                </>
                              ) : (
                                <span className="usage-unlimited">Unlimited</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="date-range">
                              {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                isValid && coupon.isActive ? 'active' : isValid ? 'expiring' : 'expired'
                              }`}
                            >
                              {!isValid ? 'Expired' : !coupon.isActive ? 'Inactive' : 'Active'}
                            </span>
                          </td>
                          <td>
                            <div className="actions">
                              <button
                                className="action-btn edit"
                                onClick={() => handleEdit(coupon)}
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                className="action-btn delete"
                                onClick={() => handleDelete(coupon._id)}
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
                <h2>{editingId ? 'Edit Coupon' : 'Create Coupon'}</h2>
                <button className="modal-close" onClick={handleCloseModal}>
                  ×
                </button>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                {/* Basic Info */}
                <div className="form-section">
                  <h4>Basic Information</h4>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Coupon Code *</label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        placeholder="e.g., SUMMER50"
                        required
                        style={{ textTransform: 'uppercase' }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Discount Type *</label>
                      <select
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount ($)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="e.g., Summer sale - 50% off on all items"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Discount Details */}
                <div className="form-section">
                  <h4>Discount Details</h4>

                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        {formData.discountType === 'percentage' ? 'Discount %' : 'Discount Amount'} *
                      </label>
                      <input
                        type="number"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        placeholder="0"
                        step={formData.discountType === 'percentage' ? '1' : '0.01'}
                        min="0"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Minimum Order Amount</label>
                      <input
                        type="number"
                        name="minOrderAmount"
                        value={formData.minOrderAmount}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Usage & Dates */}
                <div className="form-section">
                  <h4>Usage & Validity</h4>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Max Use Count</label>
                      <input
                        type="number"
                        name="maxUseCount"
                        value={formData.maxUseCount}
                        onChange={handleInputChange}
                        placeholder="0 for unlimited"
                        min="0"
                      />
                    </div>

                    <div className="form-group">
                      <label>Valid From *</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Valid To *</label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div className="form-section">
                  <h4>Applicable Categories</h4>
                  <div className="checkbox-group">
                    {categories.length === 0 ? (
                      <p className="no-items">No categories available</p>
                    ) : (
                      categories.map((cat) => (
                        <div key={cat._id} className="form-group checkbox">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.applicableCategories.includes(cat._id)}
                              onChange={() => handleCategoryToggle(cat._id)}
                            />
                            {cat.name}
                          </label>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="form-section">
                  <h4>Status</h4>

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

export default CouponsPage;
