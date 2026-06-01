// Frontend: Login Page Component
// User login page with form validation and error handling

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth, type LoginCredentials } from '@/hooks/useAuth';
import './auth-pages.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate]);

  // ==========================================
  // Form Validation
  // ==========================================
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==========================================
  // Handle Input Change
  // ==========================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    setApiError(null);
  };

  // ==========================================
  // Handle Form Submit
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await login(formData);

    if (result.success) {
      // Redirect based on role
      const userData = result.data;
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      setApiError(result.error || 'Login failed');
    }
  };

  // ==========================================
  // Demo Credentials
  // ==========================================
  const fillDemoAdmin = () => {
    setFormData({
      email: 'admin@techstore.com',
      password: 'Admin@123456',
    });
    setFormErrors({});
    setApiError(null);
  };

  const fillDemoCustomer = () => {
    setFormData({
      email: 'john.customer@email.com',
      password: 'Customer@123456',
    });
    setFormErrors({});
    setApiError(null);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Logo Section */}
        <div className="auth-logo">
          <h1>Tech Store</h1>
          <p>Admin & Customer Portal</p>
        </div>

        {/* Login Form */}
        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {/* API Error */}
          {(apiError || error) && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{apiError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  disabled={isLoading}
                  className={formErrors.email ? 'error' : ''}
                />
              </div>
              {formErrors.email && <span className="form-error">{formErrors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot password?
                </Link>
              </div>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className={formErrors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.password && <span className="form-error">{formErrors.password}</span>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary btn-large" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* Demo Buttons */}
          <div className="demo-section">
            <p className="demo-label">Try Demo Accounts:</p>
            <div className="demo-buttons">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={fillDemoAdmin}
                disabled={isLoading}
              >
                Demo Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={fillDemoCustomer}
                disabled={isLoading}
              >
                Demo Customer
              </button>
            </div>
          </div>

          {/* Demo Credentials Info */}
          <div className="demo-credentials">
            <p className="info-title">🔐 Demo Credentials:</p>
            <div className="credential-item">
              <strong>Admin:</strong>
              <span>admin@techstore.com / Admin@123456</span>
            </div>
            <div className="credential-item">
              <strong>Customer:</strong>
              <span>john.customer@email.com / Customer@123456</span>
            </div>
            <div className="credential-item">
              <strong>Staff:</strong>
              <span>staff@techstore.com / Staff@123456</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Info Section */}
        <div className="auth-info">
          <h3>Admin Panel Features</h3>
          <ul className="feature-list">
            <li>
              <span className="feature-icon">📊</span>
              <span>Complete Dashboard with Analytics</span>
            </li>
            <li>
              <span className="feature-icon">🛍️</span>
              <span>Product & Category Management</span>
            </li>
            <li>
              <span className="feature-icon">📦</span>
              <span>Order Tracking & Management</span>
            </li>
            <li>
              <span className="feature-icon">👥</span>
              <span>User & Staff Management</span>
            </li>
            <li>
              <span className="feature-icon">⚙️</span>
              <span>System Configuration</span>
            </li>
            <li>
              <span className="feature-icon">🔒</span>
              <span>Role-Based Access Control</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
