// src/components/store/bannerstore.jsx
import { create } from 'zustand';
import { bannerApi } from '../api/bannerapi';

export const useBannerStore = create((set) => ({
  banners: [],
  loading: false,
  error: null,

  fetchBanners: async () => {
    set({ loading: true, error: null });
    try {
      const res = await bannerApi.getAll();
      const data = res.data?.data || res.data || [];
      const banners = Array.isArray(data) ? data : [];
      console.log('🎨 Banners fetched:', { count: banners.length });
      set({ banners });
    } catch (err) {
      console.error('❌ Error fetching banners:', err);
      set({ error: err.response?.data?.message || 'Failed to load banners' });
    } finally {
      set({ loading: false });
    }
  },

  addBanner: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await bannerApi.create(data);
      const newBanner = res.data?.data || res.data;
      set((state) => ({
        banners: Array.isArray(state.banners) ? [...state.banners, newBanner] : [newBanner],
      }));
      return newBanner;
    } catch (err) {
      console.error('❌ Error adding banner:', err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateBanner: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await bannerApi.update(id, data);
      const updatedBanner = res.data?.data || res.data;
      set((state) => ({
        banners: state.banners.map((b) => ((b.id || b._id) === (id.id || id._id || id) ? updatedBanner : b)),
      }));
      return updatedBanner;
    } catch (err) {
      console.error('❌ Error updating banner:', err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteBanner: async (id) => {
    set({ loading: true, error: null });
    try {
      await bannerApi.remove(id);
      set((state) => ({ banners: state.banners.filter((b) => (b.id || b._id) !== (id.id || id._id || id)) }));
    } catch (err) {
      console.error('❌ Error deleting banner:', err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));