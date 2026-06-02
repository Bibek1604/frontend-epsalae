// User-scoped axios client. Sends Authorization: Bearer <userToken>, sends
// cookies for the refresh endpoint, and silently retries one /auth/refresh
// on a 401 before propagating the error.
import axios from 'axios';
import { API_URL } from '@/config';

const userApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Single-flight refresh ---
let refreshPromise = null;
const refreshUserToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_URL}/auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        const data = res.data?.data || res.data || {};
        const newToken = data.token || data.accessToken;
        if (newToken) {
          localStorage.setItem('userToken', newToken);
        }
        return newToken;
      })
      .finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
};

userApi.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;

    if (status === 401 && !original._retried) {
      original._retried = true;
      if (!String(original.url || '').includes('/auth/refresh')) {
        try {
          const newToken = await refreshUserToken();
          if (newToken) {
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newToken}`;
            return userApi(original);
          }
        } catch (e) { /* fallthrough */ }
      }

      // Refresh failed — drop the user session. No hard redirect; UI route
      // guards (UserProtectedRoute) will catch this and prompt re-login.
      try {
        localStorage.removeItem('userToken');
        localStorage.removeItem('user-auth-storage');
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);

export const authEndpoints = {
  login: (payload) => userApi.post('/auth/user/login', payload),
  register: (payload) => userApi.post('/auth/register', payload),
  logout: () => userApi.post('/auth/logout'),
};

export const profileEndpoints = {
  me: () => userApi.get('/user/profile'),
  update: (payload) => userApi.put('/user/profile', payload),
  uploadAvatar: (formData) => userApi.post('/user/profile/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  addresses: {
    list: () => userApi.get('/user/addresses'),
    add: (payload) => userApi.post('/user/addresses', payload),
  },
  cart: {
    merge: (payload) => userApi.post('/user/cart/merge', payload),
    get: () => userApi.get('/user/cart'),
  },
  favorites: {
    list: () => userApi.get('/user/favorites'),
    add: (productId) => userApi.post('/user/favorites', { productId }),
    remove: (productId) => userApi.delete('/user/favorites', { data: { productId } }),
  },
  orders: (q) => userApi.get('/user/orders', { params: q }),
  changePassword: (payload) => userApi.put('/user/profile/password', payload),
};

export default userApi;
