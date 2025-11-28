import { useState, useEffect } from 'react';
import { useCouponStore } from '../store/promocodestore';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit, Trash2, Loader2, X, Check, AlertCircle } from 'lucide-react';

export default function PromoCodeCRUD() {
  const { coupons, loading, fetchCoupons, addCoupon, updateCoupon, deleteCoupon } = useCouponStore();
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form, setForm] = useState({ code: '', discountAmount: '', validFrom: '', validTo: '', isActive: true });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.code?.trim()) newErrors.code = 'Coupon code is required';
    if (!form.discountAmount || Number(form.discountAmount) <= 0) newErrors.discountAmount = 'Discount amount must be greater than 0';
    if (!form.validFrom) newErrors.validFrom = 'Valid from date is required';
    if (!form.validTo) newErrors.validTo = 'Valid to date is required';
    if (form.validFrom && form.validTo && new Date(form.validTo) <= new Date(form.validFrom)) {
      newErrors.validTo = 'Valid to date must be after valid from date';
    }
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
        toast.success('Coupon updated!');
      } else {
        await addCoupon(payload);
        toast.success('Coupon created!');
      }

      setShowModal(false);
      setEditingCoupon(null);
      setForm({ code: '', discountAmount: '', validFrom: '', validTo: '', isActive: true });
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save coupon');
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code || '',
      discountAmount: coupon.discountAmount || '',
      validFrom: coupon.validFrom ? coupon.validFrom.split('T')[0] : '',
      validTo: coupon.validTo ? coupon.validTo.split('T')[0] : '',
      isActive: coupon.isActive !== undefined ? coupon.isActive : true,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (coupon) => {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;
    try {
      await deleteCoupon(coupon.code);
      toast.success('Coupon deleted!');
    } catch {
      toast.error('Failed to delete coupon');
    }
  };

  const handleOpenModal = () => {
    setEditingCoupon(null);
    setForm({ code: '', discountAmount: '', validFrom: '', validTo: '', isActive: true });
    setErrors({});
    setShowModal(true);
  };

  const isExpired = (coupon) => new Date(coupon.validTo) < new Date();
  const isActive = (coupon) => coupon.isActive && !isExpired(coupon);

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">Promo Codes</h1>
              <p className="text-gray-400">Manage coupon codes and discount offers</p>
            </div>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              <Plus className="w-5 h-5" /> Create Code
            </button>
          </div>

          {/* Coupons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
              </div>
            ) : coupons && coupons.length > 0 ? (
              coupons.map(coupon => (
                <div key={coupon.code} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-all" />
                  <div className="relative bg-gray-800 border border-gray-700 group-hover:border-purple-500 rounded-2xl p-8 transition-all shadow-xl">
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                        isActive(coupon)
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : isExpired(coupon)
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}>
                        {isExpired(coupon) ? '❌ Expired' : isActive(coupon) ? '✓ Active' : '⏸️ Inactive'}
                      </span>
                    </div>

                    {/* Coupon Code */}
                    <div className="mb-6">
                      <p className="text-gray-400 text-sm mb-1">Code</p>
                      <p className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text tracking-wider">{coupon.code}</p>
                    </div>

                    {/* Discount */}
                    <div className="mb-6">
                      <p className="text-gray-400 text-sm mb-1">Discount</p>
                      <p className="text-3xl font-bold text-purple-300">Rs. {coupon.discountAmount?.toFixed(2)}</p>
                    </div>

                    {/* Valid Dates */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-700">
                      <div>
                        <p className="text-gray-500 text-xs">Valid From</p>
                        <p className="text-gray-300 text-sm">{new Date(coupon.validFrom).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Valid To</p>
                        <p className="text-gray-300 text-sm">{new Date(coupon.validTo).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(coupon)}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                      >
                        <Edit className="w-4 h-4 inline mr-2" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(coupon)}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition"
                      >
                        <Trash2 className="w-4 h-4 inline mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-400 text-lg">No coupons yet. Create one to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">{editingCoupon ? 'Edit' : 'Create'} Coupon</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Coupon Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Coupon Code *</label>
                  <input
                    type="text"
                    placeholder="e.g., WELCOME50"
                    value={form.code}
                    onChange={e => { setForm({ ...form, code: e.target.value.toUpperCase() }); setErrors({ ...errors, code: '' }); }}
                    disabled={!!editingCoupon}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition uppercase font-bold tracking-wider ${
                      errors.code ? 'border-red-500' : 'border-gray-600'
                    } ${editingCoupon ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  {errors.code && <p className="text-red-400 text-sm mt-1">{errors.code}</p>}
                </div>

                {/* Discount Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Discount Amount (Rs.) *</label>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={form.discountAmount}
                    onChange={e => { setForm({ ...form, discountAmount: e.target.value }); setErrors({ ...errors, discountAmount: '' }); }}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition ${
                      errors.discountAmount ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.discountAmount && <p className="text-red-400 text-sm mt-1">{errors.discountAmount}</p>}
                </div>

                {/* Valid From */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Valid From *</label>
                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={e => { setForm({ ...form, validFrom: e.target.value }); setErrors({ ...errors, validFrom: '' }); }}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition ${
                      errors.validFrom ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.validFrom && <p className="text-red-400 text-sm mt-1">{errors.validFrom}</p>}
                </div>

                {/* Valid To */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Valid To *</label>
                  <input
                    type="date"
                    value={form.validTo}
                    onChange={e => { setForm({ ...form, validTo: e.target.value }); setErrors({ ...errors, validTo: '' }); }}
                    className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition ${
                      errors.validTo ? 'border-red-500' : 'border-gray-600'
                    }`}
                  />
                  {errors.validTo && <p className="text-red-400 text-sm mt-1">{errors.validTo}</p>}
                </div>

                {/* Active Toggle */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => setForm({ ...form, isActive: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-600 text-purple-600 cursor-pointer"
                    />
                    <span className="text-gray-300 font-medium">Active</span>
                  </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-700">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all shadow-lg"
                  >
                    {editingCoupon ? 'Update Coupon' : 'Create Coupon'}
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