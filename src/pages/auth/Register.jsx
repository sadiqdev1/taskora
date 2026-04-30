import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMail, IoLockClosed, IoEye, IoEyeOff, IoPerson } from 'react-icons/io5';

const getStrength = (pwd) => {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
const strengthText = ['', 'text-red-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'];

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);

  const strength = getStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo + heading */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary shadow-lg shadow-primary/30 mb-3">
            <span className="text-white font-bold text-base">T</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
            Create account
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Join the Taskora community
          </p>
        </div>

        {/* Single unified card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
          {/* Email form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
            {/* Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="block text-xs font-semibold text-gray-600 dark:text-zinc-400">
                Full Name
              </label>
              <div className="relative">
                <IoPerson size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  id="name"
                  required
                  autoFocus
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-700"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold text-gray-600 dark:text-zinc-400">
                Email
              </label>
              <div className="relative">
                <IoMail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-700"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-semibold text-gray-600 dark:text-zinc-400">
                Password
              </label>
              <div className="relative">
                <IoLockClosed size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
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
                  {showPassword ? <IoEyeOff size={14} /> : <IoEye size={14} />}
                </button>
              </div>
              {formData.password && (
                <div className="space-y-1 pt-0.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          strength >= i ? strengthColor[strength] : 'bg-gray-200 dark:bg-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${strengthText[strength]}`}>
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="password_confirmation" className="block text-xs font-semibold text-gray-600 dark:text-zinc-400">
                Confirm Password
              </label>
              <div className="relative">
                <IoLockClosed size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="password_confirmation"
                  required
                  placeholder="••••••••"
                  value={formData.password_confirmation}
                  onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                  className="w-full pl-10 pr-11 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition bg-gray-50 dark:bg-zinc-800 focus:bg-white dark:focus:bg-zinc-700"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition"
                >
                  {showConfirm ? <IoEyeOff size={14} /> : <IoEye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md hover:shadow-primary/25 active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-xs text-gray-500 dark:text-zinc-400 text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-dark font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
