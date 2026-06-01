// ============================================
// ENHANCED AUTH HOOK WITH ERROR HANDLING
// ============================================
// Improved version with proper token management, refresh logic, error handling

import { useState, useCallback, useEffect } from 'react';
import { api, handleApiError } from '../config/api.config';

// ============================================
// TYPES
// ============================================
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  accountType: string;
  status: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    refreshToken?: string;
  };
  message: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  isTokenValid: () => boolean;
  getToken: () => string | null;
}

// ============================================
// TOKEN MANAGEMENT
// ============================================
const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'authUser';
const TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000; // 7 days

// Save token with expiration
const saveToken = (token: string, expiresIn: number = TOKEN_EXPIRES_IN) => {
  const expiresAt = Date.now() + expiresIn;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(`${TOKEN_KEY}_expires`, expiresAt.toString());
};

// Check if token is expired
const isTokenExpired = (): boolean => {
  const expiresAt = localStorage.getItem(`${TOKEN_KEY}_expires`);
  if (!expiresAt) return true;
  return Date.now() > parseInt(expiresAt);
};

// Get token from storage
const getStoredToken = (): string | null => {
  if (isTokenExpired()) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(`${TOKEN_KEY}_expires`);
    return null;
  }
  return localStorage.getItem(TOKEN_KEY);
};

// ============================================
// ENHANCED USE AUTH HOOK
// ============================================
export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // INITIALIZE AUTH STATE
  // ============================================
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // Check for stored token
        const storedToken = getStoredToken();
        const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken) {
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);

          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Token exists but no user - verify and fetch
            await verifyToken(storedToken);
          }
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ============================================
  // VERIFY TOKEN
  // ============================================
  const verifyToken = useCallback(async (token: string) => {
    try {
      const response = await api.post('/api/auth/verify-token', { token });

      if (response.data.success) {
        return true;
      } else {
        clearAuth();
        return false;
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      clearAuth();
      return false;
    }
  }, []);

  // ============================================
  // REFRESH ACCESS TOKEN
  // ============================================
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    if (!refreshToken) return false;

    try {
      const response = await api.post<AuthResponse>(
        '/api/auth/refresh-token',
        { token: refreshToken }
      );

      if (response.data.success) {
        const newToken = response.data.data.token;
        const newRefreshToken = response.data.data.refreshToken || refreshToken;

        saveToken(newToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        setToken(newToken);
        setRefreshToken(newRefreshToken);

        return true;
      }

      return false;
    } catch (err) {
      console.error('Token refresh failed:', err);
      clearAuth();
      return false;
    }
  }, [refreshToken]);

  // ============================================
  // LOGIN
  // ============================================
  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post<AuthResponse>('/api/auth/login', {
          email,
          password
        });

        if (response.data.success) {
          const { user, token, refreshToken: newRefreshToken } =
            response.data.data;

          // Save tokens and user
          saveToken(token);
          if (newRefreshToken) {
            localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
            setRefreshToken(newRefreshToken);
          }
          localStorage.setItem(USER_KEY, JSON.stringify(user));

          setToken(token);
          setUser(user);
        }
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ============================================
  // REGISTER
  // ============================================
  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post<AuthResponse>('/api/auth/register', data);

      if (response.data.success) {
        const { user, token, refreshToken: newRefreshToken } =
          response.data.data;

        // Save tokens and user
        saveToken(token);
        if (newRefreshToken) {
          localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
          setRefreshToken(newRefreshToken);
        }
        localStorage.setItem(USER_KEY, JSON.stringify(user));

        setToken(token);
        setUser(user);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // LOGOUT
  // ============================================
  const logout = useCallback(async () => {
    try {
      // Call backend logout endpoint
      await api.post('/api/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
      // Continue with logout even if API call fails
    } finally {
      // Clear all local data
      clearAuth();
      // Redirect to login
      window.location.href = '/login';
    }
  }, []);

  // ============================================
  // CLEAR AUTH
  // ============================================
  const clearAuth = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(`${TOKEN_KEY}_expires`);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setError(null);
  }, []);

  // ============================================
  // CLEAR ERROR
  // ============================================
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================
  // UPDATE USER
  // ============================================
  const updateUser = useCallback((userData: Partial<User>) => {
    const updatedUser = { ...user, ...userData } as User;
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  }, [user]);

  // ============================================
  // CHECK IF TOKEN IS VALID
  // ============================================
  const isTokenValid = useCallback((): boolean => {
    return !isTokenExpired() && !!token;
  }, [token]);

  // ============================================
  // GET CURRENT TOKEN
  // ============================================
  const getToken = useCallback((): string | null => {
    return getStoredToken();
  }, []);

  return {
    user,
    token,
    refreshToken,
    isAuthenticated: !!user && isTokenValid(),
    isLoading,
    error,
    login,
    register,
    logout,
    refreshAccessToken,
    clearError,
    updateUser,
    isTokenValid,
    getToken
  };
};

export default useAuth;
