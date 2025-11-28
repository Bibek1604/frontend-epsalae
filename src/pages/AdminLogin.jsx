import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../components/store/authstore';
import toast, { Toaster } from 'react-hot-toast';
import { LogIn, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@epasaley.com');
  const [password, setPassword] = useState('ePasaley@SecureAdmin2025!');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return toast.error('Please fill all fields');
    }

    setLoading(true);
    try {
      // 1️⃣ SEND LOGIN REQUEST TO BACKEND
      console.log('📤 Sending login request...');
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('📥 Response received:', data);

      if (!response.ok) {
        return toast.error(data.message || 'Login failed');
      }

      // 2️⃣ GET TOKEN FROM RESPONSE (Handle multiple response formats)
      let token = data.data?.token || data.token || data.accessToken;
      let admin = data.data?.admin || data.data?.user || data.user || data.admin;

      console.log('🔑 Token:', token ? '✅ Found' : '❌ Not found');
      console.log('👤 Admin:', admin ? '✅ Found' : '❌ Not found');

      if (!token) {
        console.error('❌ No token in response:', data);
        return toast.error('No token received from server');
      }

      // 3️⃣ SAVE TOKEN TO LOCALSTORAGE
      localStorage.setItem('adminToken', token);
      if (admin) {
        localStorage.setItem('admin', JSON.stringify(admin));
      }
      console.log('💾 Token saved to localStorage');

      // 4️⃣ UPDATE ZUSTAND STORE
      login(token, admin);
      console.log('✅ Zustand store updated');

      toast.success('Login successful! 🎉');
      
      // 5️⃣ REDIRECT TO ADMIN DASHBOARD
      console.log('🚀 Redirecting to dashboard...');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('❌ Login error:', error);
      toast.error('Login error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full mb-4">
              <LogIn size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-500 mt-2">Enter your credentials to access the admin panel</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-600 focus:outline-none transition bg-gray-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-600 focus:outline-none transition bg-gray-50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Login to Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Only authorized admins can access this panel
          </p>
        </div>
      </div>
    </div>
  );
}
