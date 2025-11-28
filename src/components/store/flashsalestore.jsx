// src/store/flashSaleStore.js
import { create } from 'zustand';
import { flashSaleApi } from '../api/flashsaleapi';

export const useFlashSaleStore = create((set) => ({
  flashSales: [],
  loading: false,
  error: null,

  fetchFlashSales: async () => {
    set({ loading: true, error: null });
    try {
      const res = await flashSaleApi.getAll();
      const data = res.data?.data || res.data || [];
      set({ flashSales: Array.isArray(data) ? data : [] });
      console.log('🔥 Flash sales fetched:', { count: Array.isArray(data) ? data.length : 0 });
    } catch (err) {
      console.error('❌ Error fetching flash sales:', err);
      set({ error: 'Failed to load flash sales', flashSales: [] });
    } finally {
      set({ loading: false });
    }
  },

  addFlashSale: async (data) => {
    set({ loading: true });
    try {
      const res = await flashSaleApi.create(data);
      const flashSale = res.data?.data || res.data;
      console.log('✅ Flash sale created:', flashSale);
      set((state) => ({ flashSales: [...state.flashSales, flashSale] }));
      return flashSale;
    } catch (err) {
      console.error('❌ Error adding flash sale:', err);
      set({ error: err.message || 'Failed to create flash sale' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateFlashSale: async (id, data) => {
    set({ loading: true });
    try {
      const res = await flashSaleApi.update(id, data);
      const flashSale = res.data?.data || res.data;
      console.log('✏️ Flash sale updated:', flashSale);
      set((state) => ({
        flashSales: state.flashSales.map((s) => ((s.id || s._id) === id ? flashSale : s)),
      }));
      return flashSale;
    } catch (err) {
      console.error('❌ Error updating flash sale:', err);
      set({ error: err.message || 'Failed to update flash sale' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteFlashSale: async (id) => {
    set({ loading: true });
    try {
      await flashSaleApi.remove(id);
      console.log('🗑️ Flash sale deleted:', id);
      set((state) => ({ flashSales: state.flashSales.filter((s) => (s.id || s._id) !== id) }));
    } catch (err) {
      console.error('❌ Error deleting flash sale:', err);
      set({ error: err.message || 'Failed to delete flash sale' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));