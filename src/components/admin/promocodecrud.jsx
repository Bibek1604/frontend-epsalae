// src/pages/PromoCodeCRUD.jsx
import { useState, useEffect } from 'react';
import { useCouponStore } from '../store/promocodestore';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, Loader2, X, CheckCircle, AlertCircle, Calendar, Tag } from 'lucide-react';

export default function PromoCodeCRUD() {
  const { coupons, loading, fetchCoupons, addCoupon, updateCoupon, deleteCoupon } = useCouponStore();

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState({
    code: '',
    discountAmount: '',
    validFrom: '',
    validTo: '',
    isActive: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.code?.trim()) newErrors.code = 'Coupon code is required';
    if (!form.discountAmount || Number(form.discountAmount) <= 0)
      newErrors.discountAmount = 'Discount must be greater than 0';
    if (!form.validFrom) newErrors.validFrom = 'Valid from date is required';
    if (!form.validTo) newErrors.validTo = 'Valid to date is required';
    if (form.validFrom && form.validTo && new Date(form.validTo) <= new Date(form.validFrom))
      newErrors.validTo = 'End date must be after start date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        discountAmount: Number(form.discountAmount),
        validFrom: form.validFrom,
        validTo: form.validTo,
        isActive: form.isActive,
      };

      if (editingCoupon) {
        await updateCoupon(editingCoupon.code, payload);
        toast.success('Coupon updated successfully!');
      } else {
        await addCoupon(payload);
        toast.success('Coupon created successfully!');
      }

      closeModal();
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
    setForm({ code: '', discountAmount: '', validFrom: '', validTo: '', isActive: true });
    setErrors({});
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code || '',
      discountAmount: coupon.discountAmount || '',
      validFrom: coupon.validFrom ? coupon.validFrom.split('T')[0] : '',
      validTo: coupon.validTo ? coupon.validTo.split('T')[0] : '',
      isActive: coupon.isActive ?? true,
    });
    setShowModal(true);
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Delete coupon "${coupon.code}" permanently?`)) return;
    try {
      await deleteCoupon(coupon.code);
      toast.success('Coupon deleted');
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  const isExpired = (coupon) => new Date(coupon.validTo) < new Date();
  const getStatus = (coupon) => {
    if (!coupon.isActive) return { label: 'Inactive', color: 'gray' };
    if (isExpired(coupon)) return { label: 'Expired', color: 'red' };
    return { label: 'Active', color: 'emerald' };
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 lg:p-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-6 mb-10 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#1A3C8A] mb-2">Promo Codes</h1>
              <p className="text-[#7A7A7A]">Create and manage discount coupons</p>
            </div>
            <button
              onClick={() => {
                setEditingCoupon(null);
                setForm({ code: '', discountAmount: '', validFrom: '', validTo: '', isActive: true });
                setErrors({});
                setShowModal(true);
              }}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
              Create Coupon
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-16 h-16 animate-spin text-[#FF6B35]" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-[#EFEFEF]">
              <Tag className="w-24 h-24 text-[#1A3C8A]/20 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#2E2E2E]">No coupons yet</h3>
              <p className="text-[#7A7A7A] mt-2">Create your first discount code!</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-[#EFEFEF] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] text-white">
                      <th className="px-8 py-6 font-bold text-left">Coupon Code</th>
                      <th className="px-8 py-6 font-bold text-center">Discount</th>
                      <th className="px-8 py-6 font-bold text-center">Valid From</th>
                      <th className="px-8 py-6 font-bold text-center">Valid To</th>
                      <th className="px-8 py-6 font-bold text-center">Status</th>
                      <th className="px-8 py-6 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((coupon, i) => {
                      const status = getStatus(coupon);
                      return (
                        <tr
                          key={coupon.code}
                          className={`border-b border-gray-100 hover:bg-orange-50/30 transition-all ${
                            i % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                          }`}
                        >
                          <td className="px-8 py-6">
                            <code className="px-5 py-3 bg-gradient-to-r from-[#1A3C8A]/10 to-[#FF6B35]/10 text-[#1A3C8A] font-bold rounded-xl text-lg tracking-wider">
                              {coupon.code}
                            </code>
                          </td>
                          <td className="px-8 py-6 text-center font-bold text-[#1A3C8A]">
                            Rs. {Number(coupon.discountAmount).toLocaleString()}
                          </td>
                          <td className="px-8 py-6 text-center text-[#2E2E2E]">
                            {new Date(coupon.validFrom).toLocaleDateString('en-NP', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </td>
                          <td className="px-8 py-6 text-center text-[#2E2E2E]">
                            {new Date(coupon.validTo).toLocaleDateString('en-NP', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm
                              ${status.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 
                                status.color === 'red' ? 'bg-red-100 text-red-700' : 
                                'bg-gray-100 text-gray-600'}`}
                            >
                              {status.color === 'emerald' ? <CheckCircle className="w-5 h-5" /> :
                               status.color === 'red' ? <AlertCircle className="w-5 h-5" /> : null}
                              {status.label}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => handleEdit(coupon)}
                                className="p-3 bg-[#1A3C8A] text-white rounded-xl hover:bg-[#163180] transition shadow-md"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(coupon)}
                                className="p-3 text-white transition bg-red-500 shadow-md rounded-xl hover:bg-red-600"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Premium Modal */}
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
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-7">
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Coupon Code *</label>
                <input
                  type="text"
                  placeholder="e.g. WELCOME100"
                  value={form.code}
                  onChange={(e) => {
                    setForm({ ...form, code: e.target.value.toUpperCase() });
                    setErrors({ ...errors, code: '' });
                  }}
                  disabled={!!editingCoupon}
                  className={`w-full px-6 py-4 border-2 rounded-2xl text-lg font-mono tracking-wider uppercase transition
                    ${editingCoupon ? 'bg-gray-100 cursor-not-allowed' : 'bg-white focus:border-[#FF6B35]'}
                    ${errors.code ? 'border-red-400' : 'border-[#EFEFEF]'}`}
                />
                {errors.code && <p className="mt-2 text-sm text-red-600">{errors.code}</p>}
                {editingCoupon && <p className="mt-2 text-sm text-gray-500">Coupon code cannot be changed after creation</p>}
              </div>

              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Discount Amount (Rs.) *</label>
                <input
                  type="number"
                  min="1"
                  placeholder="500"
                  value={form.discountAmount}
                  onChange={(e) => {
                    setForm({ ...form, discountAmount: e.target.value });
                    setErrors({ ...errors, discountAmount: '' });
                  }}
                  className={`w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition ${errors.discountAmount ? 'border-red-400' : ''}`}
                />
                {errors.discountAmount && <p className="mt-2 text-sm text-red-600">{errors.discountAmount}</p>}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Valid From *</label>
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={(e) => {
                      setForm({ ...form, validFrom: e.target.value });
                      setErrors({ ...errors, validFrom: '', validTo: '' });
                    }}
                    className={`w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition ${errors.validFrom ? 'border-red-400' : ''}`}
                  />
                  {errors.validFrom && <p className="mt-2 text-sm text-red-600">{errors.validFrom}</p>}
                </div>
                <div>
                  <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Valid To *</label>
                  <input
                    type="date"
                    value={form.validTo}
                    onChange={(e) => {
                      setForm({ ...form, validTo: e.target.value });
                      setErrors({ ...errors, validTo: '' });
                    }}
                    className={`w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition ${errors.validTo ? 'border-red-400' : ''}`}
                  />
                  {errors.validTo && <p className="mt-2 text-sm text-red-600">{errors.validTo}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4 py-4">
                <input
                  type="checkbox"
                  id="active"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-6 h-6 text-[#FF6B35] rounded focus:ring-[#FF6B35]"
                />
                <label htmlFor="active" className="text-lg font-medium cursor-pointer">
                  Coupon is Active
                </label>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 py-5 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                >
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
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