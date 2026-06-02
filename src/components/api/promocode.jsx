// src/components/api/promocode.jsx
import api from './base';

export const couponApi = {
  getAll: async () => {
    console.log('🎟️ Fetching coupons...');
    const res = await api.get('/coupons/');
    return res;
  },

  getById: async (code) => {
    const res = await api.get(`/coupons/${code}`);
    return res;
  },

  create: async (data) => {
    console.log('📤 Creating coupon:', data);
    const payload = {
      ...data,
      code: data.code.toUpperCase().trim(),
      discount_value: Number(data.discount_value),
      validFrom: data.validFrom,
      validTo: data.validTo,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };
    const res = await api.post('/coupons/', payload);
    return res;
  },

  update: async (code, data) => {
    console.log('📝 Updating coupon:', data);
    const res = await api.put(`/coupons/${code}`, data);
    return res;
  },

  validate: async (code, context = {}) => {
    console.log('✔️ Validating coupon:', code);
    const res = await api.post(`/coupons/validate`, { code, ...context });
    return res;
  },

  remove: async (code) => {
    console.log('🗑️ Deleting coupon:', code);
    const res = await api.delete(`/coupons/${code}`);
    return res;
  },
};

export const promocode = couponApi;