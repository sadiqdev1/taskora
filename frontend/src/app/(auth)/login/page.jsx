'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, AlertCircle, ArrowLeft, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

function Field({ id, name, type = 'text', label, placeholder, autoComplete, value, onChange, error, rightSlot }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === 'password';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-bold" style={{ color:'var(--text)', letterSpacing:'0.01em' }}>{label}</label>
        {rightSlot}
      </div>
      <div className="relative">
        <input
          id={id} name={name} type={isPw ? (showPw ? 'text' : 'password') : type}
          placeholder={placeholder} autoComplete={autoComplete}
          value={value} onChange={onChange}
          className={`auth-input${error ? ' error' : ''}`}
          style={{ paddingRight: isPw ? 44 : undefined }}
        />
        {isPw && (
          <button type="button" tabIndex={-1} onClick={() => setShowPw(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md"
            style={{ color:'var(--text-muted)' }}>
            {showPw ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs font-semibold flex items-center gap-1 text-red-600"><AlertCircle size={11} strokeWidth={2.2} />{error}</p>}
    </div>
  );
}

const HIGHLIGHTS = [
  { Icon: Sparkles,    text: '500+ live campaigns right now'       },
  { Icon: TrendingUp,  text: 'Earnings hit your wallet instantly'  },
  { Icon: ShieldCheck, text: 'Verified campaigns, secure payouts'  },
];

export default function LoginPage() {
  const router      = useRouter();
  const { setUser } = useAuth();
  const [form, setForm]       = useState({ email:'', password:'' });
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
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background:'var(--bg)' }}>

      {/* ── Left image panel — desktop only ── */}
      <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:w-[46%] shrink-0 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80&fit=crop&crop=faces,center"
          alt="Professional workspace"
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />
        <div className="auth-overlay" />
        <div className="relative z-10 h-full flex flex-col justify-between p-9 gap-8">

          <div className="flex items-center gap-2.5">
            <span className="gradient-brand w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-sm font-black shrink-0"
              style={{ boxShadow:'0 4px 14px rgba(108,92,231,0.5)' }}>T</span>
            <span className="text-white font-bold text-[1.05rem] tracking-[-0.025em]">Taskora</span>
          </div>

          <div className="flex flex-col gap-4">
            {/* Welcome badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full w-fit"
              style={{ background:'rgba(255,255,255,0.12)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.18)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary-light)] pulse-dot" />
              <span className="text-[0.7rem] font-bold uppercase tracking-widest text-white/80">Welcome back</span>
            </div>

            <h2 className="text-white font-black leading-[1.1] tracking-[-0.035em]"
              style={{ fontSize:'clamp(1.8rem,3vw,2.7rem)' }}>
              Good to see<br />
              <span className="gradient-text-light">you again.</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color:'rgba(255,255,255,0.55)' }}>
              Your campaigns are live and earnings are waiting. Sign in and pick up right where you left off.
            </p>

            <ul className="flex flex-col gap-2.5 mt-1">
              {HIGHLIGHTS.map(h => (
                <li key={h.text} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 border"
                    style={{ background:'rgba(108,92,231,0.28)', borderColor:'rgba(108,92,231,0.3)', color:'var(--primary-light)' }}>
                    <h.Icon size={14} strokeWidth={2} />
                  </span>
                  <span className="text-sm font-semibold" style={{ color:'rgba(255,255,255,0.82)' }}>{h.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Live earnings ticker */}
          <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl w-fit"
            style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(10px)' }}>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"
              style={{ boxShadow:'0 0 0 4px rgba(52,211,153,0.2)', animation:'pulse-dot 2s ease-in-out infinite' }} />
            <span className="text-sm" style={{ color:'rgba(255,255,255,0.65)' }}>
              Earners made <strong className="text-white font-black">$4,280</strong> in the last hour
            </span>
          </div>
        </div>
      </div>

      {/* ── Right form side ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 overflow-y-auto">
        <div className="lg:hidden self-start mb-8 flex items-center gap-2.5">
          <span className="gradient-brand w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-sm font-black">T</span>
          <span className="font-bold text-[1rem] tracking-tight" style={{ color:'var(--text)' }}>Taskora</span>
        </div>

        <div className="w-full max-w-[380px] flex flex-col gap-5 bg-white rounded-2xl p-8 shadow-sm lg:bg-transparent lg:shadow-none lg:p-0">
          <div>
            <h1 className="font-black text-[1.75rem] leading-tight tracking-[-0.03em]" style={{ color:'var(--text)' }}>
              Sign in to Taskora
            </h1>
            <p className="text-sm mt-1" style={{ color:'var(--text-secondary)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold hover:underline underline-offset-2" style={{ color:'var(--primary)' }}>
                Create one free
              </Link>
            </p>
          </div>

          {serverError && (
            <div role="alert" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background:'#FFF0F0', color:'#C0392B', border:'1px solid #FFD0D0' }}>
              <AlertCircle size={15} strokeWidth={2.2} className="shrink-0" /> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
            <Field id="email" name="email" type="email" label="Email address"
              placeholder="you@example.com" autoComplete="email"
              value={form.email} onChange={handleChange} error={errors.email} />

            <Field id="password" name="password" type="password" label="Password"
              placeholder="••••••••" autoComplete="current-password"
              value={form.password} onChange={handleChange} error={errors.password}
              rightSlot={
                <Link href="/forgot-password"
                  className="text-[0.72rem] font-bold hover:underline underline-offset-2"
                  style={{ color:'var(--primary)' }}>
                  Forgot password?
                </Link>
              }
            />

            <button type="submit" disabled={loading}
              className="bg-[#6C5CE7] hover:bg-[#5A4BD1] w-full py-3.5 rounded-xl text-white text-sm font-black mt-1 disabled:opacity-50 transition-colors"
              style={{ boxShadow:'0 4px 18px rgba(108,92,231,0.38)', letterSpacing:'-0.01em' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="flex items-center gap-3" style={{ color:'var(--text-muted)' }}>
            <span className="flex-1 h-px bg-[var(--border)]" />
            <span className="text-xs font-semibold">New to Taskora?</span>
            <span className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <Link href="/register"
            className="block w-full py-3 rounded-xl text-sm font-bold text-center border-2 border-[var(--border)] bg-white transition-colors hover:border-[var(--primary-light)] hover:bg-[var(--primary-muted)]"
            style={{ color:'var(--text)' }}>
            Create a free account — earn $5 instantly
          </Link>

          <Link href="/" className="flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors hover:text-[var(--primary)]"
            style={{ color:'var(--text-secondary)' }}>
            <ArrowLeft size={12} strokeWidth={2} /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
