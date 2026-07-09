'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Mail, CheckCircle2, Lock, ShieldCheck, Zap } from 'lucide-react';

const HIGHLIGHTS = [
  { Icon: Lock,        text: 'Your account is safe & protected'  },
  { Icon: ShieldCheck, text: 'Reset link expires in 60 minutes'  },
  { Icon: Zap,         text: 'Back earning in under 2 minutes'   },
];

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email) { setError('Email is required.'); return; }
    setLoading(true); setError('');
    try {
      // Use apiPost — raw fetch('/api/...') hits Next.js, not Laravel
      const { apiPost } = await import('@/lib/api');
      await apiPost('/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: 'var(--bg)' }}>

      {/* ── Left panel — animated illustration ── */}
      <div className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:w-[46%] shrink-0 relative overflow-hidden flex-col justify-between p-10 gap-8"
        style={{ background: 'linear-gradient(135deg, #2d1b6e 0%, #4a2fa0 50%, #2d1b6e 100%)' }}>

        {/* Background photo */}
        <img
          src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=900&q=80&fit=crop&crop=center"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.3, mixBlendMode: 'luminosity' }}
          draggable={false}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(45,27,110,0.65) 0%, rgba(74,47,160,0.55) 50%, rgba(45,27,110,0.7) 100%)' }} />

        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { w: 280, h: 280, top: '-50px',  left: '-40px', delay: '0s',   dur: '9s',  opacity: 0.12 },
            { w: 180, h: 180, top: '40%',    left: '65%',  delay: '2s',   dur: '11s', opacity: 0.09 },
            { w: 150, h: 150, top: '70%',    left: '-20px',delay: '1s',   dur: '8s',  opacity: 0.11 },
            { w: 110, h: 110, top: '8%',     left: '72%',  delay: '0.6s', dur: '7s',  opacity: 0.14 },
            { w: 220, h: 220, top: '78%',    left: '52%',  delay: '3s',   dur: '12s', opacity: 0.07 },
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

        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(162,155,254,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(162,155,254,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline relative z-10">
          <span className="w-9 h-9 rounded-xl bg-[#6C5CE7] flex items-center justify-center text-white text-sm font-black shrink-0"
            style={{ boxShadow: '0 4px 14px rgba(108,92,231,0.5)' }}>T</span>
          <span className="text-white font-black text-[1.05rem] tracking-tight">Taskora</span>
        </Link>

        {/* Copy */}
        <div className="relative z-10 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full w-fit"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#A29BFE' }} />
            <span className="text-[0.7rem] font-bold uppercase tracking-widest text-white/80">Password recovery</span>
          </div>
          <h2 className="text-white font-black leading-tight tracking-tight" style={{ fontSize: 'clamp(1.9rem,3vw,2.8rem)' }}>
            Reset in<br />
            <span className="gradient-text-light">seconds.</span>
          </h2>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
            We&apos;ll send a secure link to your email. Click it and choose a new password — your earnings stay safe.
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

        {/* Bottom note */}
        <div className="relative z-10 inline-flex items-center gap-3 px-4 py-2.5 rounded-xl w-fit"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
          <ShieldCheck size={15} strokeWidth={1.8} style={{ color: '#A29BFE', flexShrink: 0 }} />
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Reset links are encrypted &amp; single-use
          </span>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden self-start mb-8">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <span className="gradient-brand w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black">T</span>
            <span className="font-black text-[1rem] tracking-tight" style={{ color: 'var(--text)' }}>Taskora</span>
          </Link>
        </div>

        <div className="w-full max-w-[380px] flex flex-col gap-5">
          {sent ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center text-center gap-5">
              <span className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#D4F6EE', color: '#00875A' }}>
                <CheckCircle2 size={32} strokeWidth={1.8} />
              </span>
              <div>
                <h1 className="font-black text-2xl tracking-tight mb-2" style={{ color: 'var(--text)' }}>Check your email</h1>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  We sent a reset link to <strong>{email}</strong>. Follow the instructions in the email to reset your password.
                </p>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Didn&apos;t receive it?{' '}
                <button onClick={() => { setSent(false); setError(''); }} className="font-bold hover:underline underline-offset-2" style={{ color: '#6C5CE7' }}>
                  Resend
                </button>
              </p>
              <Link href="/login" className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
                <ArrowLeft size={14} strokeWidth={2} /> Back to Sign In
              </Link>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
                    <Mail size={18} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h1 className="font-black text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Forgot password?</h1>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Enter your email to receive a reset link.</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
                  <AlertCircle size={15} strokeWidth={2.2} className="shrink-0" /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Email address</label>
                  <input
                    id="email" type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="auth-input"
                  />
                </div>

                <button type="submit" disabled={loading}
                  className="bg-[#6C5CE7] hover:bg-[#5A4BD1] w-full py-3 rounded-xl text-white text-sm font-black disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  style={{ boxShadow: '0 4px 18px rgba(108,92,231,0.3)' }}>
                  {loading && <span className="btn-spinner" />}
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <Link href="/login" className="flex items-center justify-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
                <ArrowLeft size={14} strokeWidth={2} /> Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
