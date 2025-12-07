// src/api/productApi.js
import api from './base';

// Helper to convert base64 to File
const base64ToFile = (base64String, fileName) => {
  if (!base64String || !base64String.includes('data:image')) {
    return null;
  }
  
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }
  return new File([u8arr], fileName, { type: mime });
};

// Helper to prepare product data as FormData
const prepareFormData = (data, isUpdate = false) => {
  const formData = new FormData();
  
  // Required fields
  formData.append('name', data.name);
  formData.append('price', data.price.toString());
  formData.append('category_id', data.category_id);
  
  // Optional fields
  if (data.description) formData.append('description', data.description);
  if (data.discountPrice !== undefined) formData.append('discountPrice', data.discountPrice.toString());
  if (data.stock !== undefined) formData.append('stock', data.stock.toString());
  if (data.hasOffer !== undefined) formData.append('hasOffer', data.hasOffer.toString());
  if (data.isActive !== undefined) formData.append('isActive', data.isActive.toString());
  
  // Handle image
  if (data.imageUrl) {
    if (data.imageUrl.includes('data:image')) {
      // New image uploaded as base64 - convert to file
      const file = base64ToFile(data.imageUrl, 'product-image.png');
      if (file) {
        console.log('📤 Uploading new product image:', { name: file.name, size: file.size, type: file.type });
        formData.append('image', file);
      }
    } else if (data.imageUrl.startsWith('http') && isUpdate) {
      // Existing Cloudinary URL - pass it to backend to preserve
      console.log('📤 Keeping existing image URL:', data.imageUrl);
      formData.append('imageUrl', data.imageUrl);
    }
  }
  
  console.log('📤 Product FormData prepared:', { 
    name: data.name, 
    category_id: data.category_id, 
    hasImage: !!data.imageUrl,
    isUpdate 
  });
  
  return formData;
};

export const productApi = {
  getAll: () => api.get('/products/'),
  
  create: (data) => {
    const formData = prepareFormData(data, false);
    return api.post('/products/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getById: (id) => api.get(`/products/${id}`),
  
  update: (id, data) => {
    const formData = prepareFormData(data, true);
    return api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  remove: (id) => api.delete(`/products/${id}`),
};