// src/store/productStore.js
import { create } from 'zustand';
import { productApi } from '../api/productapi';

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,
  pagination: null,

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await productApi.getAll(params);
      const data = res.data?.data || res.data || [];
      const pagination = res.data?.pagination || null;
      
      console.log('📦 Products fetched:', { count: data.length, pagination });
      // Log first product to see the FULL structure including category
      if (data.length > 0) {
        console.log('📦 FULL Product structure:', JSON.stringify(data[0], null, 2));
      }
      set({ products: Array.isArray(data) ? data : [], pagination });
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      set({ error: 'Failed to load products', products: [], pagination: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchProductsByCategory: async (categoryId, params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await productApi.getByCategory(categoryId, params);
      const data = res.data?.data || res.data || [];
      const pagination = res.data?.pagination || null;
      
      console.log('📦 Category products fetched:', { category: categoryId, count: data.length });
      set({ products: Array.isArray(data) ? data : [], pagination });
    } catch (err) {
      console.error('❌ Error fetching category products:', err);
      set({ error: 'Failed to load products', products: [], pagination: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchProductsWithOffers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await productApi.getWithOffers(params);
      const data = res.data?.data || res.data || [];
      const pagination = res.data?.pagination || null;
      
      console.log('🎉 Offer products fetched:', { count: data.length });
      set({ products: Array.isArray(data) ? data : [], pagination });
    } catch (err) {
      console.error('❌ Error fetching offer products:', err);
      set({ error: 'Failed to load products', products: [], pagination: null });
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (data) => {
    set({ loading: true });
    try {
      const res = await productApi.create(data);
      const product = res.data?.data || res.data;
      
      console.log('✅ Product created:', product);
      set((state) => ({ products: [...state.products, product] }));
      return product;
    } catch (err) {
      console.error('❌ Error adding product:', err);
      set({ error: err.message || 'Failed to create product' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id, data) => {
    set({ loading: true });
    try {
      console.log('✏️ Updating product with ID:', id);
      const res = await productApi.update(id, data);
      const updatedProduct = res.data?.data || res.data;
      
      console.log('✅ Product updated:', updatedProduct);
      
      // Update the product in the local state
      set((state) => ({
        products: state.products.map((p) => {
          const productId = p.id || p._id;
          if (productId === id) {
            return updatedProduct;
          }
          return p;
        }),
      }));
      return updatedProduct;
    } catch (err) {
      console.error('❌ Error updating product:', err);
      console.error('❌ Error response:', err.response?.data);
      set({ error: err.response?.data?.message || err.message || 'Failed to update product' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      console.log('🗑️ Store: Attempting to delete product:', id);
      const response = await productApi.remove(id);
      console.log('✅ Delete response:', response);
      
      console.log('🗑️ Product deleted:', id);
      set((state) => ({ products: state.products.filter((p) => (p.id || p._id) !== id) }));
      return response;
    } catch (err) {
      console.error('❌ Error deleting product:', err);
      console.error('❌ Error response:', err.response?.data);
      set({ error: err.response?.data?.message || err.message || 'Failed to delete product' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));