// src/pages/FlashSaleCRUD.jsx
import { useState, useEffect } from 'react';
import { useFlashSaleStore } from '../store/flashsalestore';
import { useProductStore } from '../store/productstore';
import toast, { Toaster } from 'react-hot-toast';
import {
  Plus, Edit2, Trash2, Zap, Loader2, Search, X,
  Clock, CheckCircle, AlertCircle, Calendar, Package
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
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      toast.error(err.message || 'Failed to save');
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

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 to-gray-100 lg:p-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-6 mb-10 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-5xl font-bold text-[#1A3C8A] mb-2 flex items-center gap-4">
                <Zap className="w-12 h-12 text-[#FF6B35]" />
                Flash Sales
              </h1>
              <p className="text-[#7A7A7A]">Create limited-time lightning deals</p>
            </div>
            <button
              onClick={closeModal}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              <Plus className="w-6 h-6" />
              New Flash Sale
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#7A7A7A]" />
            <input
              type="text"
              placeholder="Search by product name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-16 pr-8 py-5 bg-white rounded-2xl shadow-lg border border-[#EFEFEF] focus:border-[#FF6B35] focus:outline-none text-lg transition"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-16 h-16 animate-spin text-[#FF6B35]" />
            </div>
          ) : filteredFlashSales.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl border border-[#EFEFEF]">
              <Zap className="w-24 h-24 text-[#FF6B35]/20 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-[#2E2E2E]">No flash sales</h3>
              <p className="text-[#7A7A7A] mt-2">Create a lightning deal!</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-[#EFEFEF] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] text-white">
                      <th className="px-8 py-6 font-bold text-left">Product</th>
                      <th className="px-8 py-6 font-bold text-center">Original Price</th>
                      <th className="px-8 py-6 font-bold text-center">Flash Price</th>
                      <th className="px-8 py-6 font-bold text-center">Stock</th>
                      <th className="px-8 py-6 font-bold text-center">Duration</th>
                      <th className="px-8 py-6 font-bold text-center">Status</th>
                      <th className="px-8 py-6 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFlashSales.map((fs, i) => {
                      const product = getProduct(fs.productId);
                      const status = getStatus(fs);
                      return (
                        <tr
                          key={fs._id || fs.id}
                          className={`border-b border-gray-100 hover:bg-orange-50/30 transition-all ${i % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}
                        >
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              {product?.imageUrl ? (
                                <img src={getImageUrl(product.imageUrl)} alt={product.name} className="object-cover shadow w-14 h-14 rounded-xl" />
                              ) : (
                                <div className="flex items-center justify-center bg-gray-200 w-14 h-14 rounded-xl">
                                  <Package className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="font-bold text-[#2E2E2E]">{product?.name || '—'}</p>
                                <p className="text-sm text-[#7A7A7A]">{product?.category?.name || 'Uncategorized'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-center text-gray-500 line-through">
                            Rs. {product?.price?.toLocaleString()}
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className="text-2xl font-bold text-[#FF6B35]">
                              Rs. {Number(fs.flashPrice).toLocaleString()}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-center font-bold text-[#1A3C8A]">
                            {fs.maxStock} units
                          </td>
                          <td className="px-8 py-6 text-center text-sm text-[#7A7A7A]">
                            {new Date(fs.startTime).toLocaleString('en-NP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} <br />
                            → {new Date(fs.endTime).toLocaleString('en-NP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm
                              ${status.color === 'emerald' ? 'bg-emerald-100 text-emerald-700 animate-pulse' :
                                status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                status.color === 'red' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-600'}`}
                            >
                              {status.pulse && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
                              {status.label}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => handleEdit(fs)}
                                className="p-3 bg-[#1A3C8A] text-white rounded-xl hover:bg-[#163180] transition shadow-md"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(fs._id || fs.id)}
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

      {/* PREMIUM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1A3C8A] to-[#FF6B35] text-white p-8 rounded-t-3xl relative">
              <button
                onClick={closeModal}
                className="absolute p-2 transition rounded-full top-6 right-6 bg-white/20 hover:bg-white/30"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="flex items-center gap-3 text-3xl font-bold">
                <Zap className="w-10 h-10" />
                {editingFlashSale ? 'Edit' : 'Create'} Flash Sale
              </h2>
            </div>

            <div className="p-8 space-y-7">
              {/* Product Selector */}
              <div>
                <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Select Product *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowProductDropdown(true);
                    }}
                    onFocus={() => setShowProductDropdown(true)}
                    className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition"
                  />
                  {showProductDropdown && (
                    <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-[#EFEFEF] max-h-64 overflow-y-auto z-30">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map(p => (
                          <button
                            key={p._id || p.id}
                            type="button"
                            onClick={() => {
                              setForm(prev => ({ ...prev, productId: p._id || p.id }));
                              setProductSearch(p.name);
                              setShowProductDropdown(false);
                            }}
                            className={`w-full text-left p-4 hover:bg-orange-50 transition flex items-center gap-4 ${form.productId === (p._id || p.id) ? 'bg-[#FF6B35]/10' : ''}`}
                          >
                            {p.imageUrl ? (
                              <img src={getImageUrl(p.imageUrl)} alt="" className="object-cover w-12 h-12 rounded-lg" />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                            )}
                            <div>
                              <p className="font-medium">{p.name}</p>
                              <p className="text-sm text-gray-600">Rs. {p.price}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">No products found</div>
                      )}
                    </div>
                  )}
                </div>
                {form.productId && (
                  <p className="flex items-center gap-2 mt-3 font-medium text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                    Selected: {getProduct(form.productId)?.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Flash Price (Rs.) *</label>
                  <input
                    type="number"
                    name="flashPrice"
                    value={form.flashPrice}
                    onChange={handleChange}
                    placeholder="2999"
                    step="0.01"
                    className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Max Stock *</label>
                  <input
                    type="number"
                    name="maxStock"
                    value={form.maxStock}
                    onChange={handleChange}
                    placeholder="50"
                    min="1"
                    className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">Start Time *</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-[#2E2E2E] mb-3">End Time *</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className="w-full px-6 py-4 border-2 border-[#EFEFEF] rounded-2xl focus:border-[#FF6B35] transition"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-4">
                <input
                  type="checkbox"
                  id="active"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-6 h-6 text-[#FF6B35] rounded focus:ring-[#FF6B35]"
                />
                <label htmlFor="active" className="text-lg font-medium cursor-pointer">
                  Flash sale is Active
                </label>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 py-5 bg-gradient-to-r from-[#FF6B35] to-orange-600 text-white text-xl font-bold rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all disabled:opacity-70"
                >
                  {editingFlashSale ? 'Update Flash Sale' : 'Create Flash Sale'}
                </button>
                <button
                  onClick={closeModal}
                  className="px-10 py-5 font-bold text-gray-700 transition border-2 border-gray-300 rounded-2xl hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}