// src/api/flashSaleApi.js
import api from './base';

export const flashSaleApi = {
  getAll: () => api.get('/flash-sales/'),
  
  getById: (id) => api.get(`/flash-sales/${id}`),
  
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
    return api.post('/flash-sales/', payload);
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
    return api.put(`/flash-sales/${id}`, payload);
  },

  remove: (id) => api.delete(`/flash-sales/${id}`),
};