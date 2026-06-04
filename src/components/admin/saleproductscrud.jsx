import { useState, useEffect, useCallback } from 'react';
import { useProductStore } from '../store/productstore';
import api from '../api/base';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/config';
import {
  Search, Package, Tag, Loader2, Edit2, Trash2,
  X, Plus, Check, Percent, Filter, ShoppingBag,
} from 'lucide-react';

export default function SaleProductsCrud() {
  const { products, fetchProducts } = useProductStore();
  const [saleCategories, setSaleCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  // Inline-edit state: { saleId, productId, discount }
  const [editing, setEditing] = useState(null);

  // Add-to-sale modal
  const [showModal, setShowModal] = useState(false);
  const [addForm, setAddForm] = useState({ saleId: '', productId: '', discount_percentage: 10 });
  const [productSearch, setProductSearch] = useState('');
  const [showProductDrop, setShowProductDrop] = useState(false);

  // Close product dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('[data-dd="prod"]')) setShowProductDrop(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const loadSales = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/sale-categories');
      const raw = res.data?.data ?? [];
      setSaleCategories(Array.isArray(raw) ? raw : (raw.items ?? []));
    } catch {
      setSaleCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSales();
    fetchProducts({ limit: 500 });
  }, [loadSales]);

  // Flatten all products across all sale categories
  const allSaleProducts = saleCategories.flatMap((cat) =>
    (cat.products ?? []).map((sp) => ({
      ...sp,
      saleId: cat.id,
      saleTitle: cat.title,
      saleActive: cat.is_active,
      product: products.find((p) => (p.id || p._id) === sp.product_id) ?? null,
    }))
  );

  const filtered = allSaleProducts.filter((sp) => {
    const matchSearch = !search || sp.product?.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || sp.saleId === filterCat;
    return matchSearch && matchCat;
  });

  const avgDiscount = allSaleProducts.length
    ? Math.round(allSaleProducts.reduce((a, sp) => a + (sp.discount_percentage || 0), 0) / allSaleProducts.length)
    : 0;

  // ── Helpers ──────────────────────────────────────────────────────────────
  const getProduct = (id) => products.find((p) => (p.id || p._id) === id) ?? null;

  const updateSaleProducts = async (saleId, updatedProducts, successMsg) => {
    setSaving(true);
    try {
      await api.put(`/sale-categories/${saleId}`, { products: updatedProducts });
      toast.success(successMsg);
      await loadSales();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  // ── Edit discount inline ──────────────────────────────────────────────────
  const saveDiscount = () => {
    if (!editing) return;
    const cat = saleCategories.find((c) => c.id === editing.saleId);
    if (!cat) return;
    const updated = cat.products.map((p) =>
      p.product_id === editing.productId
        ? { ...p, discount_percentage: Math.min(100, Math.max(0, Number(editing.discount) || 0)) }
        : p
    );
    updateSaleProducts(editing.saleId, updated, 'Discount updated').then(() => setEditing(null));
  };

  // ── Remove from sale ──────────────────────────────────────────────────────
  const removeFromSale = (saleId, productId) => {
    if (!window.confirm('Remove this product from the sale?')) return;
    const cat = saleCategories.find((c) => c.id === saleId);
    if (!cat) return;
    const updated = cat.products.filter((p) => p.product_id !== productId);
    updateSaleProducts(saleId, updated, 'Removed from sale');
  };

  // ── Add to sale ───────────────────────────────────────────────────────────
  const addToSale = async () => {
    if (!addForm.saleId) return toast.error('Select a sale category');
    if (!addForm.productId) return toast.error('Select a product');
    const cat = saleCategories.find((c) => c.id === addForm.saleId);
    if (!cat) return;
    if (cat.products.find((p) => p.product_id === addForm.productId))
      return toast.error('Product is already in this sale');
    const updated = [
      ...cat.products,
      { product_id: addForm.productId, discount_percentage: Number(addForm.discount_percentage) || 10 },
    ];
    await updateSaleProducts(addForm.saleId, updated, 'Product added to sale');
    setShowModal(false);
    setAddForm({ saleId: '', productId: '', discount_percentage: 10 });
    setProductSearch('');
  };

  const closeModal = () => {
    setShowModal(false);
    setAddForm({ saleId: '', productId: '', discount_percentage: 10 });
    setProductSearch('');
    setShowProductDrop(false);
  };

  // Products available to add (not already in selected sale)
  const availableProducts = (() => {
    const cat = saleCategories.find((c) => c.id === addForm.saleId);
    return products
      .filter((p) => {
        if (cat && cat.products.find((sp) => sp.product_id === (p.id || p._id))) return false;
        return !productSearch || p.name?.toLowerCase().includes(productSearch.toLowerCase());
      })
      .slice(0, 25);
  })();

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sale Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">All products currently in sale categories — edit discounts or remove</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B35] hover:bg-orange-500 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-orange-200"
        >
          <Plus className="w-4 h-4" /> Add Product to Sale
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Sale Products', value: allSaleProducts.length, icon: ShoppingBag, color: 'text-[#FF6B35]', bg: 'bg-orange-50' },
          { label: 'Active Sales', value: saleCategories.filter((c) => c.is_active).length, icon: Tag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg Discount', value: `${avgDiscount}%`, icon: Percent, color: 'text-[#1A3C8A]', bg: 'bg-blue-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B35] transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#FF6B35] bg-white"
          >
            <option value="all">All Sales</option>
            {saleCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.title}{!c.is_active ? ' (Inactive)' : ''}</option>
            ))}
          </select>
        </div>
        <span className="text-sm text-gray-400 ml-auto">{filtered.length} products</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-[#FF6B35]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No sale products yet</p>
          <p className="text-sm mt-1">Click "Add Product to Sale" to assign products to a sale category</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-5 py-3 text-right">Original</th>
                  <th className="px-5 py-3 text-right">Sale Price</th>
                  <th className="px-5 py-3 text-center">Discount</th>
                  <th className="px-5 py-3 text-center">Sale</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((sp, idx) => {
                  const p = sp.product;
                  const originalPrice = p?.price ?? 0;
                  const salePrice = originalPrice
                    ? Math.round(originalPrice * (1 - sp.discount_percentage / 100))
                    : 0;
                  const isEditingThis =
                    editing && editing.saleId === sp.saleId && editing.productId === sp.product_id;

                  return (
                    <tr key={`${sp.saleId}-${sp.product_id}-${idx}`} className="hover:bg-gray-50 transition-colors">
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                            {p?.imageUrl
                              ? <img src={getImageUrl(p.imageUrl)} alt={p.name} className="w-full h-full object-cover" />
                              : <Package className="w-5 h-5 m-2.5 text-gray-300" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate max-w-[180px]">
                              {p?.name ?? <span className="text-gray-400 text-xs font-mono">{sp.product_id}</span>}
                            </p>
                            <p className="text-xs text-gray-400">{p?.isActive ? 'Active' : 'Inactive'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Original price */}
                      <td className="px-5 py-4 text-right text-gray-400 line-through text-xs whitespace-nowrap">
                        Rs. {originalPrice.toLocaleString()}
                      </td>

                      {/* Sale price */}
                      <td className="px-5 py-4 text-right font-bold text-[#FF6B35] whitespace-nowrap">
                        Rs. {salePrice.toLocaleString()}
                      </td>

                      {/* Discount (inline editable) */}
                      <td className="px-5 py-4 text-center">
                        {isEditingThis ? (
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editing.discount}
                              onChange={(e) => setEditing((ed) => ({ ...ed, discount: e.target.value }))}
                              className="w-16 text-center border border-[#FF6B35] rounded-lg py-1 text-sm focus:outline-none"
                              autoFocus
                              onKeyDown={(e) => { if (e.key === 'Enter') saveDiscount(); if (e.key === 'Escape') setEditing(null); }}
                            />
                            <button
                              onClick={saveDiscount}
                              disabled={saving}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50"
                            >
                              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button onClick={() => setEditing(null)} className="p-1 text-gray-400 hover:bg-gray-100 rounded-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditing({ saleId: sp.saleId, productId: sp.product_id, discount: sp.discount_percentage })}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-600 font-bold rounded-full text-xs hover:bg-orange-100 transition"
                          >
                            <Percent className="w-3 h-3" />{sp.discount_percentage}%
                          </button>
                        )}
                      </td>

                      {/* Sale category badge */}
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${sp.saleActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {sp.saleTitle}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setEditing({ saleId: sp.saleId, productId: sp.product_id, discount: sp.discount_percentage })}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit discount"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromSale(sp.saleId, sp.product_id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Remove from sale"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* ── Add to Sale Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#FF6B35]" /> Add Product to Sale
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Sale category picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sale Category *</label>
                <select
                  value={addForm.saleId}
                  onChange={(e) => setAddForm((f) => ({ ...f, saleId: e.target.value, productId: '' }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B35] bg-white transition"
                >
                  <option value="">Select a sale…</option>
                  {saleCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}{!c.is_active ? ' (Inactive)' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Product search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product *</label>
                <div className="relative" data-dd="prod">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setAddForm((f) => ({ ...f, productId: '' }));
                      setShowProductDrop(true);
                    }}
                    onFocus={() => setShowProductDrop(true)}
                    placeholder="Search products…"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B35] transition"
                  />
                  {showProductDrop && (
                    <div className="absolute top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-48 overflow-y-auto z-30">
                      {availableProducts.length > 0 ? (
                        availableProducts.map((p) => (
                          <button
                            key={p.id || p._id}
                            type="button"
                            onClick={() => {
                              setAddForm((f) => ({ ...f, productId: p.id || p._id }));
                              setProductSearch(p.name);
                              setShowProductDrop(false);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-orange-50 flex items-center gap-3 text-sm transition"
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                              {p.imageUrl
                                ? <img src={getImageUrl(p.imageUrl)} alt="" className="w-full h-full object-cover" />
                                : <Package className="w-4 h-4 m-2 text-gray-300" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{p.name}</p>
                              <p className="text-xs text-gray-400">Rs. {p.price?.toLocaleString()}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="p-4 text-sm text-gray-400 text-center">
                          {addForm.saleId ? 'No more products to add' : 'Select a sale category first'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {addForm.productId && (
                  <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
                    <Check className="w-3 h-3" /> {getProduct(addForm.productId)?.name} selected
                  </p>
                )}
              </div>

              {/* Discount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Discount % *</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={addForm.discount_percentage}
                    onChange={(e) => setAddForm((f) => ({ ...f, discount_percentage: e.target.value }))}
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B35] transition"
                  />
                  <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {addForm.productId && Number(addForm.discount_percentage) > 0 && (() => {
                  const p = getProduct(addForm.productId);
                  if (!p?.price) return null;
                  const sale = Math.round(p.price * (1 - Number(addForm.discount_percentage) / 100));
                  return (
                    <p className="mt-1 text-xs text-gray-500">
                      Rs. {p.price.toLocaleString()} →{' '}
                      <span className="font-semibold text-orange-600">Rs. {sale.toLocaleString()}</span>
                    </p>
                  );
                })()}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={addToSale}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#FF6B35] hover:bg-orange-500 text-white font-bold rounded-xl text-sm transition disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding…</> : <><Plus className="w-4 h-4" /> Add to Sale</>}
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
