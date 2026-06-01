// Frontend: Registration Page Component
// User registration page with form validation and error handling

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth, type RegisterData } from '@/hooks/useAuth';
import './auth-pages.css';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    accountType: 'customer',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // ==========================================
  // Calculate Password Strength
  // ==========================================
  const calculatePasswordStrength = (pwd: string): 'weak' | 'fair' | 'good' | 'strong' => {
    if (!pwd) return 'weak';

    let strength = 0;

    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;

    if (strength < 2) return 'weak';
    if (strength < 3) return 'fair';
    if (strength < 4) return 'good';
    return 'strong';
  };

  // ==========================================
  // Form Validation
  // ==========================================
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9\-\+\(\)]+$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (passwordStrength === 'weak') {
      errors.password = 'Password is too weak. Use uppercase, numbers, and special characters.';
    }

    if (!formData.passwordConfirm) {
      errors.passwordConfirm = 'Please confirm your password';
    } else if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ==========================================
  // Handle Input Change
  // ==========================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

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

    const result = await register(formData);

    if (result.success) {
      setSuccessMessage('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setApiError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-page register-page">
      <div className="auth-container register-container">
        {/* Logo Section */}
        <div className="auth-logo">
          <h1>Tech Store</h1>
          <p>Create Your Account</p>
        </div>

        {/* Registration Form */}
        <div className="auth-form-wrapper register-form-wrapper">
          <div className="auth-header">
            <h2>Join Tech Store</h2>
            <p>Create a new account to get started</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* API Error */}
          {(apiError || error) && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{apiError || error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form register-form">
            {/* Name Fields Row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <div className="input-wrapper">
                  <User size={18} />
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    disabled={isLoading}
                    className={formErrors.firstName ? 'error' : ''}
                  />
                </div>
                {formErrors.firstName && <span className="form-error">{formErrors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <div className="input-wrapper">
                  <User size={18} />
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    disabled={isLoading}
                    className={formErrors.lastName ? 'error' : ''}
                  />
                </div>
                {formErrors.lastName && <span className="form-error">{formErrors.lastName}</span>}
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
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

            {/* Phone Field */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <div className="input-wrapper">
                <Phone size={18} />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1-555-123-4567"
                  disabled={isLoading}
                  className={formErrors.phone ? 'error' : ''}
                />
              </div>
              {formErrors.phone && <span className="form-error">{formErrors.phone}</span>}
            </div>

            {/* Account Type */}
            <div className="form-group">
              <label htmlFor="accountType">Account Type</label>
              <select
                id="accountType"
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <option value="customer">Customer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a strong password"
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className={`password-strength ${passwordStrength}`}>
                  <div className="strength-bar">
                    <div className="strength-fill"></div>
                  </div>
                  <span className="strength-label">
                    Strength: <strong>{passwordStrength}</strong>
                  </span>
                </div>
              )}

              {formErrors.password && <span className="form-error">{formErrors.password}</span>}

              <p className="password-hint">
                Must be at least 6 characters with uppercase, numbers, and special characters.
              </p>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="passwordConfirm">Confirm Password *</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  id="passwordConfirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  className={formErrors.passwordConfirm ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formErrors.passwordConfirm && (
                <span className="form-error">{formErrors.passwordConfirm}</span>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary btn-large" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Info Section */}
        <div className="auth-info">
          <h3>Why Join Us?</h3>
          <ul className="feature-list">
            <li>
              <span className="feature-icon">✨</span>
              <span>Wide selection of quality products</span>
            </li>
            <li>
              <span className="feature-icon">🚚</span>
              <span>Fast and reliable shipping</span>
            </li>
            <li>
              <span className="feature-icon">💳</span>
              <span>Secure payment processing</span>
            </li>
            <li>
              <span className="feature-icon">🎁</span>
              <span>Exclusive member discounts</span>
            </li>
            <li>
              <span className="feature-icon">📱</span>
              <span>Easy order tracking</span>
            </li>
            <li>
              <span className="feature-icon">💬</span>
              <span>24/7 customer support</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
