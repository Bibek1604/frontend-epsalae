import { useState, useEffect } from 'react';
import { useFlashSaleStore } from '../store/flashSalestore';
import { useProductStore } from '../store/productstore';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit, Trash2, Zap, Loader2, Search, X, Check, Clock } from 'lucide-react';

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

  // Load data on mount
  useEffect(() => {
    fetchFlashSales();
    if (products.length === 0) fetchProducts();
  }, []);

  // Form change handler
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Save flash sale
  const handleSave = async () => {
    // Validate all required fields
    if (!form.productId) {
      toast.error('Please select a product');
      return;
    }
    if (!form.flashPrice || parseFloat(form.flashPrice) <= 0) {
      toast.error('Please enter a valid flash price');
      return;
    }
    if (!form.maxStock || parseInt(form.maxStock) <= 0) {
      toast.error('Please enter a valid max stock (must be > 0)');
      return;
    }
    if (!form.startTime) {
      toast.error('Please select a start time');
      return;
    }
    if (!form.endTime) {
      toast.error('Please select an end time');
      return;
    }
    if (new Date(form.startTime) >= new Date(form.endTime)) {
      toast.error('End time must be after start time');
      return;
    }

    try {
      const flashSaleData = {
        productId: form.productId,
        flashPrice: parseFloat(form.flashPrice),
        currentStock: parseInt(form.currentStock) || 0,
        maxStock: parseInt(form.maxStock),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        isActive: form.isActive,
      };

      if (editingFlashSale) {
        await updateFlashSale(editingFlashSale.id || editingFlashSale._id, flashSaleData);
        toast.success('Flash sale updated successfully');
      } else {
        await addFlashSale(flashSaleData);
        toast.success('Flash sale created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchFlashSales();
    } catch (error) {
      toast.error(error.message || 'Failed to save flash sale');
    }
  };

  // Delete flash sale
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this flash sale?')) return;

    try {
      await deleteFlashSale(id);
      toast.success('Flash sale deleted successfully');
      fetchFlashSales();
    } catch {
      toast.error('Failed to delete flash sale');
    }
  };

  // Edit flash sale
  const handleEdit = (flashSale) => {
    setEditingFlashSale(flashSale);
    setForm({
      productId: flashSale.productId,
      flashPrice: flashSale.flashPrice,
      maxStock: flashSale.maxStock,
      startTime: new Date(flashSale.startTime).toISOString().slice(0, 16),
      endTime: new Date(flashSale.endTime).toISOString().slice(0, 16),
      isActive: flashSale.isActive || true,
    });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setForm(defaultForm);
    setProductSearch('');
    setShowProductDropdown(false);
    setEditingFlashSale(null);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  // Filter products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filter flash sales (ensure flashSales is an array)
  const flashSalesArray = Array.isArray(flashSales) ? flashSales : [];
  const filteredFlashSales = flashSalesArray.filter((fs) => {
    const product = products.find((p) => (p.id || p._id) === fs.productId);
    return product?.name.toLowerCase().includes(search.toLowerCase());
  });

  // Get product name
  const getProductName = (productId) => {
    return products.find((p) => (p.id || p._id) === productId)?.name || 'Unknown Product';
  };

  // Check if flash sale is active
  const isFlashSaleActive = (startTime, endTime) => {
    const now = new Date();
    return new Date(startTime) <= now && now <= new Date(endTime);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Zap className="text-yellow-400" size={36} />
          Flash Sales Management
        </h1>
        <p className="text-gray-400">Create and manage limited-time flash sales</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search flash sales by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none transition"
          />
        </div>

        {/* Add Button */}
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <Plus size={20} />
          Create Flash Sale
        </button>
      </div>

      {/* Flash Sales Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
            <span className="ml-3 text-gray-300">Loading flash sales...</span>
          </div>
        ) : filteredFlashSales.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Zap className="mx-auto text-gray-500 mb-3" size={48} />
            <p className="text-gray-400 text-lg">No flash sales yet</p>
          </div>
        ) : (
          filteredFlashSales.map((flashSale) => (
            <div
              key={flashSale.id || flashSale._id}
              className="bg-gradient-to-br from-yellow-900 via-gray-800 to-gray-800 rounded-lg border-2 border-yellow-600 shadow-lg overflow-hidden hover:shadow-xl transition"
            >
              {/* Header with Status Badge */}
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap size={24} className="text-white" />
                    <h3 className="text-xl font-bold text-white">{getProductName(flashSale.productId)}</h3>
                  </div>
                  {isFlashSaleActive(flashSale.startTime, flashSale.endTime) ? (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                      LIVE
                    </span>
                  ) : (
                    <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      SCHEDULED
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Price Section */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-gray-300 text-sm mb-1">Flash Price</p>
                  <p className="text-3xl font-bold text-yellow-400">Rs. {flashSale.flashPrice.toFixed(2)}</p>
                </div>

                {/* Stock Section */}
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-gray-300 text-xs mb-1">Available Stock</p>
                  <p className="text-2xl font-bold text-blue-400">{flashSale.maxStock} units</p>
                </div>

                {/* Time Section */}
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-300 text-sm mb-2">
                    <Clock size={16} />
                    Duration
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(flashSale.startTime).toLocaleString()} to{' '}
                    {new Date(flashSale.endTime).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 border-t border-gray-700 flex gap-2">
                <button
                  onClick={() => handleEdit(flashSale)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition font-semibold"
                >
                  <Edit size={18} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(flashSale.id || flashSale._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-semibold"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-screen overflow-y-auto border border-gray-700">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-yellow-600 to-orange-600 px-6 py-4 flex items-center justify-between border-b border-gray-700 z-10">
              <h2 className="text-2xl font-bold text-white">
                {editingFlashSale ? 'Edit Flash Sale' : 'Create Flash Sale'}
              </h2>
              <button
                onClick={closeModal}
                className="text-white hover:bg-yellow-700 p-2 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Product Selection */}
              <div>
                <label className="block text-white font-semibold mb-2">Select Product * {form.productId && <span className="text-green-400 text-sm">(✓ Selected)</span>}</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type to search or click to see all products..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setShowProductDropdown(true);
                    }}
                    onFocus={() => setShowProductDropdown(true)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none transition"
                  />
                  {showProductDropdown && (
                    <div className="absolute top-full mt-1 w-full bg-gray-700 rounded-lg border border-gray-600 max-h-48 overflow-y-auto z-20 shadow-lg">
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <button
                            key={product.id || product._id}
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({ ...prev, productId: product.id || product._id }));
                              setProductSearch(product.name);
                              setShowProductDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-3 transition text-white border-b border-gray-600 last:border-b-0 ${
                              (form.productId === product.id || form.productId === product._id)
                                ? 'bg-yellow-600 font-semibold'
                                : 'hover:bg-gray-600'
                            }`}
                          >
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-300">Price: Rs. {product.price?.toFixed(2)}</div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-300 text-center">No products found</div>
                      )}
                    </div>
                  )}
                </div>
                {form.productId && (
                  <p className="text-green-400 text-sm mt-2">✓ Selected: {getProductName(form.productId)}</p>
                )}
              </div>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Flash Price */}
                <div>
                  <label className="block text-white font-semibold mb-2">Flash Price (Rs.) *</label>
                  <input
                    type="number"
                    name="flashPrice"
                    value={form.flashPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none transition"
                  />
                </div>

                {/* Max Stock */}
                <div>
                  <label className="block text-white font-semibold mb-2">Max Stock *</label>
                  <input
                    type="number"
                    name="maxStock"
                    value={form.maxStock}
                    onChange={handleChange}
                    placeholder="0"
                    min="1"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Time Fields - Full Width */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Time */}
                <div>
                  <label className="block text-white font-semibold mb-2">Start Time *</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={form.startTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none transition"
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-white font-semibold mb-2">End Time *</label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={form.endTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Active Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded bg-gray-700 border border-gray-600 cursor-pointer"
                />
                <span className="text-white">Active</span>
              </label>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-700 border-t border-gray-600 px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                {editingFlashSale ? 'Update Flash Sale' : 'Create Flash Sale'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}