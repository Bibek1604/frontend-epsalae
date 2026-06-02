// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { authEndpoints } from '@/components/api/userapi';
import { useUserAuth } from '@/components/store/authstore';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const strengthLabel = (p: string) => {
  if (!p) return null;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^a-zA-Z0-9]/.test(p)) s++;
  if (s < 2) return { label: 'Weak', color: 'bg-red-500', w: 'w-1/4' };
  if (s < 3) return { label: 'Fair', color: 'bg-yellow-500', w: 'w-2/4' };
  if (s < 4) return { label: 'Good', color: 'bg-blue-500', w: 'w-3/4' };
  return { label: 'Strong', color: 'bg-emerald-500', w: 'w-full' };
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isUser } = useUserAuth();

  const returnTo: string = (location.state as any)?.returnTo || '/account';
  if (isUser) navigate(returnTo, { replace: true });

  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData & { api: string }>>({});
  const [success, setSuccess] = useState(false);

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: '', api: '' }));
  };

  const validate = () => {
    const e: Partial<FormData & { api: string }> = {};
    if (!form.firstName.trim() || form.firstName.trim().length < 2) e.firstName = 'At least 2 characters';
    if (!form.lastName.trim() || form.lastName.trim().length < 2) e.lastName = 'At least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone) e.phone = 'Phone is required';
    else if (!/^[0-9\-\+\(\)\s]{7,15}$/.test(form.phone)) e.phone = '7–15 digit phone number';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authEndpoints.register({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      setSuccess(true);
      toast.success('Account created! Please sign in.');
      setTimeout(() => navigate('/login', { state: { returnTo } }), 1800);
    } catch (err: any) {
      setErrors(p => ({ ...p, api: err?.response?.data?.message || 'Registration failed' }));
    } finally {
      setLoading(false);
    }
  };

  const strength = strengthLabel(form.password);

  const Field = ({ id, label, type = 'text', value, onChange, error, placeholder, icon: Icon, right }: any) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
          disabled={loading || success}
          className={`w-full pl-10 ${right ? 'pr-11' : 'pr-4'} py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 disabled:opacity-50 ${error ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 hover:border-white/20'}`}
        />
        {right}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-4 py-10 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">epasal<span className="text-orange-400">ey</span></span>
          </Link>
          <p className="mt-2.5 text-slate-400 text-sm">Create your account</p>
        </div>

        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-7 shadow-2xl">
          {/* Success state */}
          {success ? (
            <div className="py-6 text-center">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Account created!</h3>
              <p className="text-slate-400 text-sm">Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-white mb-5">Create account</h2>

              {errors.api && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl px-4 py-3 mb-4 text-sm">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errors.api}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <Field id="firstName" label="First name" value={form.firstName} onChange={set('firstName')}
                    placeholder="John" icon={User} error={errors.firstName} />
                  <Field id="lastName" label="Last name" value={form.lastName} onChange={set('lastName')}
                    placeholder="Doe" icon={User} error={errors.lastName} />
                </div>

                <Field id="email" label="Email address" type="email" value={form.email} onChange={set('email')}
                  placeholder="you@example.com" icon={Mail} error={errors.email} />

                <Field id="phone" label="Phone number" type="tel" value={form.phone} onChange={set('phone')}
                  placeholder="98XXXXXXXX" icon={Phone} error={errors.phone} />

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input id="password" type={showPwd ? 'text' : 'password'} value={form.password}
                      onChange={set('password')} placeholder="Min. 6 characters" disabled={loading}
                      className={`w-full pl-10 pr-11 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 disabled:opacity-50 ${errors.password ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}`} />
                    <button type="button" onClick={() => setShowPwd(v => !v)} disabled={loading}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition">
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {strength && (
                    <div className="mt-2">
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${strength.color} ${strength.w}`} />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{strength.label} password</p>
                    </div>
                  )}
                  {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                </div>

                {/* Confirm password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input id="confirmPassword" type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                      onChange={set('confirmPassword')} placeholder="Re-enter password" disabled={loading}
                      className={`w-full pl-10 pr-11 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400/50 disabled:opacity-50 ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10 hover:border-white/20'}`} />
                    <button type="button" onClick={() => setShowConfirm(v => !v)} disabled={loading}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed mt-1">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-sm text-slate-400 mt-5">
                Already have an account?{' '}
                <Link to="/login" state={{ returnTo }} className="text-orange-400 hover:text-orange-300 font-medium transition">Sign in</Link>
              </p>
            </>
          )}
        </div>

        <p className="text-center mt-4">
          <Link to="/products" className="text-sm text-slate-500 hover:text-slate-300 transition">← Continue shopping without signing in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
