// src/store/categoryStore.js
import { create } from 'zustand';
import { categoryApi } from '../api/categoryai';

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await categoryApi.getAll();
      // Handle both direct array and wrapped response
      const data = res.data?.data || res.data || [];
      set({ categories: Array.isArray(data) ? data : [] });
    } catch (err) {
      console.error('❌ Error fetching categories:', err);
      set({ error: 'Failed to load categories', categories: [] });
    } finally {
      set({ loading: false });
    }
  },

  addCategory: async (data) => {
    set({ loading: true });
    try {
      const res = await categoryApi.create(data);
      console.log('📦 API Response:', res);
      console.log('📦 Response data:', res.data);
      // Handle both direct data and wrapped response
      const category = res.data?.data || res.data;
      console.log('📦 Parsed category:', category);
      console.log('📸 Category imageUrl:', category?.imageUrl ? `Present (${String(category.imageUrl).substring(0, 50)}...)` : 'NULL/UNDEFINED');
      if (category) {
        console.log('➕ Adding category to store:', category);
        set((state) => ({ categories: [...state.categories, category] }));
      }
      return category;
    } catch (err) {
      console.error('❌ Error adding category:', err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateCategory: async (id, data) => {
    set({ loading: true });
    try {
      const res = await categoryApi.update(id, data);
      // Handle both direct data and wrapped response
      const category = res.data?.data || res.data;
      if (category) {
        set((state) => ({
          categories: state.categories.map((c) => ((c.id || c._id) === id ? category : c)),
        }));
      }
      return category;
    } catch (err) {
      console.error('❌ Error updating category:', err);
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true });
    try {
      const res = await categoryApi.remove(id);
      console.log('🗑️ Delete response:', res);
      set((state) => ({ categories: state.categories.filter((c) => (c.id || c._id) !== id) }));
      return res;
    } catch (err) {
      console.error('❌ Error deleting category:', err);
      set({ error: err.message || 'Failed to delete category' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));