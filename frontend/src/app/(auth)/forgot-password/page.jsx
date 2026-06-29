'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

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
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message || 'Something went wrong.');
      }
      setSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-[400px] flex flex-col gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline mx-auto">
          <span className="w-9 h-9 rounded-xl bg-[#6C5CE7] flex items-center justify-center text-white text-sm font-black">T</span>
          <span className="font-black text-lg tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.025em' }}>Taskora</span>
        </Link>

        <div className="card rounded-2xl p-8 flex flex-col gap-5">
          {sent ? (
            /* ── Success state ── */
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <span className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#D4F6EE', color: '#00875A' }}>
                <CheckCircle2 size={28} strokeWidth={1.8} />
              </span>
              <div>
                <h1 className="font-black text-xl tracking-tight mb-1" style={{ color: 'var(--text)' }}>Check your email</h1>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
                </p>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Didn&apos;t receive it?{' '}
                <button onClick={() => { setSent(false); setLoading(false); }} className="font-semibold hover:underline underline-offset-2" style={{ color: '#6C5CE7' }}>
                  Send again
                </button>
              </p>
              <Link href="/login" className="flex items-center gap-1.5 text-sm font-semibold mt-2 hover:opacity-70 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
                <ArrowLeft size={14} strokeWidth={2} /> Back to Sign In
              </Link>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
                    <Mail size={18} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h1 className="font-black text-xl tracking-tight" style={{ color: 'var(--text)' }}>Forgot password?</h1>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>No worries, we&apos;ll send you reset instructions.</p>
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
