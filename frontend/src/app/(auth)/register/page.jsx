'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Eye, EyeOff, Gift, Banknote, Zap, Users, AlertCircle } from 'lucide-react';

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

function Field({ id, name, type = 'text', label, placeholder, autoComplete, value, onChange, error, helper }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === 'password';
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</label>
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
      {error  && <p className="text-xs font-semibold flex items-center gap-1 text-red-600"><AlertCircle size={11} strokeWidth={2.2} /> {error}</p>}
      {helper && !error && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{helper}</p>}
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length;
  const labels = ['Too weak', 'Weak', 'Fair', 'Strong'];
  const colors = ['#C0392B', '#E67E22', '#F39C12', '#00875A'];
  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score - 1] : 'var(--border)' }} />
        ))}
      </div>
      <p className="text-xs font-semibold" style={{ color: colors[score - 1] || 'var(--text-muted)' }}>
        {labels[score - 1] || 'Enter a password'}
      </p>
    </div>
  );
}

const PERKS = [
  { Icon: Gift,     text: 'Free to join — no credit card' },
  { Icon: Banknote, text: 'Withdraw from just $10'        },
  { Icon: Zap,      text: 'Get approved in under 24 h'   },
  { Icon: Users,    text: 'Earn 10% from every referral' },
];

const GOOGLE_AUTH_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/google/redirect`;

export default function RegisterPage() {
  const router      = useRouter();
  const { setUser } = useAuth();
  const toast       = useToast();
  const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '', referral_code: '' });
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
    if (!form.name.trim())        n.name  = 'Full name is required.';
    if (!form.email)              n.email = 'Email is required.';
    if (form.password.length < 8) n.password = 'Minimum 8 characters.';
    if (form.password !== form.password_confirmation) n.password_confirmation = 'Passwords do not match.';
    setErrors(n);
    return !Object.keys(n).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await register(form);
      setUser(user);
      toast.success('Account created! Welcome to Taskora.');
      router.replace('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: 'var(--bg)' }}>

      {/* ── Left panel — animated illustration ── */}
      <div className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:w-[46%] shrink-0 relative overflow-hidden flex-col justify-between p-10 gap-8"
        style={{ background: 'linear-gradient(135deg, #1a1040 0%, #2d1b6e 50%, #1a1040 100%)' }}>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { w: 300, h: 300, top: '-60px',  left: '-40px', delay: '0s',   dur: '9s',  opacity: 0.11 },
            { w: 200, h: 200, top: '25%',    left: '65%',  delay: '2s',   dur: '10s', opacity: 0.09 },
            { w: 160, h: 160, top: '60%',    left: '-20px',delay: '1s',   dur: '8s',  opacity: 0.12 },
            { w: 130, h: 130, top: '5%',     left: '78%',  delay: '0.8s', dur: '7s',  opacity: 0.14 },
            { w: 240, h: 240, top: '70%',    left: '50%',  delay: '3s',   dur: '11s', opacity: 0.07 },
          ].map((c, i) => (
            <div key={i} className="absolute rounded-full"
              style={{
                width: c.w, height: c.h, top: c.top, left: c.left,
                background: 'radial-gradient(circle, rgba(162,155,254,1) 0%, rgba(108,92,231,0.3) 60%, transparent 100%)',
                opacity: c.opacity,
                animation: `float-circle ${c.dur} ease-in-out ${c.delay} infinite alternate`,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(162,155,254,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(162,155,254,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <Link href="/" className="flex items-center gap-2.5 no-underline relative z-10">
          <span className="gradient-brand w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0"
            style={{ boxShadow: '0 4px 14px rgba(108,92,231,0.5)' }}>T</span>
          <span className="text-white font-black text-[1.05rem] tracking-tight">Taskora</span>
        </Link>

        <div className="relative z-10 flex flex-col gap-4">
          <h2 className="text-white font-black leading-tight tracking-tight" style={{ fontSize: 'clamp(1.9rem,3vw,2.8rem)' }}>
            Start earning today.<br />
            <span className="gradient-text-light">It&apos;s free.</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Join 50,000+ earners making real money from social media tasks — from home, on your schedule.
          </p>
          <ul className="flex flex-col gap-2.5 mt-1">
            {PERKS.map(p => (
              <li key={p.text} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(108,92,231,0.3)', color: '#A29BFE', border: '1px solid rgba(108,92,231,0.35)' }}>
                  <p.Icon size={14} strokeWidth={2} />
                </span>
                <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.82)' }}>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-2">
          {[['50K+', 'Earners'], ['$2.1M', 'Paid Out'], ['98.5%', 'Success']].map(([v, l]) => (
            <div key={l} className="flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl text-center"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
              <span className="text-white font-black text-[1.05rem] tracking-tight">{v}</span>
              <span className="text-[0.62rem] font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</span>
            </div>
          ))}
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

        <div className="w-full max-w-[420px] flex flex-col gap-5">
          <div>
            <h1 className="font-black text-2xl leading-tight tracking-tight" style={{ color: 'var(--text)' }}>
              Create your account
            </h1>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
              Already have one?{' '}
              <Link href="/login" className="font-bold hover:underline underline-offset-2" style={{ color: '#6C5CE7' }}>
                Sign in
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
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>or sign up with email</span>
            <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {serverError && (
            <div role="alert" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
              <AlertCircle size={15} strokeWidth={2.2} className="shrink-0" /> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Field id="name" name="name" label="Full name" placeholder="Alex Johnson"
              autoComplete="name" value={form.name} onChange={handleChange} error={errors.name} />
            <Field id="email" name="email" type="email" label="Email address"
              placeholder="you@example.com" autoComplete="email"
              value={form.email} onChange={handleChange} error={errors.email} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-0">
                <Field id="password" name="password" type="password" label="Password"
                  placeholder="Min. 8 characters" autoComplete="new-password"
                  value={form.password} onChange={handleChange} error={errors.password} />
                <PasswordStrength password={form.password} />
              </div>
              <Field id="password_confirmation" name="password_confirmation" type="password"
                label="Confirm password" placeholder="••••••••" autoComplete="new-password"
                value={form.password_confirmation} onChange={handleChange} error={errors.password_confirmation} />
            </div>
            <Field id="referral_code" name="referral_code" label="Referral code (optional)"
              placeholder="e.g. REF12345"
              value={form.referral_code} onChange={handleChange}
              helper="Have a referral code? Enter it here." />

            <button type="submit" disabled={loading}
              className="bg-[#6C5CE7] hover:bg-[#5A4BD1] w-full py-3.5 rounded-xl text-white text-sm font-black disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 18px rgba(108,92,231,0.35)' }}>
              {loading && <span className="btn-spinner" />}
              {loading ? 'Creating account…' : 'Create free account'}
            </button>
          </form>

          <p className="text-xs text-center leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            By creating an account you agree to our{' '}
            <span className="underline cursor-pointer" style={{ color: 'var(--text-secondary)' }}>Terms</span>
            {' '}&amp;{' '}
            <span className="underline cursor-pointer" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</span>.
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="flex -space-x-2">
              {['A','M','S','J','P'].map((l, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[0.6rem] font-black shrink-0"
                  style={{ background: ['#6C5CE7','#00B894','#E17055','#0984E3','#A29BFE'][i] }}>
                  {l}
                </div>
              ))}
            </div>
            <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Join <span className="font-bold" style={{ color: 'var(--text)' }}>50,000+</span> earners already on the platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
