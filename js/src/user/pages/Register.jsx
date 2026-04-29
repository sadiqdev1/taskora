import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2, Check, X, AlertCircle } from 'lucide-react';
import { useToast } from '../../admin/Contexts/ToastContexts';
import chortleLogo from '../../assets/chortle-logo.svg';

const getStrength = (pwd) => {
  if (!pwd) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
};

const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

const Register = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState('idle'); // idle, checking, available, taken, invalid
  const [usernameTimer, setUsernameTimer] = useState(null);

  const strength = getStrength(password);

  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    // Validate format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameStatus('invalid');
      return;
    }

    // Clear previous timer
    if (usernameTimer) {
      clearTimeout(usernameTimer);
    }

    // Set checking status
    setUsernameStatus('checking');

    // Debounce API call
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/check-username/${username}`);
        const data = await response.json();
        setUsernameStatus(data.available ? 'available' : 'taken');
      } catch (error) {
        console.error('Username check failed:', error);
        setUsernameStatus('idle');
      }
    }, 500);

    setUsernameTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [username]);

  const getUsernameIcon = () => {
    switch (usernameStatus) {
      case 'checking':
        return <Loader2 size={15} className="animate-spin text-gray-400" />;
      case 'available':
        return <Check size={15} className="text-green-500" />;
      case 'taken':
        return <X size={15} className="text-red-500" />;
      case 'invalid':
        return <AlertCircle size={15} className="text-orange-500" />;
      default:
        return null;
    }
  };

  const getUsernameMessage = () => {
    switch (usernameStatus) {
      case 'available':
        return <p className="text-xs text-green-600 mt-1">Username is available!</p>;
      case 'taken':
        return <p className="text-xs text-red-600 mt-1">Username is already taken</p>;
      case 'invalid':
        return <p className="text-xs text-orange-600 mt-1">Only letters, numbers, and underscores allowed</p>;
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) { 
      toast.addToast('Full name is required', 'error'); 
      return; 
    }
    
    if (!username.trim() || username.length < 3) { 
      toast.addToast('Username must be at least 3 characters', 'error'); 
      return; 
    }
    
    if (usernameStatus !== 'available') {
      toast.addToast('Please choose an available username', 'error');
      return;
    }
    
    if (!email.trim()) { 
      toast.addToast('Email is required', 'error'); 
      return; 
    }
    
    if (!password || password.length < 8) { 
      toast.addToast('Password must be at least 8 characters', 'error'); 
      return; 
    }
    
    setLoading(true);
    
    try {
      // Simulate API call - replace with actual registration endpoint
      await new Promise((r) => setTimeout(r, 1200));
      toast.addToast('Account created successfully!', 'success');
      navigate('/');
    } catch (error) {
      toast.addToast('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500 shadow-lg mb-4">
            <img src={chortleLogo} alt="Chortle" className="h-8 w-8 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-sm text-gray-500 mt-1">Join the Chortle community</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">

          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-50 focus:bg-white"
                required 
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="johndoe"
                className="w-full pl-8 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-50 focus:bg-white"
                required 
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {getUsernameIcon()}
              </div>
            </div>
            {getUsernameMessage()}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-50 focus:bg-white"
                required 
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-xs font-semibold text-gray-700 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition bg-gray-50 focus:bg-white"
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {password && (
              <div className="space-y-1.5 pt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${strength >= i ? strengthColor[strength] : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className={`text-xs font-medium ${strength <= 1 ? 'text-red-500' : strength === 2 ? 'text-yellow-600' : strength === 3 ? 'text-blue-600' : 'text-green-600'}`}>
                  {strengthLabel[strength]}
                </p>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading || usernameStatus === 'taken' || usernameStatus === 'invalid' || usernameStatus === 'checking'}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-md active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create account'}
          </button>

          <p className="text-xs text-gray-500 text-center pt-1">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
