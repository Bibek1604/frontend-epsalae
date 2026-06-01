// src/pages/PromoCodeCRUD.jsx
import { useState, useEffect } from 'react';
import { useCouponStore } from '../store/promocodestore';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Loader2, X, CheckCircle, AlertCircle, Tag } from 'lucide-react';

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

  const activeCount = coupons.filter(c => c.isActive && !isExpired(c)).length;
  const expiredCount = coupons.filter(c => isExpired(c)).length;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Promo Codes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage discount coupons</p>
        </div>
        <button
          onClick={() => {
            setEditingCoupon(null);
            setForm({ code: '', discountAmount: '', validFrom: '', validTo: '', isActive: true });
            setErrors({});
            setShowModal(true);
          }}
          className="bg-[#FF6B35] hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Tag className="w-4 h-4 text-[#1A3C8A]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-800">{coupons.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active</p>
              <p className="text-lg font-bold text-gray-800">{activeCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Expired</p>
              <p className="text-lg font-bold text-gray-800">{expiredCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">All Coupons</h2>
          <span className="text-xs text-gray-400">{coupons.length} total</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-16">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-600">No coupons yet</p>
            <p className="text-sm text-gray-400 mt-1">Create your first discount code!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-5 py-3 text-left">Coupon Code</th>
                  <th className="px-5 py-3 text-center">Discount</th>
                  <th className="px-5 py-3 text-center">Valid From</th>
                  <th className="px-5 py-3 text-center">Valid To</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map((coupon) => {
                  const status = getStatus(coupon);
                  return (
                    <tr key={coupon.code} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <code className="px-3 py-1 bg-blue-50 text-[#1A3C8A] font-bold rounded-lg text-sm tracking-wider">
                          {coupon.code}
                        </code>
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-[#1A3C8A]">
                        Rs. {Number(coupon.discountAmount).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-center text-gray-600 text-xs">
                        {new Date(coupon.validFrom).toLocaleDateString('en-NP', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      <td className="px-5 py-4 text-center text-gray-600 text-xs">
                        {new Date(coupon.validTo).toLocaleDateString('en-NP', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1
                          ${status.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                            status.color === 'red' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-600'}`}
                        >
                          {status.color === 'emerald' ? <CheckCircle className="w-3 h-3" /> :
                           status.color === 'red' ? <AlertCircle className="w-3 h-3" /> : null}
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(coupon)} className="bg-[#1A3C8A] hover:bg-blue-900 text-white px-3 py-1.5 rounded-lg text-sm">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(coupon)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">{editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Coupon Code *</label>
                <input
                  type="text"
                  placeholder="e.g. WELCOME100"
                  value={form.code}
                  onChange={(e) => {
                    setForm({ ...form, code: e.target.value.toUpperCase() });
                    setErrors({ ...errors, code: '' });
                  }}
                  disabled={!!editingCoupon}
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm font-mono tracking-wider uppercase transition
                    ${editingCoupon ? 'bg-gray-100 cursor-not-allowed border-gray-200' : 'bg-white focus:border-[#FF6B35] focus:outline-none'}
                    ${errors.code ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code}</p>}
                {editingCoupon && <p className="mt-1 text-xs text-gray-400">Coupon code cannot be changed after creation</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount Amount (Rs.) *</label>
                <input
                  type="number"
                  min="1"
                  placeholder="500"
                  value={form.discountAmount}
                  onChange={(e) => {
                    setForm({ ...form, discountAmount: e.target.value });
                    setErrors({ ...errors, discountAmount: '' });
                  }}
                  className={`w-full px-4 py-2.5 border rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm transition ${errors.discountAmount ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.discountAmount && <p className="mt-1 text-xs text-red-600">{errors.discountAmount}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Valid From *</label>
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={(e) => {
                      setForm({ ...form, validFrom: e.target.value });
                      setErrors({ ...errors, validFrom: '', validTo: '' });
                    }}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm transition ${errors.validFrom ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.validFrom && <p className="mt-1 text-xs text-red-600">{errors.validFrom}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Valid To *</label>
                  <input
                    type="date"
                    value={form.validTo}
                    onChange={(e) => {
                      setForm({ ...form, validTo: e.target.value });
                      setErrors({ ...errors, validTo: '' });
                    }}
                    className={`w-full px-4 py-2.5 border rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm transition ${errors.validTo ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.validTo && <p className="mt-1 text-xs text-red-600">{errors.validTo}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 py-1">
                <input type="checkbox" id="active" checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#FF6B35] rounded" />
                <label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer">Coupon is Active</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-[#FF6B35] hover:bg-orange-500 text-white font-bold rounded-xl text-sm transition">
                  {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button type="button" onClick={closeModal} className="px-6 py-2.5 font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
