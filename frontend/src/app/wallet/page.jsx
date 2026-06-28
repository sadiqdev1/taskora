'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet, apiPost } from '@/lib/api';
import { getToken } from '@/lib/auth';
import {
  Wallet, TrendingUp, DollarSign, CheckCircle2, Star,
  Users, CreditCard, Building2, Bitcoin, ChevronDown, AlertCircle, Loader2,
} from 'lucide-react';
import banksData from '@/data/banks.json';

function fmt(n) {
  return '$' + parseFloat(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const BANKS = [...banksData]
  .sort((a, b) => a.name.localeCompare(b.name))
  // dedupe by bank code — keep first occurrence after sort
  .filter((b, i, arr) => arr.findIndex(x => x.code === b.code) === i);

const LOOKUP_URL = 'https://api.paystack.co/bank/resolve';

export default function WalletPage() {
  const [wallet,        setWallet]        = useState(null);
  const [showForm,      setShowForm]      = useState(false);
  const [amount,        setAmount]        = useState('');
  const [bank,          setBank]          = useState('');
  const [accountNo,     setAccountNo]     = useState('');
  const [accountName,   setAccountName]   = useState('');
  const [lookingUp,     setLookingUp]     = useState(false);
  const [lookupError,   setLookupError]   = useState('');
  const [submitting,    setSubmitting]    = useState(false);
  const [success,       setSuccess]       = useState('');
  const [error,         setError]         = useState('');
  const lookupTimer = useRef(null);

  useEffect(() => {
    apiGet('/wallet', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(setWallet).catch(() => {});
  }, []);

  /* ── Auto-lookup account name when bank + 10-digit account number are set ── */
  useEffect(() => {
    // Clear previous result whenever inputs change
    setAccountName('');
    setLookupError('');

    if (!bank || accountNo.length !== 10) return;

    clearTimeout(lookupTimer.current);
    lookupTimer.current = setTimeout(async () => {
      setLookingUp(true);
      try {
        // Route through backend to keep Paystack secret key server-side
        const res = await fetch(
          `/api/bank/resolve?account_number=${encodeURIComponent(accountNo)}&bank_code=${encodeURIComponent(bank)}`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        const json = await res.json();
        const name = json?.data?.account_name || json?.account_name || null;
        if (name) {
          setAccountName(name);
        } else {
          setLookupError('Account not found. Please check your details.');
        }
      } catch {
        setLookupError('Could not verify account. You can still proceed manually.');
      } finally {
        setLookingUp(false);
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(lookupTimer.current);
  }, [bank, accountNo]);

  const w = wallet || { wallet_balance: 0, total_earnings: 0, this_month_earnings: 0, tasks_completed: 0, success_rate: 0, referrals_count: 0 };

  async function handleWithdraw(e) {
    e.preventDefault();
    if (!amount || parseFloat(amount) < 10) { setError('Minimum withdrawal is $10.'); return; }
    if (!bank)      { setError('Please select a bank.'); return; }
    if (!accountNo) { setError('Please enter your account number.'); return; }
    setSubmitting(true); setError(''); setSuccess('');
    try {
      const selectedBank = BANKS.find(b => b.code === bank);
      await apiPost('/withdraw', {
        amount: parseFloat(amount),
        payment_method: 'bank_transfer',
        payment_details: {
          bank_code:    bank,
          bank_name:    selectedBank?.name || '',
          account_no:   accountNo,
          account_name: accountName,
        },
      }, { headers: { Authorization: `Bearer ${getToken()}` } });
      setSuccess('Withdrawal request submitted! Processing within 24 hours.');
      setShowForm(false); setAmount(''); setBank(''); setAccountNo(''); setAccountName('');
      apiGet('/wallet', { headers: { Authorization: `Bearer ${getToken()}` } }).then(setWallet).catch(() => {});
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally { setSubmitting(false); }
  }

  return (
    <DashboardLayout title="Wallet" subtitle="Manage your earnings and withdrawals">

      {success && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium mb-5"
          style={{ background: '#D4F6EE', color: '#00875A', border: '1px solid #A8E8D8' }}>
          <CheckCircle2 size={18} strokeWidth={2} className="shrink-0" />
          {success}
        </div>
      )}

      {/* ── Top stat cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

        {/* Balance card — keeps gradient, it's the hero card */}
        <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #7C3AED 100%)', boxShadow: '0 8px 24px rgba(108,92,231,0.30)' }}>
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <div className="flex items-center gap-2 mb-2 relative">
            <Wallet size={13} className="text-white/65 shrink-0" />
            <p className="text-xs font-semibold text-white/70">Available Balance</p>
          </div>
          <p className="font-black text-white mb-5 relative" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {fmt(w.wallet_balance)}
          </p>
          <button
            onClick={() => { setShowForm(f => !f); setError(''); setSuccess(''); }}
            className="relative w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
            {showForm ? '✕ Cancel' : '↑ Withdraw Funds'}
          </button>
        </div>

        {/* Total Earned */}
        <div className="card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Earned</p>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
              <DollarSign size={16} strokeWidth={2} />
            </span>
          </div>
          <p className="font-black" style={{ fontSize: '2rem', letterSpacing: '-0.025em', color: '#6C5CE7' }}>{fmt(w.total_earnings)}</p>
        </div>

        {/* This Month */}
        <div className="card rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>This Month</p>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#D4F6EE', color: '#00875A' }}>
              <TrendingUp size={16} strokeWidth={2} />
            </span>
          </div>
          <p className="font-black" style={{ fontSize: '2rem', letterSpacing: '-0.025em', color: '#00875A' }}>{fmt(w.this_month_earnings)}</p>
        </div>
      </div>

      {/* ── Withdrawal form ── */}
      {showForm && (
        <div className="card rounded-2xl p-6 mb-5">
          <h2 className="font-bold text-base mb-1" style={{ color: 'var(--text)' }}>Withdraw Funds</h2>
          <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>Bank transfer is the only available method right now.</p>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4" style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
              <AlertCircle size={15} className="shrink-0" strokeWidth={2} /> {error}
            </div>
          )}

          {/* Method selector — bank active, others coming soon */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { id: 'bank',   label: 'Bank Transfer', Icon: Building2,  available: true  },
              { id: 'paypal', label: 'PayPal',         Icon: CreditCard, available: false },
              { id: 'crypto', label: 'Crypto',         Icon: Bitcoin,    available: false },
            ].map(m => (
              <div key={m.id}
                className="relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all"
                style={m.available
                  ? { borderColor: '#6C5CE7', background: '#EEF2FF', color: '#6C5CE7', cursor: 'default' }
                  : { borderColor: 'var(--border)', color: 'var(--text-muted)', opacity: 0.6, cursor: 'not-allowed' }}>
                <m.Icon size={22} strokeWidth={1.7} />
                <span className="text-xs font-semibold">{m.label}</span>
                {!m.available && (
                  <span className="absolute -top-2 -right-2 text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full bg-[#FFF3D6] text-[#B45309] border border-[#FDCB6E]">
                    Soon
                  </span>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleWithdraw} className="flex flex-col gap-4">

            {/* Bank */}
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Bank</label>
              <div className="relative">
                <select value={bank} onChange={e => setBank(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none"
                  style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
                  <option value="">Select your bank</option>
                  {BANKS.map(b => <option key={b.id} value={b.code}>{b.name}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Account number */}
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Account Number</label>
              <input
                type="text"
                value={accountNo}
                onChange={e => setAccountNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit account number"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono tracking-wider"
                style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {accountNo.length}/10 digits
              </p>
            </div>

            {/* Account name — auto-filled from lookup */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Account Name</label>
                {lookingUp && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <Loader2 size={11} strokeWidth={2} className="animate-spin" /> Verifying…
                  </span>
                )}
                {!lookingUp && accountName && (
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#00875A' }}>
                    <CheckCircle2 size={11} strokeWidth={2.5} /> Verified
                  </span>
                )}
              </div>
              <input
                type="text"
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                placeholder={lookingUp ? 'Looking up account…' : bank && accountNo.length === 10 ? 'Account not found' : 'Auto-filled after entering account number'}
                readOnly={!!accountName && !lookupError}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: accountName ? '#F0FDF4' : 'var(--bg)',
                  border: `1.5px solid ${accountName ? '#86EFAC' : lookupError ? '#FCA5A5' : 'var(--border)'}`,
                  color: 'var(--text)',
                  cursor: accountName && !lookupError ? 'default' : undefined,
                }}
                onFocus={e => { if (!accountName) e.target.style.borderColor = '#6C5CE7'; }}
                onBlur={e => { if (!accountName) e.target.style.borderColor = 'var(--border)'; }}
              />
              {lookupError && (
                <p className="text-xs mt-1 flex items-center gap-1" style={{ color: '#B45309' }}>
                  <AlertCircle size={11} strokeWidth={2.2} /> {lookupError}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Amount (min $10)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: 'var(--text-muted)' }}>$</span>
                <input type="number" min="10" step="0.01" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Available: {fmt(w.wallet_balance)}</p>
            </div>

            <button type="submit" disabled={submitting}
              className="bg-[#6C5CE7] hover:bg-[#5A4BD1] py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60 transition-colors mt-1 flex items-center justify-center gap-2">
              {submitting && <span className="btn-spinner" />}
              {submitting ? 'Submitting…' : 'Submit Withdrawal Request'}
            </button>
          </form>
        </div>
      )}

      {/* ── Stats row — 3 cards, no Referral Code ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Tasks Completed', value: w.tasks_completed,    Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A' },
          { label: 'Success Rate',    value: `${w.success_rate}%`, Icon: Star,         bg: '#FFF3D6', color: '#B45309' },
          { label: 'Total Referrals', value: w.referrals_count,    Icon: Users,        bg: '#EEF2FF', color: '#6C5CE7' },
        ].map(s => (
          <div key={s.label} className="card rounded-2xl p-5 flex items-center gap-4">
            <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg, color: s.color }}>
              <s.Icon size={20} strokeWidth={1.9} />
            </span>
            <div>
              <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              <p className="font-black text-2xl leading-none" style={{ color: 'var(--text)', letterSpacing: '-0.025em' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

    </DashboardLayout>
  );
}
