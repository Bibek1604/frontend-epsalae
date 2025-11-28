// src/components/api/orderapi.jsx
import api from './base';

export const orderApi = {
  getAll: async () => {
    console.log('📦 Fetching orders...');
    const res = await api.get('/orders/');
    return res;
  },

  getById: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res;
  },

  create: async (data) => {
    console.log('📤 Creating order:', data);
    const res = await api.post('/orders/', data);
    return res;
  },

  updateStatus: async (id, status) => {
    console.log('📝 Updating order status:', { id, status });
    const res = await api.put(`/orders/${id}/status`, { status });
    return res;
  },
};