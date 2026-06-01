// src/pages/FlashSaleCRUD.jsx
import { useState, useEffect } from 'react';
import { useFlashSaleStore } from '../store/flashsalestore';
import { useProductStore } from '../store/productstore';
import toast from 'react-hot-toast';
import {
  Plus, Edit2, Trash2, Zap, Loader2, Search, X,
  CheckCircle, Package
} from 'lucide-react';
import { getImageUrl } from '@/config';

export default function FlashSaleCRUD() {
  const { flashSales, loading, fetchFlashSales, addFlashSale, updateFlashSale, deleteFlashSale } = useFlashSaleStore();
  const { products, fetchProducts } = useProductStore();

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  const defaultForm = {
    productId: '',
    flashPrice: '',
    maxStock: '',
    startTime: '',
    endTime: '',
    isActive: true,
  };
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    fetchFlashSales();
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    if (!form.productId) return toast.error('Please select a product');
    if (!form.flashPrice || parseFloat(form.flashPrice) <= 0) return toast.error('Valid flash price required');
    if (!form.maxStock || parseInt(form.maxStock) <= 0) return toast.error('Max stock must be > 0');
    if (!form.startTime || !form.endTime) return toast.error('Both dates are required');
    if (new Date(form.startTime) >= new Date(form.endTime)) return toast.error('End time must be after start time');

    try {
      const payload = {
        productId: form.productId,
        flashPrice: parseFloat(form.flashPrice),
        maxStock: parseInt(form.maxStock),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        isActive: form.isActive,
      };
      console.log('📤 Saving flash sale with payload:', payload);

      if (editingFlashSale) {
        await updateFlashSale(editingFlashSale._id || editingFlashSale.id, payload);
        toast.success('Flash sale updated!');
      } else {
        await addFlashSale(payload);
        toast.success('Flash sale created!');
      }
      closeModal();
      fetchFlashSales();
    } catch (err) {
      console.error('❌ Flash sale save error:', err);
      toast.error(err.message || 'Failed to save flash sale');
    }
  };

  const handleEdit = (fs) => {
    setEditingFlashSale(fs);
    setForm({
      productId: fs.productId,
      flashPrice: fs.flashPrice,
      maxStock: fs.maxStock,
      startTime: new Date(fs.startTime).toISOString().slice(0, 16),
      endTime: new Date(fs.endTime).toISOString().slice(0, 16),
      isActive: fs.isActive ?? true,
    });
    const product = products.find(p => (p._id || p.id) === fs.productId);
    if (product) setProductSearch(product.name);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this flash sale?')) return;
    try {
      await deleteFlashSale(id);
      toast.success('Deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFlashSale(null);
    setForm(defaultForm);
    setProductSearch('');
    setShowProductDropdown(false);
  };

  const getProduct = (id) => products.find(p => (p._id || p.id) === id);

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredFlashSales = (Array.isArray(flashSales) ? flashSales : []).filter(fs => {
    const product = getProduct(fs.productId);
    return product?.name?.toLowerCase().includes(search.toLowerCase());
  });

  const getStatus = (fs) => {
    const now = new Date();
    const start = new Date(fs.startTime);
    const end = new Date(fs.endTime);
    if (!fs.isActive) return { label: 'Inactive', color: 'gray' };
    if (now < start) return { label: 'Scheduled', color: 'blue' };
    if (now >= start && now <= end) return { label: 'LIVE', color: 'emerald', pulse: true };
    return { label: 'Expired', color: 'red' };
  };

  const liveCount = (Array.isArray(flashSales) ? flashSales : []).filter(fs => getStatus(fs).color === 'emerald').length;
  const scheduledCount = (Array.isArray(flashSales) ? flashSales : []).filter(fs => getStatus(fs).color === 'blue').length;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Flash Sales</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create limited-time lightning deals</p>
        </div>
        <button
          onClick={() => { setShowModal(true); }}
          className="bg-[#FF6B35] hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> New Flash Sale
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#FF6B35]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-800">{flashSales?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Live Now</p>
              <p className="text-lg font-bold text-gray-800">{liveCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#1A3C8A]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Scheduled</p>
              <p className="text-lg font-bold text-gray-800">{scheduledCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">All Flash Sales</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
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
                  const status = getStatus(fs);
                  return (
                    <tr key={fs._id || fs.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product?.imageUrl ? (
                            <img src={getImageUrl(product.imageUrl)} alt={product.name}
                              className="object-cover w-10 h-10 rounded-lg flex-shrink-0"
                              onError={(e) => { e.target.style.display = 'none' }} />
                          ) : (
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-800">{product?.name || '—'}</p>
                            <p className="text-xs text-gray-400">{product?.category?.name || 'Uncategorized'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center text-xs text-gray-400 line-through">
                        Rs. {product?.price?.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-center font-bold text-[#FF6B35]">
                        Rs. {Number(fs.flashPrice).toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-center font-semibold text-[#1A3C8A] text-xs">
                        {fs.maxStock} units
                      </td>
                      <td className="px-5 py-4 text-center text-xs text-gray-500">
                        {new Date(fs.startTime).toLocaleString('en-NP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}<br />
                        → {new Date(fs.endTime).toLocaleString('en-NP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1
                          ${status.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                            status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                            status.color === 'red' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-600'}`}
                        >
                          {status.pulse && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(fs)} className="bg-[#1A3C8A] hover:bg-blue-900 text-white px-3 py-1.5 rounded-lg text-sm">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(fs._id || fs.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm">
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
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => { setProductSearch(e.target.value); setShowProductDropdown(true); }}
                    onFocus={() => setShowProductDropdown(true)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm"
                  />
                  {showProductDropdown && (
                    <div className="absolute top-full mt-1 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-56 overflow-y-auto z-30">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map(p => (
                          <button key={p._id || p.id} type="button"
                            onClick={() => { setForm(prev => ({ ...prev, productId: p._id || p.id })); setProductSearch(p.name); setShowProductDropdown(false); }}
                            className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition flex items-center gap-3 text-sm ${form.productId === (p._id || p.id) ? 'bg-orange-50' : ''}`}
                          >
                            {p.imageUrl ? (
                              <img src={getImageUrl(p.imageUrl)} alt="" className="object-cover w-8 h-8 rounded-lg flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0" />
                            )}
                            <div>
                              <p className="font-medium text-gray-800">{p.name}</p>
                              <p className="text-xs text-gray-400">Rs. {p.price}</p>
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
                  <input type="number" name="flashPrice" value={form.flashPrice} onChange={handleChange} placeholder="2999" step="0.01"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Stock *</label>
                  <input type="number" name="maxStock" value={form.maxStock} onChange={handleChange} placeholder="50" min="1"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Time *</label>
                  <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Time *</label>
                  <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:border-[#FF6B35] focus:outline-none text-sm" />
                </div>
              </div>

              <div className="flex items-center gap-3 py-1">
                <input type="checkbox" id="active" name="isActive" checked={form.isActive} onChange={handleChange}
                  className="w-4 h-4 text-[#FF6B35] rounded" />
                <label htmlFor="active" className="text-sm font-medium text-gray-700 cursor-pointer">Flash sale is Active</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={loading}
                  className="flex-1 py-2.5 bg-[#FF6B35] hover:bg-orange-500 text-white font-bold rounded-xl text-sm transition disabled:opacity-70">
                  {editingFlashSale ? 'Update Flash Sale' : 'Create Flash Sale'}
                </button>
                <button onClick={closeModal} className="px-6 py-2.5 font-semibold text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm transition">
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
