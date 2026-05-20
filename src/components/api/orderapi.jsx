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
    console.log('📤 Creating order with data:', data);
    try {
      const res = await api.post('/orders/', data);
      console.log('📥 Order creation response:', res);
      console.log('📥 Response data:', res.data);
      console.log('📥 Response data.data:', res.data?.data);
      console.log('📥 Response data._id:', res.data?._id);
      console.log('📥 Response data.data._id:', res.data?.data?._id);
      return res;
    } catch (error) {
      console.error('❌ Order creation failed:', error);
      console.error('❌ Error response:', error.response?.data);
      throw error;
    }
  },

  updateStatus: async (id, status, meta) => {
    console.log('📝 Updating order status:', { id, status, meta });
    const res = await api.put(`/orders/${id}/status`, { status, ...(meta || {}) });
    return res;
  },

  // Public track order by ID (no auth required).
  // Backend endpoint: GET /api/v1/orders/track/:id
  trackById: async (orderId) => {
    const res = await api.get(`/orders/track/${orderId}`);
    return res;
  },
};