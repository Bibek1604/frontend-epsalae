// src/components/store/brandstore.jsx
// Brand store — backed by the backend /brands API (admin CRUD + public list).
// Previously brands lived in the admin's localStorage only, so customers
// never saw them. The UI-facing shape is kept as { id, name, logo }.
import { create } from 'zustand';
import api from '../api/base';        // admin client (token attached)
import publicApi from '../api/publicapi';

const toUi = (b) => ({ id: b.id, name: b.name || '', logo: b.imageUrl, createdAt: b.created_at });

// data: URLs (pasted/uploaded images) are sent as multipart files; http(s)
// URLs are passed through as imageUrl.
const toPayload = (brand) => {
  const fd = new FormData();
  if (brand.name !== undefined) fd.append('name', brand.name || '');
  const logo = brand.logo || '';
  if (logo.startsWith('data:image')) {
    const arr = logo.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    const u8 = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i);
    fd.append('image', new File([u8], 'brand-logo.png', { type: mime }));
  } else if (logo.startsWith('http')) {
    fd.append('imageUrl', logo);
  }
  return fd;
};

export const useBrandStore = create((set, get) => ({
  brands: [],
  loading: false,
  error: null,

  // Public storefront list (active brands)
  fetchBrands: async () => {
    set({ loading: true, error: null });
    try {
      const res = await publicApi.get('/brands');
      const data = res.data?.data || [];
      set({ brands: Array.isArray(data) ? data.map(toUi) : [] });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load brands' });
    } finally {
      set({ loading: false });
    }
  },

  // Admin list (includes inactive)
  fetchAllBrands: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get('/brands/all');
      const data = res.data?.data || [];
      set({ brands: Array.isArray(data) ? data.map(toUi) : [] });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to load brands' });
    } finally {
      set({ loading: false });
    }
  },

  addBrand: async (brand) => {
    const res = await api.post('/brands', toPayload(brand), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const created = toUi(res.data?.data || {});
    set((s) => ({ brands: [created, ...s.brands] }));
    return created;
  },

  updateBrand: async (id, updates) => {
    const res = await api.put(`/brands/${id}`, toPayload(updates), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const updated = toUi(res.data?.data || {});
    set((s) => ({ brands: s.brands.map((b) => (b.id === id ? updated : b)) }));
    return updated;
  },

  deleteBrand: async (id) => {
    await api.delete(`/brands/${id}`);
    set((s) => ({ brands: s.brands.filter((b) => b.id !== id) }));
  },

  // Delete every brand (admin "reset" button)
  resetBrands: async () => {
    const ids = get().brands.map((b) => b.id);
    for (const id of ids) {
      try { await api.delete(`/brands/${id}`); } catch (_) {}
    }
    set({ brands: [] });
  },

  getBrands: () => get().brands,
}));
