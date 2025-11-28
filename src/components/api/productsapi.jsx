// src/api/productApi.js
import api from './base';

export const productApi = {
  getAll: () => api.get('/products/'),
  create: (data) => api.post('/products/', data),
  getById: (id) => api.get(`/products/${id}`),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
};