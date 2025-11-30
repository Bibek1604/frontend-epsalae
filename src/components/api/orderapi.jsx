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

  updateStatus: async (id, status) => {
    console.log('📝 Updating order status:', { id, status });
    const res = await api.put(`/orders/${id}/status`, { status });
    return res;
  },
  
  // Track order by ID and phone (uses query params)
  trackOrder: async (orderId, phone) => {
    console.log('🔍 Tracking order:', { orderId, phone });
    const res = await api.get(`/orders/track?orderId=${orderId}&phone=${phone}`);
    return res;
  },

  // Public track order by ID only (no auth required)
  // Backend endpoint: GET /api/v1/orders/track/:orderId
  trackById: async (orderId) => {
    console.log('🔍 Public tracking order by ID:', orderId);
    const res = await api.get(`/orders/track/${orderId}`);
    return res;
  }
};