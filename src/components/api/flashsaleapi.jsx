// src/api/flashSaleApi.js
import api from './base';

// Try different endpoint patterns your backend might use
const ENDPOINT = '/flashsales'; // Changed from '/flash-sales/'

export const flashSaleApi = {
  getAll: () => {
    console.log('📥 Fetching flash sales from:', ENDPOINT);
    return api.get(ENDPOINT);
  },
  
  getById: (id) => api.get(`${ENDPOINT}/${id}`),
  
  create: (data) => {
    const payload = {
      productId: data.productId,
      flashPrice: data.flashPrice,
      maxStock: data.maxStock,
      startTime: data.startTime,
      endTime: data.endTime,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };
    console.log('📤 Creating flash sale:', payload);
    console.log('📤 POST to:', ENDPOINT);
    return api.post(ENDPOINT, payload);
  },

  update: (id, data) => {
    const payload = {
      productId: data.productId,
      flashPrice: data.flashPrice,
      maxStock: data.maxStock,
      startTime: data.startTime,
      endTime: data.endTime,
      isActive: data.isActive,
    };
    console.log('📤 Updating flash sale:', { id, ...payload });
    return api.put(`${ENDPOINT}/${id}`, payload);
  },

  remove: (id) => api.delete(`${ENDPOINT}/${id}`),
};