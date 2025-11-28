// src/api/categoryApi.js
import api from './base';

// Helper to convert base64 to File
const base64ToFile = (base64String, fileName) => {
  if (!base64String.includes('data:image')) {
    return null; // Not a data URL
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

export const categoryApi = {
  getAll: () => api.get('/categories/'),
  
  create: (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('isActive', data.isActive);
    
    // Convert base64 to File if present
    if (data.imageUrl && data.imageUrl.includes('data:image')) {
      const file = base64ToFile(data.imageUrl, 'category-image.png');
      if (file) {
        console.log('📤 Uploading image file:', { name: file.name, size: file.size, type: file.type });
        formData.append('image', file); // Backend expects 'image' field name
      }
    }
    
    console.log('📤 Sending FormData with:', { name: data.name, description: data.description, hasImage: !!data.imageUrl });
    return api.post('/categories/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getById: (id) => api.get(`/categories/${id}`),
  
  update: (id, data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('isActive', data.isActive);
    
    // Convert base64 to File if present
    if (data.imageUrl && data.imageUrl.includes('data:image')) {
      const file = base64ToFile(data.imageUrl, 'category-image.png');
      if (file) {
        console.log('📤 Uploading updated image file:', { name: file.name, size: file.size, type: file.type });
        formData.append('image', file); // Backend expects 'image' field name
      }
    }
    
    console.log('📤 Updating category:', { id, name: data.name, hasImage: !!data.imageUrl });
    return api.put(`/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  remove: (id) => api.delete(`/categories/${id}`),
};