'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { apiGet, apiPost } from '@/lib/api';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle2, AlertCircle, Loader2, Shield, ExternalLink,
} from 'lucide-react';

function fmtNGN(n) {
  return '₦' + parseFloat(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 });
}

const PRESETS = [500, 1000, 2000, 5000, 10000, 20000];

export default function DepositPage() {
  const { user } = useAuth();
  const [amount,  setAmount]  = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [wallet,  setWallet]  = useState(null);

  useEffect(() => {
    apiGet('/wallet').then(setWallet).catch(() => {});
  }, []);

  async function handleDeposit(e) {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt < 100) { setError('Minimum deposit is ₦100.'); return; }

    if (!user?.email) {
      setError('Unable to load your account details. Please refresh and try again.');
      return;
    }

    setLoading(true); setError('');

    try {
      const data = await apiPost('/deposit/initialize', { amount: amt });
      if (!data?.authorization_url) {
        throw new Error('Payment initialization failed. Please try again.');
      }
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(err?.message || 'Could not initialize payment. Please try again.');
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="Deposit Funds" subtitle="Top up your Taskora wallet">
      <div className="max-w-md mx-auto flex flex-col gap-5">

        <Link href="/wallet"
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity w-fit"
          style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={14} strokeWidth={2} /> Back to Wallet
        </Link>

        {/* Current balance */}
        {wallet && (
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl"
            style={{ background: '#EEF2FF', border: '1px solid #DDD6FE' }}>
            <span className="text-sm font-medium" style={{ color: '#6C5CE7' }}>Current Balance</span>
            <span className="font-black text-lg" style={{ color: '#6C5CE7', letterSpacing: '-0.02em' }}>
              {fmtNGN(wallet.wallet_balance)}
            </span>
          </div>
        )}

        <div className="card rounded-2xl p-6 flex flex-col gap-5">
          <div>
            <h2 className="font-bold text-base" style={{ color: 'var(--text)' }}>Enter Amount</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Minimum ₦100 · Secured by Paystack
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
              <AlertCircle size={15} className="shrink-0" strokeWidth={2} /> {error}
            </div>
          )}

          {/* Preset amounts */}
          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map(p => (
              <button key={p} onClick={() => setAmount(String(p))}
                className="py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={String(amount) === String(p)
                  ? { background: '#6C5CE7', color: 'white', boxShadow: '0 4px 12px rgba(108,92,231,0.3)' }
                  : { background: 'var(--bg)', color: 'var(--text)', border: '1.5px solid var(--border)' }}>
                ₦{p.toLocaleString('en-NG')}
              </button>
            ))}
          </div>

          <form onSubmit={handleDeposit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>
                Custom Amount (₦)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm"
                  style={{ color: 'var(--text-muted)' }}>₦</span>
                <input
                  type="number" min="100" step="1"
                  value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>
            </div>

            <button type="submit" disabled={loading || !amount}
              className="bg-[#6C5CE7] hover:bg-[#5A4BD1] py-3.5 rounded-xl text-white font-bold text-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              style={{ boxShadow: '0 4px 18px rgba(108,92,231,0.35)' }}>
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Redirecting to Paystack…</>
                : <><ExternalLink size={15} /> Pay {amount ? fmtNGN(amount) : ''} with Paystack</>}
            </button>
          </form>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 text-xs"
            style={{ color: 'var(--text-muted)' }}>
            <Shield size={12} strokeWidth={2} />
            Secured by Paystack · 256-bit SSL encryption
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
