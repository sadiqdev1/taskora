import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMail, IoLockClosed, IoEye, IoEyeOff } from 'react-icons/io5';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Process login
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo + heading */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary shadow-lg shadow-primary/30 mb-4">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Sign in to your Taskora account
          </p>
        </div>

        {/* Single unified card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          {/* Email form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-semibold text-gray-600 dark:text-zinc-400">
                Email
              </label>
              <div className="relative">
                <IoMail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  required
                  autoFocus
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-gray-600 dark:text-zinc-400">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-dark font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <IoLockClosed size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-11 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition"
                >
                  {showPassword ? <IoEyeOff size={15} /> : <IoEye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md hover:shadow-primary/25 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-xs text-gray-500 dark:text-zinc-400 text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-dark font-semibold transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
