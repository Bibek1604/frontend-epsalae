import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../components/store/authstore';
import toast, { Toaster } from 'react-hot-toast';
import { LogIn, Loader2, Eye, EyeOff, Shield, Lock, Mail, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { API_URL } from '@/config';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin, isAdmin } = useAdminAuth();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return toast.error('Please fill all fields');
    }

    setLoading(true);
    try {
      console.log('📤 Sending login request...');
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📥 Response received:', data);

      if (!response.ok) {
        return toast.error(data.message || 'Login failed');
      }

      // Get token from response
      let token = data.data?.token || data.token || data.accessToken;
      let admin = data.data?.admin || data.data?.user || data.user || data.admin;

      if (!token) {
        console.error('❌ No token in response:', data);
        return toast.error('No token received from server');
      }

      // Persist admin profile (token is persisted by loginAdmin itself)
      if (admin) {
        try { localStorage.setItem('admin', JSON.stringify(admin)); } catch (e) {}
      }

      // Update admin auth slice
      loginAdmin(token, admin);

      toast.success('Welcome back! 🎉', {
        icon: '👋',
        duration: 2000,
      });
      
      // Redirect to admin dashboard
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.18),_transparent_30%),radial-gradient(circle_at_80%_20%,_rgba(236,72,153,0.16),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef3ff_48%,_#ffffff_100%)]">
      <Toaster position="top-center" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-500/10 blur-3xl" />
      </div>
      
      {/* Left Side - Decorative */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 bg-[linear-gradient(145deg,_rgba(15,23,42,0.98)_0%,_rgba(26,60,138,0.98)_46%,_rgba(255,107,53,0.92)_100%)]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-16 left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-14 right-12 h-96 w-96 rounded-full bg-pink-400/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        {/* Floating Shapes */}
        <div className="absolute right-10 top-10 h-20 w-20 rotate-12 rounded-3xl border-4 border-white/20 animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-32 left-16 h-16 w-16 rounded-full bg-white/10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
        <div className="absolute right-1/4 top-1/3 h-12 w-12 rounded-full border-4 border-white/20 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-14 text-white xl:px-16">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/80 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-orange-200" />
              Secure admin access
            </div>

            <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-white/15 bg-white/10 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.5)] backdrop-blur-md">
              <Shield className="h-10 w-10 text-white" />
            </div>

            <h1 className="mt-8 text-5xl font-semibold leading-tight tracking-tight xl:text-6xl">
              ePasaley
              <span className="block text-white/78">Admin Portal</span>
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-8 text-white/75">
              Access the control center for products, orders, banners, and store operations with a cleaner, more confident admin experience.
            </p>

            <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-2">
              {[
                { title: 'Products & Categories', desc: 'Organize inventory with speed.', icon: CheckCircle },
                { title: 'Orders & Tracking', desc: 'Manage customer flow clearly.', icon: CheckCircle },
                { title: 'Sales Insights', desc: 'Spot performance at a glance.', icon: CheckCircle },
                { title: 'Customer Support', desc: 'Handle requests with confidence.', icon: CheckCircle },
              ].map((item, index) => (
                <div key={item.title} className="rounded-[1.5rem] border border-white/12 bg-white/8 p-4 backdrop-blur-md shadow-[0_16px_40px_-32px_rgba(15,23,42,0.5)]">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12">
                    <item.icon className="h-5 w-5 text-white/90" />
                  </div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/65">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center px-6 py-10 sm:px-8 lg:w-1/2 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg"
        >
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[linear-gradient(135deg,_#1A3C8A,_#FF6B35)] shadow-[0_18px_40px_-26px_rgba(26,60,138,0.55)]">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">ePasaley Admin</h1>
          </div>

          {/* Login Card */}
          <div className="rounded-[2rem] border border-white/70 bg-white/82 p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.42)] backdrop-blur-2xl sm:p-8 lg:p-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="hidden lg:inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-[linear-gradient(135deg,_#1A3C8A,_#FF6B35)] mb-4 shadow-[0_18px_40px_-28px_rgba(26,60,138,0.55)]">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Welcome back</h2>
              <p className="mt-3 text-sm leading-7 text-slate-500">Sign in to access the admin dashboard.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="admin@epasaley.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/90 py-3.5 pl-12 pr-4 text-slate-900 shadow-[0_10px_30px_-26px_rgba(15,23,42,0.3)] transition-all duration-300 placeholder:text-slate-400 focus:border-[#1A3C8A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1A3C8A]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/90 py-3.5 pl-12 pr-12 text-slate-900 shadow-[0_10px_30px_-26px_rgba(15,23,42,0.3)] transition-all duration-300 placeholder:text-slate-400 focus:border-[#1A3C8A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#1A3C8A]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#1A3C8A] focus:ring-[#1A3C8A]"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <button type="button" className="text-sm font-medium text-[#1A3C8A] transition hover:text-[#FF6B35]">
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,_#1A3C8A_0%,_#2550b7_55%,_#FF6B35_100%)] py-4 font-semibold text-white shadow-[0_20px_50px_-28px_rgba(26,60,138,0.65)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-28px_rgba(255,107,53,0.5)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_20px_50px_-28px_rgba(26,60,138,0.65)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="rounded-full bg-white px-4 text-slate-500">Secure Admin Access</span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/90 p-4 shadow-[0_16px_40px_-32px_rgba(217,119,6,0.35)]">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-800">Security Notice</p>
                <p className="mt-1 text-xs text-amber-600">
                  This portal is restricted to authorized administrators only. All login attempts are logged.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-500">
            © 2025 ePasaley. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
