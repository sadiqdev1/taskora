'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';

function ResetForm() {
  const router  = useRouter();
  const params  = useSearchParams();
  const token   = params.get('token') || '';
  const email   = params.get('email') || '';

  const [form,    setForm]    = useState({ password: '', password_confirmation: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.password_confirmation) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      await apiFetch('/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, email, ...form }),
      });
      setSuccess(true);
      setTimeout(() => router.replace('/login'), 2500);
    } catch (err) {
      setError(err.message || 'Invalid or expired reset link.');
    } finally { setLoading(false); }
  }

  if (success) return (
    <div className="flex flex-col items-center gap-4 text-center py-8">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: '#D4F6EE' }}>
        <CheckCircle2 size={32} strokeWidth={1.8} style={{ color: '#00875A' }} />
      </div>
      <h2 className="font-black text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Password reset!</h2>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Redirecting you to sign in…</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-5 w-full max-w-[400px]">
      <div>
        <h1 className="font-black text-2xl tracking-tight" style={{ color: 'var(--text)' }}>Set new password</h1>
        <p className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
          For <strong>{email}</strong>
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
          style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
          <AlertCircle size={15} strokeWidth={2} className="shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {[
          { id: 'password',              label: 'New Password',      auto: 'new-password'     },
          { id: 'password_confirmation', label: 'Confirm Password',  auto: 'new-password'     },
        ].map(f => (
          <div key={f.id} className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{f.label}</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form[f.id]}
                onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                placeholder="••••••••"
                autoComplete={f.auto}
                className="auth-input"
                style={{ paddingRight: 44 }}
              />
              <button type="button" tabIndex={-1} onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
                style={{ color: 'var(--text-muted)' }}>
                {showPw ? <EyeOff size={15} strokeWidth={2} /> : <Eye size={15} strokeWidth={2} />}
              </button>
            </div>
          </div>
        ))}

        <button type="submit" disabled={loading}
          className="bg-[#6C5CE7] hover:bg-[#5A4BD1] w-full py-3.5 rounded-xl text-white text-sm font-black disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          style={{ boxShadow: '0 4px 18px rgba(108,92,231,0.35)' }}>
          {loading && <span className="btn-spinner" />}
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>

      <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
        <Link href="/login" className="font-semibold hover:underline" style={{ color: '#6C5CE7' }}>
          ← Back to Sign In
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--bg)' }}>
      <Suspense fallback={<div className="w-8 h-8 rounded-full border-4 animate-spin"
        style={{ borderColor: 'var(--border-subtle)', borderTopColor: '#6C5CE7' }} />}>
        <ResetForm />
      </Suspense>
    </div>
  );
}
