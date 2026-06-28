'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Gift, Banknote, Zap, Users, AlertCircle, ArrowLeft } from 'lucide-react';

/* ── Input component ── */
function Field({ id, name, type = 'text', label, placeholder, autoComplete, value, onChange, error, helper, rightSlot }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === 'password';

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-bold" style={{ color: 'var(--text)', letterSpacing: '0.01em' }}>{label}</label>
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
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            {showPw ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
          </button>
        )}
      </div>
      {error  && <p className="text-xs font-semibold flex items-center gap-1 text-red-600"><AlertCircle size={11} strokeWidth={2.2} />{error}</p>}
      {helper && !error && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{helper}</p>}
    </div>
  );
}

const PERKS = [
  { Icon: Gift,     text: 'Free $5 bonus on sign-up'     },
  { Icon: Banknote, text: 'Withdraw from just $10'        },
  { Icon: Zap,      text: 'Get approved in under 24 h'   },
  { Icon: Users,    text: 'Earn 10% from every referral' },
];

export default function RegisterPage() {
  const router      = useRouter();
  const { setUser } = useAuth();
  const [form, setForm]       = useState({ name:'', email:'', password:'', password_confirmation:'', referral_code:'' });
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
    if (!form.name.trim())         n.name  = 'Full name is required.';
    if (!form.email)               n.email = 'Email is required.';
    if (form.password.length < 8)  n.password = 'Minimum 8 characters.';
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
      router.replace('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: 'var(--bg)' }}>

      {/* ── Left image panel — desktop only ── */}
      <div className="hidden lg:block lg:sticky lg:top-0 lg:h-screen lg:w-[46%] shrink-0 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80&fit=crop&crop=faces,top"
          alt="Professional working online"
          className="absolute inset-0 w-full h-full object-cover object-top"
          draggable={false}
        />
        <div className="auth-overlay" />
        <div className="relative z-10 h-full flex flex-col justify-between p-9 gap-8">

          <div className="flex items-center gap-2.5">
            <span className="gradient-brand w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-sm font-black shrink-0"
              style={{ boxShadow:'0 4px 14px rgba(108,92,231,0.5)' }}>T</span>
            <span className="text-white font-bold text-[1.05rem] tracking-[-0.025em]">Taskora</span>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-white font-black leading-[1.1] tracking-[-0.035em]"
              style={{ fontSize:'clamp(1.8rem,3vw,2.7rem)' }}>
              Start earning today.<br />
              <span className="gradient-text-light">It&apos;s free.</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color:'rgba(255,255,255,0.55)' }}>
              Join 50,000+ earners making real money from social media tasks — from home, on your schedule.
            </p>
            <ul className="flex flex-col gap-2.5 mt-2">
              {PERKS.map(p => (
                <li key={p.text} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 border"
                    style={{ background:'rgba(108,92,231,0.28)', borderColor:'rgba(108,92,231,0.3)', color:'var(--primary-light)' }}>
                    <p.Icon size={14} strokeWidth={2} />
                  </span>
                  <span className="text-sm font-semibold" style={{ color:'rgba(255,255,255,0.82)' }}>{p.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[['50K+','Earners'],['$2.1M','Paid Out'],['98.5%','Success']].map(([v,l]) => (
              <div key={l} className="flex flex-col items-center gap-0.5 py-3 px-2 rounded-xl text-center"
                style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)', backdropFilter:'blur(8px)' }}>
                <span className="text-white font-black text-[1.05rem] tracking-tight">{v}</span>
                <span className="text-[0.62rem] font-semibold uppercase tracking-widest" style={{ color:'rgba(255,255,255,0.4)' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form side ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-14 overflow-y-auto">
        <div className="lg:hidden self-start mb-8 flex items-center gap-2.5">
          <span className="gradient-brand w-9 h-9 rounded-[10px] flex items-center justify-center text-white text-sm font-black">T</span>
          <span className="font-bold text-[1rem] tracking-tight" style={{ color:'var(--text)' }}>Taskora</span>
        </div>

        <div className="w-full max-w-[400px] flex flex-col gap-5 bg-white rounded-2xl p-8 shadow-sm lg:bg-transparent lg:shadow-none lg:p-0">
          <div>
            <h1 className="font-black text-[1.75rem] leading-tight tracking-[-0.03em]" style={{ color:'var(--text)' }}>
              Create your account
            </h1>
            <p className="text-sm mt-1" style={{ color:'var(--text-secondary)' }}>
              Already have one?{' '}
              <Link href="/login" className="font-bold hover:underline underline-offset-2" style={{ color:'var(--primary)' }}>Sign in</Link>
            </p>
          </div>

          {serverError && (
            <div role="alert" className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background:'#FFF0F0', color:'#C0392B', border:'1px solid #FFD0D0' }}>
              <AlertCircle size={15} strokeWidth={2.2} className="shrink-0" /> {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
            <Field id="name" name="name" label="Full name" placeholder="Alex Johnson"
              autoComplete="name" value={form.name} onChange={handleChange} error={errors.name} />
            <Field id="email" name="email" type="email" label="Email address"
              placeholder="you@example.com" autoComplete="email"
              value={form.email} onChange={handleChange} error={errors.email} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Field id="password" name="password" type="password" label="Password"
                placeholder="Min. 8 characters" autoComplete="new-password"
                value={form.password} onChange={handleChange} error={errors.password} />
              <Field id="password_confirmation" name="password_confirmation" type="password"
                label="Confirm password" placeholder="••••••••" autoComplete="new-password"
                value={form.password_confirmation} onChange={handleChange} error={errors.password_confirmation} />
            </div>
            <Field id="referral_code" name="referral_code" label="Referral code (optional)"
              placeholder="e.g. REF12345"
              value={form.referral_code} onChange={handleChange}
              helper="Have a code? You both earn a $5 bonus." />

            <button type="submit" disabled={loading}
              className="bg-[#6C5CE7] hover:bg-[#5A4BD1] w-full py-3.5 rounded-xl text-white text-sm font-black mt-1 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              style={{ boxShadow:'0 4px 18px rgba(108,92,231,0.38)', letterSpacing:'-0.01em' }}>
              {loading && <span className="btn-spinner" />}
              {loading ? 'Creating account…' : 'Create free account'}
            </button>
          </form>

          <p className="text-xs text-center leading-relaxed" style={{ color:'var(--text-muted)' }}>
            By creating an account you agree to our{' '}
            <span className="underline underline-offset-2 cursor-pointer" style={{ color:'var(--text-secondary)' }}>Terms</span>
            {' '}and{' '}
            <span className="underline underline-offset-2 cursor-pointer" style={{ color:'var(--text-secondary)' }}>Privacy Policy</span>.
          </p>
          <Link href="/" className="flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors hover:text-[var(--primary)]"
            style={{ color:'var(--text-secondary)' }}>
            <ArrowLeft size={12} strokeWidth={2} /> Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
