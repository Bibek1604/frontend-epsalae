// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { authEndpoints, profileEndpoints } from '@/components/api/userapi';
import { useUserAuth } from '@/components/store/authstore';
import { useCart } from '@/store/cartstore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, isUser } = useUserAuth();
  const { cart } = useCart();

  const returnTo: string = (location.state as any)?.returnTo || '/account';

  // Already logged in — go straight to destination
  if (isUser) {
    navigate(returnTo, { replace: true });
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    if (!email) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'At least 6 characters';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const res = await authEndpoints.login({ email, password });
      const data = res.data?.data || res.data || {};
      const token = data.token || data.accessToken;
      const user = data.user;
      if (!token) throw new Error(res.data?.message || 'Login failed');

      loginUser(token, user);

      // Merge guest cart best-effort
      try {
        if (Array.isArray(cart) && cart.length) {
          await profileEndpoints.cart.merge({ items: cart });
        }
      } catch (_) {}

      toast.success('Welcome back!');
      navigate(returnTo, { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">
              epasal<span className="text-orange-400">ey</span>
            </span>
          </Link>
          <p className="mt-3 text-slate-400 text-sm">Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Welcome back</h2>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl px-4 py-3 mb-5 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="email" type="email" value={email}
                  onChange={(e) => { setEmail(e.target.value); setFieldErrors(p => ({ ...p, email: '' })); setError(''); }}
                  placeholder="you@example.com" disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 disabled:opacity-50 ${fieldErrors.email ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}`}
                />
              </div>
              {fieldErrors.email && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-orange-400 hover:text-orange-300 transition">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: '' })); setError(''); }}
                  placeholder="Enter your password" disabled={loading}
                  className={`w-full pl-10 pr-11 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 disabled:opacity-50 ${fieldErrors.password ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition disabled:opacity-50">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1.5 text-xs text-red-400">{fieldErrors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/register" state={{ returnTo }} className="text-orange-400 hover:text-orange-300 font-medium transition">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center mt-5">
          <Link to="/products" className="text-sm text-slate-500 hover:text-slate-300 transition">
            ← Continue shopping without signing in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
