// src/components/admin/promocodecrud.jsx
import { useState, useEffect, useCallback } from 'react';
import { useCouponStore } from '../store/promocodestore';
import { useProductStore } from '../store/productstore';
import { useCategoryStore } from '../store/categorystore';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Loader2, X, CheckCircle, AlertCircle, Tag, ToggleLeft, ToggleRight, Search } from 'lucide-react';

const APPLY_ON_OPTS = [
  { value: 'cart', label: 'Entire Cart' },
  { value: 'product', label: 'Specific Products' },
  { value: 'category', label: 'Specific Categories' },
];
const TYPE_OPTS = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'fixed', label: 'Fixed Amount (Rs.)' },
];

const emptyForm = {
  code: '', description: '', discount_type: 'percentage', discount_value: '',
  apply_on: 'cart', applicable_products: [], applicable_categories: [],
  validFrom: '', validTo: '', usage_limit: '', min_order_amount: '', isActive: true,
};

export default function PromoCodeCRUD() {
  const { coupons, loading, fetchCoupons, addCoupon, updateCoupon, deleteCoupon } = useCouponStore();
  const { products, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => { fetchCoupons(); fetchProducts({ limit: 200 }); fetchCategories(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setErrors({}); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code || '', description: c.description || '',
      discount_type: c.discount_type || 'percentage',
      discount_value: c.discount_value ?? '',
      apply_on: c.apply_on || 'cart',
      applicable_products: c.applicable_products || [],
      applicable_categories: c.applicable_categories || [],
      validFrom: c.validFrom ? c.validFrom.slice(0, 10) : '',
      validTo: c.validTo ? c.validTo.slice(0, 10) : '',
      usage_limit: c.usage_limit ?? '',
      min_order_amount: c.min_order_amount ?? '',
      isActive: c.isActive !== false,
    });
    setErrors({}); setShowModal(true);
  };

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.code?.trim()) e.code = 'Code is required';
    if (!form.discount_value || Number(form.discount_value) <= 0) e.discount_value = 'Discount must be > 0';
    if (form.discount_type === 'percentage' && Number(form.discount_value) > 100) e.discount_value = 'Max 100%';
    if (!form.validFrom) e.validFrom = 'Required';
    if (!form.validTo) e.validTo = 'Required';
    if (form.validFrom && form.validTo && new Date(form.validTo) <= new Date(form.validFrom))
      e.validTo = 'Must be after start date';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Fix errors first'); return; }
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        description: form.description || null,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        apply_on: form.apply_on,
        applicable_products: form.apply_on === 'product' ? form.applicable_products : [],
        applicable_categories: form.apply_on === 'category' ? form.applicable_categories : [],
        validFrom: form.validFrom,
        validTo: form.validTo,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : 0,
        isActive: form.isActive,
      };
      if (editing) { await updateCoupon(editing.code, payload); toast.success('Coupon updated!'); }
      else { await addCoupon(payload); toast.success('Coupon created!'); }
      setShowModal(false); fetchCoupons();
    } catch (err) { toast.error(err?.response?.data?.message || 'Save failed'); }
  };

  const handleDelete = async (code) => {
    if (!window.confirm(`Delete coupon ${code}?`)) return;
    try { await deleteCoupon(code); toast.success('Deleted!'); }
    catch (err) { toast.error(err?.response?.data?.message || 'Delete failed'); }
  };

  const toggleProduct = (id) => set('applicable_products',
    form.applicable_products.includes(id) ? form.applicable_products.filter(x => x !== id) : [...form.applicable_products, id]);
  const toggleCategory = (id) => set('applicable_categories',
    form.applicable_categories.includes(id) ? form.applicable_categories.filter(x => x !== id) : [...form.applicable_categories, id]);

  const filtered = coupons.filter(c => c.code?.toLowerCase().includes(search.toLowerCase()));

  const Field = ({ label, error, children }) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );

  const inputCls = (err) => `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-[#FF6B35] transition ${err ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupon Codes</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create and manage discount coupons</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B35] hover:bg-orange-500 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-orange-200">
          <Plus className="w-4 h-4" /> New Coupon
        </button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search coupons…"
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B35]" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-7 h-7 animate-spin text-[#FF6B35]" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
          <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No coupons yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Code', 'Discount', 'Applies To', 'Valid', 'Usage', 'Status', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(c => (
                  <tr key={c.code} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">{c.code}</span>
                      {c.description && <p className="text-xs text-gray-400 mt-0.5">{c.description}</p>}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-orange-600">
                      {c.discount_type === 'percentage' ? `${c.discount_value}%` : `Rs. ${c.discount_value}`}
                      {c.min_order_amount > 0 && <p className="text-xs text-gray-400 font-normal">Min Rs. {c.min_order_amount}</p>}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="capitalize text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{c.apply_on}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">
                      {c.validFrom ? new Date(c.validFrom).toLocaleDateString() : '—'} → {c.validTo ? new Date(c.validTo).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">
                      {c.usage_count || 0}{c.usage_limit ? ` / ${c.usage_limit}` : ''}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(c)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(c.code)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Coupon' : 'New Coupon'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Code *" error={errors.code}>
                  <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="SAVE20" className={inputCls(errors.code)} />
                </Field>
                <Field label="Status">
                  <div className="flex items-center gap-3 h-[42px]">
                    <div onClick={() => set('isActive', !form.isActive)} className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${form.isActive ? 'bg-emerald-500' : 'bg-gray-300'} relative`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                    </div>
                    <span className="text-sm text-gray-600">{form.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </Field>
              </div>

              <Field label="Description">
                <input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Optional note" className={inputCls()} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Discount Type">
                  <select value={form.discount_type} onChange={e => set('discount_type', e.target.value)} className={inputCls()}>
                    {TYPE_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
                <Field label={`Value ${form.discount_type === 'percentage' ? '(%)' : '(Rs.)'} *`} error={errors.discount_value}>
                  <input type="number" min="0" max={form.discount_type === 'percentage' ? 100 : undefined}
                    value={form.discount_value} onChange={e => set('discount_value', e.target.value)}
                    placeholder={form.discount_type === 'percentage' ? '10' : '500'}
                    className={inputCls(errors.discount_value)} />
                </Field>
              </div>

              <Field label="Applies To">
                <select value={form.apply_on} onChange={e => set('apply_on', e.target.value)} className={inputCls()}>
                  {APPLY_ON_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>

              {form.apply_on === 'product' && (
                <Field label="Select Products">
                  <div className="border border-gray-200 rounded-xl max-h-36 overflow-y-auto p-2 space-y-1">
                    {products.slice(0, 50).map(p => {
                      const id = p.id || p._id;
                      const checked = form.applicable_products.includes(id);
                      return (
                        <label key={id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${checked ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                          <input type="checkbox" checked={checked} onChange={() => toggleProduct(id)} className="text-[#FF6B35]" />
                          <span className="text-sm text-gray-700 flex-1">{p.name}</span>
                          <span className="text-xs text-gray-400">Rs. {p.price}</span>
                        </label>
                      );
                    })}
                  </div>
                </Field>
              )}

              {form.apply_on === 'category' && (
                <Field label="Select Categories">
                  <div className="border border-gray-200 rounded-xl max-h-36 overflow-y-auto p-2 space-y-1">
                    {categories.slice(0, 30).map(cat => {
                      const id = cat.id || cat._id;
                      const checked = form.applicable_categories.includes(id);
                      return (
                        <label key={id} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${checked ? 'bg-orange-50' : 'hover:bg-gray-50'}`}>
                          <input type="checkbox" checked={checked} onChange={() => toggleCategory(id)} className="text-[#FF6B35]" />
                          <span className="text-sm text-gray-700">{cat.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </Field>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field label="Valid From *" error={errors.validFrom}>
                  <input type="date" value={form.validFrom} onChange={e => set('validFrom', e.target.value)} className={inputCls(errors.validFrom)} />
                </Field>
                <Field label="Valid To *" error={errors.validTo}>
                  <input type="date" value={form.validTo} onChange={e => set('validTo', e.target.value)} className={inputCls(errors.validTo)} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Usage Limit">
                  <input type="number" min="1" value={form.usage_limit} onChange={e => set('usage_limit', e.target.value)} placeholder="Unlimited" className={inputCls()} />
                </Field>
                <Field label="Min Order (Rs.)">
                  <input type="number" min="0" value={form.min_order_amount} onChange={e => set('min_order_amount', e.target.value)} placeholder="0" className={inputCls()} />
                </Field>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 bg-[#FF6B35] hover:bg-orange-500 text-white font-bold rounded-xl text-sm transition disabled:opacity-70">
                  {editing ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm transition">
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
