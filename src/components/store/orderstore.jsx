// src/components/store/orderstore.jsx
import { create } from 'zustand';
import { orderApi } from '../api/orderapi';

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const res = await orderApi.create(orderData);
      const newOrder = res.data?.data || res.data;
      set((state) => ({
        orders: Array.isArray(state.orders) ? [...state.orders, newOrder] : [newOrder],
      }));
      return newOrder;
    } catch (err) {
      console.error('❌ Error creating order:', err);
      set({ error: err.response?.data?.message || 'Failed to create order' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await orderApi.getAll();
      const data = res.data?.data || res.data || [];
      const orders = Array.isArray(data) ? data : [];
      console.log('📦 Orders fetched:', { count: orders.length });
      set({ orders });
    } catch (err) {
      console.error('❌ Error fetching orders:', err);
      set({ error: err.response?.data?.message || 'Failed to load orders' });
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const res = await orderApi.updateStatus(id, status);
      const updatedOrder = res.data?.data || res.data;
      set((state) => ({
        orders: state.orders.map((o) => ((o.id || o._id) === (id.id || id._id || id) ? updatedOrder : o)),
      }));
      return updatedOrder;
    } catch (err) {
      console.error('❌ Error updating order status:', err);
      set({ error: err.response?.data?.message || 'Failed to update order' });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));