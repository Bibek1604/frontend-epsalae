// src/api/flashSaleApi.js
import api from './base';

// Backend mounts at /api/v1/flash-sales
const ENDPOINT = '/flash-sales';

export const flashSaleApi = {
  getAll: () => api.get(ENDPOINT),

  // Public storefront — active flash sales only
  getActive: () => api.get(`${ENDPOINT}/active`),
  
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
    return api.put(`${ENDPOINT}/${id}`, payload);
  },

  remove: (id) => api.delete(`${ENDPOINT}/${id}`),
};