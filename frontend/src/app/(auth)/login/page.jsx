'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, AlertCircle, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

/* ── Google OAuth icon ── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.859-3.048.859-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.705A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.705V4.963H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.037l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.963L3.964 7.295C4.672 5.169 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function Field({ id, name, type = 'text', label, placeholder, autoComplete, value, onChange, error, rightSlot }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === 'password';
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</label>
        {rightSlot}
      </div>
      <div className="relative">
        <input
          id={id} name={name}
          type={isPw ? (showPw ? 'text' : 'password') : type}
          placeholder={placeholder} autoComplete={autoComplete}
          value={value} onChange={onChange}
          className={`auth-input${error ? ' error' : ''}`}
          style={{ paddingRight: isPw ? 44 : undefined }}
        />
        {isPw && (
          <button type="button" tabIndex={-1} onClick={() => setShowPw(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md"
            style={{ color: 'var(--text-muted)' }}>
            {showPw ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs font-semibold flex items-center gap-1 text-red-600">
          <AlertCircle size={11} strokeWidth={2.2} /> {error}
        </p>
      )}
    </div>
  );
}

const HIGHLIGHTS = [
  { Icon: Sparkles,    text: '500+ live campaigns right now'      },
  { Icon: TrendingUp,  text: 'Earnings credited instantly'        },
  { Icon: ShieldCheck, text: 'Verified campaigns, secure payouts' },
];

const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/google/redirect`;

export default function LoginPage() {
  const router      = useRouter();
  const { setUser } = useAuth();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (serverError)  setServerError('');
  }

  function validate() {
    const n = {};
    if (!form.email)    n.email    = 'Email is required.';
    if (!form.password) n.password = 'Password is required.';
    setErrors(n);
    return !Object.keys(n).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form);
      setUser(user);
      router.replace(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setServerError(err.message || 'Invalid email or password.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: 'var(--bg)' }}>

      {/* ── Left panel — desktop only ── */}
      <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:w-[46%] shrink-0 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80&fit=crop&crop=faces,center"
          alt="Professional workspace"
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />
        <div className="auth-overlay" />
        <div className="relative z-10 h-full flex flex-col justify-between p-10 gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <span className="gradient-brand w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0"
              style={{ boxShadow: '0 4px 14px rgba(108,92,231,0.5)' }}>T</span>
            <span className="text-white font-black text-[1.05rem] tracking-tight">Taskora</span>
          </Link>

          {/* Copy */}
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full w-fit"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)' }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#A29BFE' }} />
              <span className="text-[0.7rem] font-bold uppercase tracking-widest text-white/80">Welcome back</span>
            </div>
            <h2 className="text-white font-black leading-tight tracking-tight" style={{ fontSize: 'clamp(1.9rem,3vw,2.8rem)' }}>
              Good to see<br />
              <span className="gradient-text-light">you again.</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Your tasks are live and earnings are waiting. Sign in and pick up right where you left off.
            </p>
            <ul className="flex flex-col gap-2.5 mt-1">
              {HIGHLIGHTS.map(h => (
                <li key={h.text} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(108,92,231,0.3)', color: '#A29BFE', border: '1px solid rgba(108,92,231,0.35)' }}>
                    <h.Icon size={14} strokeWidth={2} />
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.82)' }}>{h.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Live ticker */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl w-fit"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
              style={{ boxShadow: '0 0 0 4px rgba(52,211,153,0.2)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Earners made <strong className="text-white font-black">$4,280</strong> in the last hour
            </span>
          </div>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden self-start mb-8 flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <span className="gradient-brand w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black">T</span>
            <span className="font-black text-[1rem] tracking-tight" style={{ color: 'var(--text)' }}>Taskora</span>
          </Link>
        </div>

        <div className="w-full max-w-[400px] flex flex-col gap-5">
          <div>
            <h1 className="font-black text-2xl leading-tight tracking-tight" style={{ color: 'var(--text)' }}>
              Sign in to Taskora
            </h1>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold hover:underline underline-offset-2" style={{ color: '#6C5CE7' }}>
                Create one free
              </Link>
            </p>
          </div>

          {/* Google OAuth */}
          <a href={GOOGLE_AUTH_URL}
            className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border-2 text-sm font-semibold transition-all hover:shadow-md hover:border-gray-300 active:scale-[.98]"
            style={{ background: 'white', borderColor: 'var(--border)', color: 'var(--text)' }}>
            <GoogleIcon />
            Continue with Google
          </a>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>or sign in with email</span>
            <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {serverError && (
            <div role="alert" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
              <AlertCircle size={15} strokeWidth={2.2} className="shrink-0" /> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Field id="email" name="email" type="email" label="Email address"
              placeholder="you@example.com" autoComplete="email"
              value={form.email} onChange={handleChange} error={errors.email} />
            <Field id="password" name="password" type="password" label="Password"
              placeholder="••••••••" autoComplete="current-password"
              value={form.password} onChange={handleChange} error={errors.password}
              rightSlot={
                <Link href="/forgot-password" className="text-xs font-semibold hover:underline underline-offset-2"
                  style={{ color: '#6C5CE7' }}>
                  Forgot password?
                </Link>
              }
            />
            <button type="submit" disabled={loading}
              className="bg-[#6C5CE7] hover:bg-[#5A4BD1] w-full py-3.5 rounded-xl text-white text-sm font-black disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 18px rgba(108,92,231,0.35)' }}>
              {loading && <span className="btn-spinner" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            By signing in you agree to our{' '}
            <span className="underline cursor-pointer" style={{ color: 'var(--text-secondary)' }}>Terms</span>
            {' '}&amp;{' '}
            <span className="underline cursor-pointer" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
