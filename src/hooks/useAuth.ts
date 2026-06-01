// Frontend: Authentication Hook
// Custom React hook for managing authentication state and operations

import { useState, useCallback, useEffect } from 'react';
import { API_URL } from '@/config';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'staff';
  accountType: 'customer' | 'seller' | 'admin';
  fullName: string;
  profileImage?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirm: string;
  accountType?: 'customer' | 'seller';
}


// ==========================================
// useAuth Hook
// ==========================================
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // ==========================================
  // Initialize Auth State from localStorage
  // ==========================================
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');

        if (token && userData) {
          // Verify token is still valid
          const isValid = await verifyTokenValidity(token);

          if (isValid) {
            setAuthState((prev) => ({
              ...prev,
              token,
              user: JSON.parse(userData),
              isAuthenticated: true,
              isLoading: false,
            }));
          } else {
            // Token expired, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            setAuthState((prev) => ({
              ...prev,
              isLoading: false,
            }));
          }
        } else {
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    initializeAuth();
  }, []);

  // ==========================================
  // Verify Token Validity
  // ==========================================
  const verifyTokenValidity = useCallback(async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }, []);

  // ==========================================
  // Login Function
  // ==========================================
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Store token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.data));
        localStorage.setItem('userRole', data.data.role);

        setAuthState({
          user: data.data,
          token: data.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return { success: true, data: data.data };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        return { success: false, error: errorMessage };
      }
    },
    []
  );

  // ==========================================
  // Register Function
  // ==========================================
  const register = useCallback(async (userData: RegisterData) => {
    setAuthState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user data
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.data));
      localStorage.setItem('userRole', data.data.role);

      setAuthState({
        user: data.data,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, data: data.data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  // ==========================================
  // Logout Function
  // ==========================================
  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('userRole');

      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  // ==========================================
  // Refresh Token Function
  // ==========================================
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        return false;
      }

      const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      // Update token
      localStorage.setItem('authToken', data.token);

      setAuthState((prev) => ({
        ...prev,
        token: data.token,
      }));

      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  }, [logout]);

  // ==========================================
  // Forgot Password Function
  // ==========================================
  const forgotPassword = useCallback(async (email: string) => {
    setAuthState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Request failed';

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      return { success: false, error: errorMessage };
    }
  }, []);

  // ==========================================
  // Reset Password Function
  // ==========================================
  const resetPassword = useCallback(
    async (token: string, password: string, passwordConfirm: string) => {
      setAuthState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
      }));

      try {
        const response = await fetch(`${API_URL}/api/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, password, passwordConfirm }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Reset failed');
        }

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));

        return { success: true };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Reset failed';

        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        return { success: false, error: errorMessage };
      }
    },
    []
  );

  // ==========================================
  // Get Current User Profile
  // ==========================================
  const getProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');

      if (!token) {
        return null;
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile');
      }

      return data.data;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }, []);

  return {
    // State
    user: authState.user,
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,

    // Methods
    login,
    register,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    getProfile,
  };
};

export default useAuth;
