// src/hooks/useAdminApi.ts
// Custom hook for admin API operations (Categories, Products, Coupons, etc.)

import { useState, useCallback } from 'react';
import { API_BASE_URL } from '@/config';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  sku: string;
  stock: number;
  rating: number;
  reviews: number;
  isActive: boolean;
  isFeatured: boolean;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  _id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  minOrderAmount: number;
  maxUseCount: number;
  currentUseCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableCategories: string[];
  applicableProducts: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp?: string;
}

// ============================================
// HOOK INTERFACE
// ============================================

export interface UseAdminApiReturn {
  loading: boolean;
  error: string | null;

  // Categories
  fetchCategories: (page?: number, limit?: number) => Promise<Category[]>;
  createCategory: (data: Partial<Category>) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;

  // Products
  fetchProducts: (page?: number, limit?: number, filters?: Record<string, any>) => Promise<Product[]>;
  getProduct: (id: string) => Promise<Product>;
  createProduct: (data: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;

  // Coupons
  fetchCoupons: (page?: number, limit?: number) => Promise<Coupon[]>;
  createCoupon: (data: Partial<Coupon>) => Promise<Coupon>;
  updateCoupon: (id: string, data: Partial<Coupon>) => Promise<Coupon>;
  deleteCoupon: (id: string) => Promise<void>;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('authToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const buildQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value));
    }
  });
  return query.toString();
};

// ============================================
// CUSTOM HOOK
// ============================================

export const useAdminApi = (): UseAdminApiReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // CATEGORY OPERATIONS
  // ============================================

  const fetchCategories = useCallback(
    async (page: number = 1, limit: number = 20): Promise<Category[]> => {
      try {
        setLoading(true);
        setError(null);

        const queryString = buildQueryString({ page, limit });
        const url = `${API_BASE_URL}/api/admin/categories?${queryString}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data: PaginatedResponse<Category> = await response.json();
        return data.data || [];
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch categories';
        setError(errorMessage);
        console.error('Fetch Categories Error:', errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createCategory = useCallback(async (categoryData: Partial<Category>): Promise<Category> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      const data: ApiResponse<Category> = await response.json();
      return data.data!;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create category';
      setError(errorMessage);
      console.error('Create Category Error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(
    async (id: string, categoryData: Partial<Category>): Promise<Category> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/admin/categories/${id}`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify(categoryData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update category');
        }

        const data: ApiResponse<Category> = await response.json();
        return data.data!;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
        setError(errorMessage);
        console.error('Update Category Error:', errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      setError(errorMessage);
      console.error('Delete Category Error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // PRODUCT OPERATIONS
  // ============================================

  const fetchProducts = useCallback(
    async (
      page: number = 1,
      limit: number = 20,
      filters: Record<string, any> = {}
    ): Promise<Product[]> => {
      try {
        setLoading(true);
        setError(null);

        const queryString = buildQueryString({ page, limit, ...filters });
        const url = `${API_BASE_URL}/api/admin/products?${queryString}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data: PaginatedResponse<Product> = await response.json();
        return data.data || [];
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(errorMessage);
        console.error('Fetch Products Error:', errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getProduct = useCallback(async (id: string): Promise<Product> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const data: ApiResponse<Product> = await response.json();
      return data.data!;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch product';
      setError(errorMessage);
      console.error('Get Product Error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData: Partial<Product>): Promise<Product> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create product');
      }

      const data: ApiResponse<Product> = await response.json();
      return data.data!;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product';
      setError(errorMessage);
      console.error('Create Product Error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(
    async (id: string, productData: Partial<Product>): Promise<Product> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify(productData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update product');
        }

        const data: ApiResponse<Product> = await response.json();
        return data.data!;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update product';
        setError(errorMessage);
        console.error('Update Product Error:', errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMessage);
      console.error('Delete Product Error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // COUPON OPERATIONS
  // ============================================

  const fetchCoupons = useCallback(
    async (page: number = 1, limit: number = 20): Promise<Coupon[]> => {
      try {
        setLoading(true);
        setError(null);

        const queryString = buildQueryString({ page, limit });
        const url = `${API_BASE_URL}/api/admin/coupons?${queryString}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch coupons');
        }

        const data: PaginatedResponse<Coupon> = await response.json();
        return data.data || [];
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch coupons';
        setError(errorMessage);
        console.error('Fetch Coupons Error:', errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createCoupon = useCallback(async (couponData: Partial<Coupon>): Promise<Coupon> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/admin/coupons`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(couponData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create coupon');
      }

      const data: ApiResponse<Coupon> = await response.json();
      return data.data!;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create coupon';
      setError(errorMessage);
      console.error('Create Coupon Error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCoupon = useCallback(
    async (id: string, couponData: Partial<Coupon>): Promise<Coupon> => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/api/admin/coupons/${id}`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify(couponData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update coupon');
        }

        const data: ApiResponse<Coupon> = await response.json();
        return data.data!;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update coupon';
        setError(errorMessage);
        console.error('Update Coupon Error:', errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCoupon = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete coupon');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete coupon';
      setError(errorMessage);
      console.error('Delete Coupon Error:', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
  };
};

export default useAdminApi;
