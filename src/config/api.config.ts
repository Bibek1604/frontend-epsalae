// ============================================
// API CONFIGURATION & INTERCEPTORS
// ============================================
// Handles API base URL, request/response interceptors, error handling

import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { API_URL } from '@/config';

// ============================================
// CREATE AXIOS INSTANCE
// ============================================
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ============================================
// REQUEST INTERCEPTOR
// ============================================
apiClient.interceptors.request.use(
  (config) => {
    // Add JWT token from localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request ID for tracking
    const requestId = generateRequestId();
    config.headers['X-Request-ID'] = requestId;

    // Add timestamp
    config.headers['X-Request-Time'] = new Date().toISOString();

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`📤 [${config.method?.toUpperCase()}] ${config.url}`, {
        data: config.data,
        params: config.params,
        requestId
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const requestId = response.config.headers['X-Request-ID'];

    // Log success response in development
    if (import.meta.env.DEV) {
      console.log(`📥 [${response.status}] ${response.config.url}`, {
        data: response.data,
        requestId
      });
    }

    return response;
  },

  async (error: AxiosError) => {
    const requestId = error.config?.headers['X-Request-ID'];
    const originalRequest = error.config;

    // Log error response
    console.error(`❌ [${error.response?.status}] ${error.config?.url}`, {
      message: error.message,
      data: error.response?.data,
      requestId
    });

    // ============================================
    // HANDLE TOKEN EXPIRATION
    // ============================================
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.headers['X-Retry']
    ) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // Try to refresh token
          const response = await axios.post(
            `${API_URL}/auth/refresh-token`,
            { token: refreshToken }
          );

          const newToken = response.data.data.token;

          // Save new token
          localStorage.setItem('authToken', newToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          originalRequest.headers['X-Retry'] = 'true';

          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed - logout user
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
    }

    // ============================================
    // HANDLE OTHER ERRORS
    // ============================================
    if (error.response?.status === 429) {
      // Rate limited
      console.warn('Rate limited - please try again later');
    }

    if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      console.warn('Access denied');
    }

    return Promise.reject(error);
  }
);

// ============================================
// HELPER FUNCTIONS
// ============================================
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// API CLIENT WRAPPER
// ============================================
export const api = {
  get: <T = any>(url: string, config?: any) =>
    apiClient.get<T>(url, config),

  post: <T = any>(url: string, data?: any, config?: any) =>
    apiClient.post<T>(url, data, config),

  put: <T = any>(url: string, data?: any, config?: any) =>
    apiClient.put<T>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: any) =>
    apiClient.patch<T>(url, data, config),

  delete: <T = any>(url: string, config?: any) =>
    apiClient.delete<T>(url, config)
};

// ============================================
// TOAST NOTIFICATION CALLBACK
// ============================================
// Allow components to register toast callback for API errors
type ToastCallback = (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
let toastCallback: ToastCallback | null = null;

export const registerToastCallback = (callback: ToastCallback) => {
  toastCallback = callback;
};

export const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  if (toastCallback) {
    toastCallback(message, type);
  }
};

// ============================================
// ERROR HANDLER
// ============================================
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    let errorMessage = '';

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error?.message) {
      errorMessage = error.response.data.error.message;
    } else {
      switch (error.response?.status) {
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please log in again.';
          break;
        case 403:
          errorMessage = 'Access denied.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = error.message || 'An error occurred';
      }
    }

    // Show toast notification if callback is registered
    showToast(errorMessage, 'error');
    return errorMessage;
  }

  const message = 'An unexpected error occurred';
  showToast(message, 'error');
  return message;
};

// ============================================
// EXPORT API FUNCTIONS
// ============================================
export default apiClient;
