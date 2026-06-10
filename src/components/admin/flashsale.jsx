import { useState, useEffect, useCallback } from 'react';
import { useFlashSaleStore } from '../store/flashsalestore';
import { useProductStore } from '../store/productstore';
import toast from 'react-hot-toast';
import {
  Plus, Edit2, Trash2, Zap, Loader2, Search, X,
  CheckCircle, Package, Clock, AlertTriangle, ListChecks,
} from 'lucide-react';
import { getImageUrl } from '@/config';

// ── Countdown helper ──────────────────────────────────────────────────────────
function useCountdownTick() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
}

function formatCountdown(targetDate) {
  const diff = new Date(targetDate) - Date.now();
  if (diff <= 0) return '00:00:00';
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

// ── Status derivation ─────────────────────────────────────────────────────────
function getStatus(fs) {
  const now   = Date.now();
  const start = new Date(fs.startTime).getTime();
  const end   = new Date(fs.endTime).getTime();
  if (!fs.isActive)            return { label: 'Inactive',  color: 'gray' };
  if (now < start)             return { label: 'Upcoming',  color: 'blue' };
  if (now >= start && now < end) return { label: 'Active',  color: 'emerald', live: true };
  return                              { label: 'Ended',     color: 'red' };
}

// ── Overlap check ─────────────────────────────────────────────────────────────
function hasOverlap(flashSales, productId, startTime, endTime, excludeId = null) {
  const newStart = new Date(startTime).getTime();
  const newEnd   = new Date(endTime).getTime();
  return flashSales.some((fs) => {
    if (excludeId && (fs._id || fs.id) === excludeId) return false;
    if (fs.productId !== productId) return false;
    const fsStart = new Date(fs.startTime).getTime();
    const fsEnd   = new Date(fs.endTime).getTime();
    return newStart < fsEnd && newEnd > fsStart;
  });
}

// ── Default form values ───────────────────────────────────────────────────────
const DEFAULT_FORM = {
  productId: '', flashPrice: '', maxStock: '',
  startTime: '', endTime: '', isActive: true,
};

const DEFAULT_BULK = {
  productIds:   [],
  discountPct:  20,
  maxStock:     50,
  startTime:    '',
  endTime:      '',
  isActive:     true,
};

export default function FlashSaleCRUD() {
  const {
    flashSales, loading,
    fetchFlashSales, addFlashSale, updateFlashSale, deleteFlashSale,
  } = useFlashSaleStore();
  const { products, fetchProducts } = useProductStore();

  // ── List search ───────────────────────────────────────────────────────────
  const [search, setSearch] = useState('');

  // ── Single-sale modal ─────────────────────────────────────────────────────
  const [showModal,        setShowModal]        = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState(null);
  const [form,             setForm]             = useState(DEFAULT_FORM);
  const [productSearch,    setProductSearch]    = useState('');
  const [showProductDrop,  setShowProductDrop]  = useState(false);

  // ── Bulk-add modal ────────────────────────────────────────────────────────
  const [showBulkModal,  setShowBulkModal]  = useState(false);
  const [bulkForm,       setBulkForm]       = useState(DEFAULT_BULK);
  const [bulkSearch,     setBulkSearch]     = useState('');
  const [bulkSaving,     setBulkSaving]     = useState(false);

  // Tick so countdown re-renders every second
  useCountdownTick();

  useEffect(() => {
    fetchFlashSales();
    fetchProducts({ limit: 500 });
  }, []);

  const getProduct = useCallback(
    (id) => products.find((p) => (p._id || p.id) === id),
    [products],
  );

  // ── Single save ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.productId)                                          return toast.error('Select a product');
    if (!form.flashPrice || parseFloat(form.flashPrice) <= 0)    return toast.error('Valid flash price required');
    if (!form.maxStock   || parseInt(form.maxStock)    <= 0)      return toast.error('Max stock must be > 0');
    if (!form.startTime  || !form.endTime)                        return toast.error('Both dates required');
    if (new Date(form.startTime) >= new Date(form.endTime))       return toast.error('End time must be after start time');

    const excludeId = editingFlashSale?._id || editingFlashSale?.id;
    if (hasOverlap(Array.isArray(flashSales) ? flashSales : [], form.productId, form.startTime, form.endTime, excludeId)) {
      return toast.error('This product already has a flash sale overlapping these dates');
    }

    try {
      const payload = {
        productId:  form.productId,
        flashPrice: parseFloat(form.flashPrice),
        maxStock:   parseInt(form.maxStock),
        startTime:  new Date(form.startTime).toISOString(),
        endTime:    new Date(form.endTime).toISOString(),
        isActive:   form.isActive,
      };
      if (editingFlashSale) {
        await updateFlashSale(excludeId, payload);
        toast.success('Flash sale updated!');
      } else {
        await addFlashSale(payload);
        toast.success('Flash sale created!');
      }
      closeModal();
      fetchFlashSales();
    } catch (err) {
      toast.error(err?.message || 'Failed to save flash sale');
    }
  };

  const handleEdit = (fs) => {
    setEditingFlashSale(fs);
    setForm({
      productId:  fs.productId,
      flashPrice: fs.flashPrice,
      maxStock:   fs.maxStock,
      startTime:  new Date(fs.startTime).toISOString().slice(0, 16),
      endTime:    new Date(fs.endTime).toISOString().slice(0, 16),
      isActive:   fs.isActive ?? true,
    });
    const product = products.find((p) => (p._id || p.id) === fs.productId);
    if (product) setProductSearch(product.name);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this flash sale?')) return;
    try { await deleteFlashSale(id); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFlashSale(null);
    setForm(DEFAULT_FORM);
    setProductSearch('');
    setShowProductDrop(false);
  };

  // ── Bulk save ─────────────────────────────────────────────────────────────
  const handleBulkSave = async () => {
    if (bulkForm.productIds.length === 0) return toast.error('Select at least one product');
    if (!bulkForm.startTime || !bulkForm.endTime) return toast.error('Both dates required');
    if (new Date(bulkForm.startTime) >= new Date(bulkForm.endTime))
      return toast.error('End time must be after start time');

    const allFlash = Array.isArray(flashSales) ? flashSales : [];
    const overlapping = bulkForm.productIds.filter((id) =>
      hasOverlap(allFlash, id, bulkForm.startTime, bulkForm.endTime)
    );
    if (overlapping.length > 0) {
      const names = overlapping
        .map((id) => getProduct(id)?.name ?? id)
        .join(', ');
      return toast.error(`Overlap conflict for: ${names}`);
    }

    setBulkSaving(true);
    let successCount = 0;
    for (const productId of bulkForm.productIds) {
      const product = getProduct(productId);
      if (!product?.price) continue;
      const flashPrice = Math.round(product.price * (1 - bulkForm.discountPct / 100));
      try {
        await addFlashSale({
          productId,
          flashPrice,
          maxStock:  parseInt(bulkForm.maxStock) || 50,
          startTime: new Date(bulkForm.startTime).toISOString(),
          endTime:   new Date(bulkForm.endTime).toISOString(),
          isActive:  bulkForm.isActive,
        });
        successCount++;
      } catch {
        toast.error(`Failed to add ${product.name}`);
      }
    }
    setBulkSaving(false);
    if (successCount > 0) {
      toast.success(`${successCount} flash sale(s) created!`);
      fetchFlashSales();
    }
    closeBulkModal();
  };

  const closeBulkModal = () => {
    setShowBulkModal(false);
    setBulkForm(DEFAULT_BULK);
    setBulkSearch('');
  };

  const toggleBulkProduct = (id) =>
    setBulkForm((f) => ({
      ...f,
      productIds: f.productIds.includes(id)
        ? f.productIds.filter((x) => x !== id)
        : [...f.productIds, id],
    }));

  // ── Derived lists ─────────────────────────────────────────────────────────
  const allFlash = Array.isArray(flashSales) ? flashSales : [];

  const filteredFlashSales = allFlash.filter((fs) => {
    const product = getProduct(fs.productId);
    return product?.name?.toLowerCase().includes(search.toLowerCase());
  });

  const filteredBulkProducts = products.filter((p) =>
    !bulkSearch || p.name?.toLowerCase().includes(bulkSearch.toLowerCase())
  );

  const filteredSingleProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const liveCount      = allFlash.filter((fs) => getStatus(fs).live).length;
  const scheduledCount = allFlash.filter((fs) => getStatus(fs).label === 'Upcoming').length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Flash Sales</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create limited-time lightning deals</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBulkModal(true)}
            className="border border-[#FF6B35] text-[#FF6B35] hover:bg-orange-50 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
          >
            <ListChecks size={16} /> Bulk Add
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#FF6B35] hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
          >
            <Plus size={16} /> New Flash Sale
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Total',     value: allFlash.length,  icon: Zap,         bg: 'bg-orange-50',  color: 'text-[#FF6B35]' },
          { label: 'Live Now',  value: liveCount,        icon: CheckCircle, bg: 'bg-emerald-50', color: 'text-emerald-600' },
          { label: 'Upcoming',  value: scheduledCount,   icon: Clock,       bg: 'bg-blue-50',    color: 'text-[#1A3C8A]' },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-lg font-bold text-gray-800">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">All Flash Sales</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none w-56"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
          </div>
        ) : filteredFlashSales.length === 0 ? (
          <div className="text-center py-16">
            <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-600">No flash sales</p>
            <p className="text-sm text-gray-400 mt-1">Create a lightning deal!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-5 py-3 text-left">Product</th>
                  <th className="px-5 py-3 text-center">Original</th>
                  <th className="px-5 py-3 text-center">Flash Price</th>
                  <th className="px-5 py-3 text-center">Stock</th>
                  <th className="px-5 py-3 text-center">Duration</th>
                  <th className="px-5 py-3 text-center">Status</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredFlashSales.map((fs) => {
                  const product = getProduct(fs.productId);
                  const status  = getStatus(fs);
                  return (
                    <tr key={fs._id || fs.id} className="hover:bg-gray-50 transition-colors">
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product?.imageUrl ? (
                            <img
                              src={getImageUrl(product.imageUrl)} alt={product.name}
                              className="object-cover w-10 h-10 rounded-lg shrink-0"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg shrink-0">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">{product?.name || '—'}</p>
                            <p className="text-xs text-gray-400">{product?.category?.name || 'Uncategorized'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Original price */}
                      <td className="px-5 py-4 text-center text-xs text-gray-400 line-through">
                        Rs. {product?.price?.toLocaleString()}
                      </td>

                      {/* Flash price */}
                      <td className="px-5 py-4 text-center font-bold text-[#FF6B35]">
                        Rs. {Number(fs.flashPrice).toLocaleString()}
                        {product?.price && (
                          <p className="text-[10px] text-emerald-600 font-normal mt-0.5">
                            {Math.round((1 - fs.flashPrice / product.price) * 100)}% off
                          </p>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4 text-center font-semibold text-[#1A3C8A] text-xs">
                        {fs.maxStock} units
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4 text-center text-xs text-gray-500">
                        <span>
                          {new Date(fs.startTime).toLocaleString('en-NP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <br />
                        <span className="text-gray-400">→ </span>
                        <span>
                          {new Date(fs.endTime).toLocaleString('en-NP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      {/* Status + countdown */}
                      <td className="px-5 py-4 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          status.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                          status.color === 'blue'    ? 'bg-blue-100 text-blue-700' :
                          status.color === 'red'     ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {status.live && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          )}
                          {status.label}
                        </span>
                        {/* Countdown for live sales */}
                        {status.live && (
                          <p className="text-[10px] text-emerald-600 font-mono mt-1">
                            {formatCountdown(fs.endTime)} left
                          </p>
                        )}
                        {/* Starts-in for upcoming */}
                        {status.label === 'Upcoming' && (
                          <p className="text-[10px] text-blue-500 font-mono mt-1">
                            starts in {formatCountdown(fs.startTime)}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(fs)}
                            className="bg-[#1A3C8A] hover:bg-blue-900 text-white px-3 py-1.5 rounded-lg text-sm transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(fs._id || fs.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                          >
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

      {/* ── Single Flash Sale Modal ───────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF6B35]" />
                {editingFlashSale ? 'Edit' : 'Create'} Flash Sale
              </h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100 transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Product Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Product *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products…"
                    value={productSearch}
                    onChange={(e) => { setProductSearch(e.target.value); setShowProductDrop(true); }}
                    onFocus={() => setShowProductDrop(true)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm"
                  />
                  {showProductDrop && (
                    <div className="absolute top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-56 overflow-y-auto z-30">
                      {filteredSingleProducts.length > 0 ? (
                        filteredSingleProducts.map((p) => (
                          <button
                            key={p._id || p.id}
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({ ...prev, productId: p._id || p.id }));
                              setProductSearch(p.name);
                              setShowProductDrop(false);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition flex items-center gap-3 text-sm ${
                              form.productId === (p._id || p.id) ? 'bg-orange-50' : ''
                            }`}
                          >
                            {p.imageUrl ? (
                              <img src={getImageUrl(p.imageUrl)} alt="" className="object-cover w-8 h-8 rounded-lg shrink-0" />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                                <Package className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800">{p.name}</p>
                              <p className="text-xs text-gray-400">Rs. {p.price?.toLocaleString()}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-6 text-center text-sm text-gray-400">No products found</div>
                      )}
                    </div>
                  )}
                </div>
                {form.productId && (
                  <p className="flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Selected: {getProduct(form.productId)?.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Flash Price (Rs.) *</label>
                  <input
                    type="number" name="flashPrice" value={form.flashPrice} step="0.01" placeholder="2999"
                    onChange={(e) => setForm((f) => ({ ...f, flashPrice: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm"
                  />
                  {form.productId && form.flashPrice && getProduct(form.productId)?.price && (
                    <p className="mt-1 text-xs text-emerald-600">
                      {Math.round((1 - parseFloat(form.flashPrice) / getProduct(form.productId).price) * 100)}% off
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Stock *</label>
                  <input
                    type="number" name="maxStock" value={form.maxStock} min="1" placeholder="50"
                    onChange={(e) => setForm((f) => ({ ...f, maxStock: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Time *</label>
                  <input
                    type="datetime-local" value={form.startTime}
                    onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Time *</label>
                  <input
                    type="datetime-local" value={form.endTime}
                    onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-1">
                <input
                  type="checkbox" id="active" checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 text-[#FF6B35] rounded"
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Flash sale is Active
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave} disabled={loading}
                  className="flex-1 py-2.5 bg-[#FF6B35] hover:bg-orange-500 text-white font-bold rounded-xl text-sm transition disabled:opacity-70"
                >
                  {editingFlashSale ? 'Update Flash Sale' : 'Create Flash Sale'}
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

      {/* ── Bulk Add Modal ────────────────────────────────────────────────────── */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[#FF6B35]" />
                Bulk Add Flash Sales
              </h2>
              <button onClick={closeBulkModal} className="p-2 rounded-lg hover:bg-gray-100 transition">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">

              {/* Common settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Discount % (applied to each product's price)
                  </label>
                  <input
                    type="number" min="1" max="99"
                    value={bulkForm.discountPct}
                    onChange={(e) => setBulkForm((f) => ({ ...f, discountPct: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Stock per Product</label>
                  <input
                    type="number" min="1"
                    value={bulkForm.maxStock}
                    onChange={(e) => setBulkForm((f) => ({ ...f, maxStock: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Time *</label>
                  <input
                    type="datetime-local"
                    value={bulkForm.startTime}
                    onChange={(e) => setBulkForm((f) => ({ ...f, startTime: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Time *</label>
                  <input
                    type="datetime-local"
                    value={bulkForm.endTime}
                    onChange={(e) => setBulkForm((f) => ({ ...f, endTime: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox" id="bulkActive" checked={bulkForm.isActive}
                  onChange={(e) => setBulkForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 text-[#FF6B35] rounded"
                />
                <label htmlFor="bulkActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Activate sales immediately
                </label>
              </div>

              {/* Product selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Select Products *
                    {bulkForm.productIds.length > 0 && (
                      <span className="ml-2 text-xs font-normal text-[#FF6B35]">
                        {bulkForm.productIds.length} selected
                      </span>
                    )}
                  </label>
                  {bulkForm.productIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setBulkForm((f) => ({ ...f, productIds: [] }))}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={bulkSearch}
                    onChange={(e) => setBulkSearch(e.target.value)}
                    placeholder="Filter products…"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B35] transition"
                  />
                </div>

                {/* Product list with checkboxes */}
                <div className="border border-gray-200 rounded-xl max-h-60 overflow-y-auto">
                  {filteredBulkProducts.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-8">No products found</p>
                  ) : (
                    filteredBulkProducts.map((p) => {
                      const id      = p._id || p.id;
                      const checked = bulkForm.productIds.includes(id);
                      const flashPrice = p.price
                        ? Math.round(p.price * (1 - bulkForm.discountPct / 100))
                        : null;
                      // Warn if this product already has overlapping flash sale
                      const conflict = bulkForm.startTime && bulkForm.endTime
                        && hasOverlap(allFlash, id, bulkForm.startTime, bulkForm.endTime);

                      return (
                        <label
                          key={id}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition border-b border-gray-50 last:border-0 ${
                            checked ? 'bg-orange-50' : 'hover:bg-gray-50'
                          } ${conflict ? 'opacity-60' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={!!conflict}
                            onChange={() => !conflict && toggleBulkProduct(id)}
                            className="w-4 h-4 text-[#FF6B35] rounded"
                          />
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {p.imageUrl
                              ? <img src={getImageUrl(p.imageUrl)} alt="" className="w-full h-full object-cover" />
                              : <Package className="w-4 h-4 m-2.5 text-gray-300" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span className="line-through">Rs. {p.price?.toLocaleString()}</span>
                              {flashPrice && (
                                <span className="text-orange-600 font-semibold">
                                  → Rs. {flashPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          {conflict && (
                            <span className="text-[10px] text-amber-600 flex items-center gap-0.5 shrink-0">
                              <AlertTriangle className="w-3 h-3" /> Overlap
                            </span>
                          )}
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleBulkSave}
                  disabled={bulkSaving || bulkForm.productIds.length === 0}
                  className="flex-1 py-2.5 bg-[#FF6B35] hover:bg-orange-500 text-white font-bold rounded-xl text-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {bulkSaving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating…</>
                  ) : (
                    <><Zap className="w-4 h-4" /> Create {bulkForm.productIds.length} Flash Sale{bulkForm.productIds.length !== 1 ? 's' : ''}</>
                  )}
                </button>
                <button
                  onClick={closeBulkModal}
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
