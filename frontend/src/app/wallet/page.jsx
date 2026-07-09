'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { apiGet, apiPost } from '@/lib/api';
import { getToken } from '@/lib/auth';
import {
  Wallet, TrendingUp, DollarSign, CheckCircle2, StarIcon as Star,
  Users, CreditCard, Building2, Bitcoin, AlertCircle,
  Loader2, Search, Pencil, ShieldCheck, Plus,
} from 'lucide-react';
import banksData from '@/data/banks.json';
import confetti from 'canvas-confetti';

function fmt(n) {
  return '₦' + parseFloat(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const BANKS = [...banksData]
  .sort((a, b) => a.name.localeCompare(b.name))
  .filter((b, i, arr) => arr.findIndex(x => x.code === b.code) === i);

/* ─────────────────────────────────────────────────
   BankForm — 3-sub-step: select bank → acct no → confirm
───────────────────────────────────────────────── */
function BankForm({ initial = {}, onSave, onCancel }) {
  const [subStep,      setSubStep]      = useState(initial.bank_code ? 1 : 0);
  const [bankSearch,   setBankSearch]   = useState('');
  const [selectedBank, setSelectedBank] = useState(
    initial.bank_code ? { code: initial.bank_code, name: initial.bank_name } : null
  );
  const [acctNo,    setAcctNo]    = useState(initial.account_number || '');
  const [acctName,  setAcctName]  = useState(initial.account_name  || '');
  const [resolving, setResolving] = useState(false);
  const [resolveErr,setResolveErr]= useState('');
  const [manualMode,setManualMode]= useState(false);
  const [saving,    setSaving]    = useState(false);
  const [saveErr,   setSaveErr]   = useState('');
  const timerRef = useRef(null);

  const filtered = BANKS.filter(b =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  ).slice(0, 80);

  useEffect(() => {
    setAcctName(''); setResolveErr(''); setManualMode(false);
    if (!selectedBank?.code || acctNo.length !== 10) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setResolving(true);
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      fetch(`${base}/bank/resolve?account_number=${acctNo}&bank_code=${selectedBank.code}`, {
        headers: { Authorization: `Bearer ${getToken()}`, Accept: 'application/json' },
      })
        .then(r => r.json())
        .then(d => {
          if (d?.manual_required) {
            setManualMode(true);
            setResolveErr('This bank requires manual name entry.');
          } else if (d?.data?.account_name) {
            setAcctName(d.data.account_name);
          } else if (d?.status === false) {
            setManualMode(true);
            setResolveErr('Could not verify automatically. Enter your account name below.');
          } else {
            setResolveErr('Account not found. Check the number.');
          }
        })
        .catch(() => { setManualMode(true); setResolveErr('Lookup failed. Enter your account name manually.'); })
        .finally(() => setResolving(false));
    }, 600);
    return () => clearTimeout(timerRef.current);
  }, [acctNo, selectedBank?.code]);

  async function handleSave() {
    setSaving(true); setSaveErr('');
    try {
      await apiPost('/bank-account', {
        bank_code:      selectedBank.code,
        bank_name:      selectedBank.name,
        account_number: acctNo,
        account_name:   acctName,
      });
      onSave({ bank_code: selectedBank.code, bank_name: selectedBank.name, account_number: acctNo, account_name: acctName });
            // Confetti burst
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#6C5CE7', '#A29BFE', '#00B894', '#FDCB6E', '#ffffff'],
            });
    } catch (e) {
      setSaveErr(e.message || 'Failed to save. Try again.');
    } finally { setSaving(false); }
  }

  const SUB_LABELS = ['Select Bank', 'Account Number', 'Confirm'];

  return (
    <div className="flex flex-col gap-5">
      {/* Sub-step pills */}
      <div className="flex items-center gap-2">
        {SUB_LABELS.map((lbl, i) => (
          <div key={lbl} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-black border transition-all"
                style={i < subStep
                  ? { background: '#6C5CE7', borderColor: '#6C5CE7', color: 'white' }
                  : i === subStep
                  ? { background: '#EEF2FF', borderColor: '#6C5CE7', color: '#6C5CE7' }
                  : { background: 'white', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                {i < subStep ? '✓' : i + 1}
              </div>
              <span className="text-xs font-semibold hidden sm:block"
                style={{ color: i <= subStep ? '#6C5CE7' : 'var(--text-muted)' }}>{lbl}</span>
            </div>
            {i < SUB_LABELS.length - 1 && (
              <div className="flex-1 h-px" style={{ background: i < subStep ? '#6C5CE7' : 'var(--border)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Sub-step 0: select bank */}
      {subStep === 0 && (
        <>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
            <input value={bankSearch} onChange={e => setBankSearch(e.target.value)}
              placeholder="Search bank name…" autoFocus
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
              onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
          <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto rounded-xl border"
            style={{ borderColor: 'var(--border-subtle)' }}>
            {filtered.length === 0
              ? <p className="text-xs text-center py-6" style={{ color: 'var(--text-muted)' }}>No banks found</p>
              : filtered.map(b => (
                <button key={b.code} onClick={() => { setSelectedBank(b); setBankSearch(''); setSubStep(1); }}
                  className="flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[var(--primary-muted)]"
                  style={{ color: 'var(--text)' }}>
                  <span className="w-7 h-7 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[0.65rem] font-black shrink-0"
                    style={{ color: '#6C5CE7' }}>{b.name[0]}</span>
                  {b.name}
                </button>
              ))}
          </div>
          <div className="flex justify-end">
            <button onClick={onCancel} className="text-sm font-semibold hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}>Cancel</button>
          </div>
        </>
      )}

          {/* Account number step */}
          {subStep === 1 && (
            <>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                style={{ background: 'var(--bg)', border: '1px solid var(--border-subtle)' }}>
                <span className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-xs font-black shrink-0"
                  style={{ color: '#6C5CE7' }}>{selectedBank?.name[0]}</span>
                <span className="text-sm font-semibold flex-1" style={{ color: 'var(--text)' }}>{selectedBank?.name}</span>
                <button onClick={() => setSubStep(0)} className="text-xs font-semibold" style={{ color: '#6C5CE7' }}>Change</button>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Account Number</label>
                <input value={acctNo} onChange={e => setAcctNo(e.target.value.replace(/\D/g,'').slice(0,10))}
                  placeholder="10-digit account number" inputMode="numeric" autoFocus
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono tracking-widest"
                  style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{acctNo.length}/10</p>
                {resolving && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: '#6C5CE7' }}>
                    <Loader2 size={12} className="animate-spin" /> Verifying account…
                  </div>
                )}
                {acctName && !resolving && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold"
                    style={{ background: '#D4F6EE', color: '#00875A' }}>
                    <CheckCircle2 size={13} strokeWidth={2.5} /> {acctName}
                  </div>
                )}
                {resolveErr && !resolving && (
                  <p className="text-xs flex items-center gap-1" style={{ color: '#B45309' }}>
                    <AlertCircle size={11} /> {resolveErr}
                  </p>
                )}
                {/* Manual name input for banks that don't support lookup */}
                {manualMode && !resolving && (
                  <div className="flex flex-col gap-1.5 mt-1">
                    <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Account Name <span style={{ color: '#C0392B' }}>*</span></label>
                    <input value={acctName} onChange={e => setAcctName(e.target.value)}
                      placeholder="Enter your full account name"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                      onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
                      onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSubStep(0)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-[var(--bg)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>← Back</button>
                <button onClick={() => setSubStep(2)}
                  disabled={acctNo.length !== 10 || (manualMode && !acctName.trim())}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] disabled:opacity-40 transition-colors">
                  Continue →
                </button>
              </div>
            </>
          )}

      {/* Sub-step 2: review + save */}
      {subStep === 2 && (
        <>
          <div className="p-4 rounded-2xl flex flex-col gap-3"
            style={{ background: 'var(--bg)', border: '1px solid var(--border-subtle)' }}>
            <p className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Review Details</p>
            {[['Bank', selectedBank?.name], ['Account No', acctNo], ['Account Name', acctName || '(not resolved)']].map(([l, v]) => (
              <div key={l} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{l}</span>
                <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{v}</span>
              </div>
            ))}
          </div>
          {saveErr && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
              style={{ background: '#FFF0F0', color: '#C0392B' }}>
              <AlertCircle size={12} /> {saveErr}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => setSubStep(1)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-[var(--bg)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>← Edit</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              {saving && <span className="btn-spinner" />}
              {saving ? 'Saving…' : 'Save Bank Account'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   WalletPage
───────────────────────────────────────────────── */
export default function WalletPage() {
  const [wallet,       setWallet]       = useState(null);
  const [txns,         setTxns]         = useState([]);
  const [showForm,     setShowForm]     = useState(false);
  const [amount,       setAmount]       = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [success,      setSuccess]      = useState('');
  const [error,        setError]        = useState('');
  const [bankAccount,  setBankAccount]  = useState(null);
  const [showBankForm, setShowBankForm] = useState(false);

  const loadWallet = useCallback(() => {
    apiGet('/wallet').then(d => {
      setWallet(d);
      if (d?.bank_account?.account_number) setBankAccount(d.bank_account);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    loadWallet();
    apiGet('/transactions').then(d => setTxns(d?.data?.slice(0, 6) || [])).catch(() => {});
  }, [loadWallet]);

  const w = wallet || {
    wallet_balance: 0, total_earnings: 0, this_month_earnings: 0,
    tasks_completed: 0, success_rate: 0, referrals_count: 0,
  };

  async function handleWithdraw(e) {
    e.preventDefault();
    if (!bankAccount?.account_number) { setError('Please add a bank account first.'); return; }
    if (!amount || parseFloat(amount) < 500) { setError('Minimum withdrawal is ₦500.'); return; }
    if (parseFloat(amount) > parseFloat(w.wallet_balance)) { setError('Insufficient balance.'); return; }
    setSubmitting(true); setError(''); setSuccess('');

    // Optimistic update — show new balance immediately
    const withdrawn = parseFloat(amount);
    setWallet(prev => prev ? { ...prev, wallet_balance: (parseFloat(prev.wallet_balance) - withdrawn).toFixed(2) } : prev);

    try {
      await apiPost('/withdraw', {
        amount:         withdrawn,
        bank_code:      bankAccount.bank_code,
        bank_name:      bankAccount.bank_name,
        account_number: bankAccount.account_number,
        account_name:   bankAccount.account_name,
      });
      setSuccess('Withdrawal request submitted!');
            // Confetti burst
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#6C5CE7', '#A29BFE', '#00B894', '#FDCB6E', '#ffffff'],
            });
      setShowForm(false);
      setAmount('');
      // Reconcile with server truth
      loadWallet();
    } catch (err) {
      // Roll back optimistic update on failure
      setWallet(prev => prev ? { ...prev, wallet_balance: (parseFloat(prev.wallet_balance) + withdrawn).toFixed(2) } : prev);
      setError(err.message || 'Failed to submit. Please try again.');
    } finally { setSubmitting(false); }
  }

  function handleBankSaved(data) {
    setBankAccount(data);
    setShowBankForm(false);
  }

  return (
    <DashboardLayout title="Wallet" subtitle="Manage your earnings and withdrawals">
      <div className="flex flex-col gap-5">

        {/* ── Success tracker ── */}
        {success && (
          <div className="card rounded-2xl p-6">
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>Withdrawal Submitted 🎉</h3>
            <div className="flex items-center">
              {['Submitted', 'Under Review', 'Processing', 'Sent'].map((lbl, i) => (
                <div key={lbl} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2"
                      style={i === 0
                        ? { background: '#6C5CE7', borderColor: '#6C5CE7', color: 'white' }
                        : { background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                      {i === 0 ? '✓' : i + 1}
                    </div>
                    <span className="text-[0.6rem] font-semibold whitespace-nowrap"
                      style={{ color: i === 0 ? '#6C5CE7' : 'var(--text-muted)' }}>{lbl}</span>
                  </div>
                  {i < 3 && <div className="flex-1 h-0.5 mx-1 mb-5" style={{ background: i === 0 ? '#6C5CE7' : 'var(--border)' }} />}
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
              Processing within 24 hours to {bankAccount?.bank_name} ({bankAccount?.account_number})
            </p>
          </div>
        )}

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #7C3AED 100%)', boxShadow: '0 8px 24px rgba(108,92,231,0.30)' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
            <div className="flex items-center gap-2 mb-2 relative">
              <Wallet size={13} className="text-white/65 shrink-0" />
              <p className="text-xs font-semibold text-white/70">Available Balance</p>
            </div>
            <p className="font-black text-white mb-5 relative" style={{ fontSize: '2.2rem', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {fmt(w.wallet_balance)}
            </p>
            <button onClick={() => { setShowForm(f => !f); setError(''); setSuccess(''); }}
              className="relative w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
              {showForm ? '✕ Cancel' : '↑ Withdraw Funds'}
            </button>
          </div>

          <div className="card rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Total Earned</p>
              <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
                <DollarSign size={16} strokeWidth={2} />
              </span>
            </div>
            <p className="font-black" style={{ fontSize: '2rem', letterSpacing: '-0.025em', color: '#6C5CE7' }}>{fmt(w.total_earnings)}</p>
          </div>

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
          <div className="card rounded-2xl p-6">
            <h2 className="font-bold text-base mb-1" style={{ color: 'var(--text)' }}>Withdraw Funds</h2>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Funds sent directly to your saved bank account.</p>
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-4"
                style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
                <AlertCircle size={15} className="shrink-0" strokeWidth={2} /> {error}
              </div>
            )}
            {bankAccount?.account_number ? (
              <div className="flex items-center gap-3 p-4 rounded-xl mb-5"
                style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC' }}>
                <Building2 size={20} strokeWidth={1.8} style={{ color: '#00875A' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{bankAccount.bank_name}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {bankAccount.account_number} · {bankAccount.account_name}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold shrink-0" style={{ color: '#00875A' }}>
                  <ShieldCheck size={13} strokeWidth={2.5} /> Verified
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 rounded-xl mb-5"
                style={{ background: '#FFF3D6', border: '1.5px solid #FDCB6E' }}>
                <AlertCircle size={16} strokeWidth={2} style={{ color: '#B45309' }} />
                <p className="text-sm flex-1" style={{ color: '#B45309' }}>
                  No bank account saved.{' '}
                  <button onClick={() => { setShowForm(false); setShowBankForm(true); }}
                    className="font-bold underline underline-offset-2">Add one below</button>.
                </p>
              </div>
            )}
            <form onSubmit={handleWithdraw} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>
                  Amount <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(min ₦500)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: 'var(--text-muted)' }}>₦</span>
                  <input type="number" min="500" step="1" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                    onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Available: {fmt(w.wallet_balance)}</p>
              </div>
              <button type="submit" disabled={submitting || !bankAccount?.account_number}
                className="bg-[#6C5CE7] hover:bg-[#5A4BD1] py-3 rounded-xl text-white font-bold text-sm disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
                {submitting && <span className="btn-spinner" />}
                {submitting ? 'Submitting…' : 'Submit Withdrawal Request'}
              </button>
            </form>
          </div>
        )}

        {/* ── Stats row ── */}
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

        {/* ── Bank Account Management ── */}
        <div className="card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Bank Account</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Your withdrawal destination</p>
            </div>
            <button onClick={() => setShowBankForm(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
              style={bankAccount
                ? { background: '#EEF2FF', color: '#6C5CE7' }
                : { background: '#6C5CE7', color: 'white' }}>
              {bankAccount ? <><Pencil size={11} strokeWidth={2.5} /> Change</> : <><Plus size={11} strokeWidth={2.5} /> Add Bank</>}
            </button>
          </div>

          {bankAccount?.account_number ? (
            <div className="px-5 py-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FF' }}>
                <Building2 size={22} strokeWidth={1.7} style={{ color: '#6C5CE7' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{bankAccount.bank_name}</p>
                <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{bankAccount.account_number}</p>
                {bankAccount.account_name && (
                  <p className="text-xs mt-0.5 font-semibold" style={{ color: 'var(--text-secondary)' }}>{bankAccount.account_name}</p>
                )}
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg shrink-0" style={{ background: '#D4F6EE' }}>
                <ShieldCheck size={12} strokeWidth={2.5} style={{ color: '#00875A' }} />
                <span className="text-xs font-bold" style={{ color: '#00875A' }}>Saved</span>
              </div>
            </div>
          ) : (
            <div className="px-5 py-8 flex flex-col items-center gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg)' }}>
                <Building2 size={22} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
              </div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>No bank account added</p>
              <p className="text-xs max-w-xs" style={{ color: 'var(--text-muted)' }}>
                Add your Nigerian bank account to start withdrawing your earnings
              </p>
              <button onClick={() => setShowBankForm(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] transition-colors mt-1">
                <Plus size={14} strokeWidth={2.5} /> Add Bank Account
              </button>
            </div>
          )}
        </div>

        {/* Bank modal */}
        {showBankForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,12,40,0.6)', backdropFilter: 'blur(6px)' }}>
            <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              style={{ maxHeight: '90dvh' }}>
              <div className="flex items-center justify-between px-5 py-4 border-b shrink-0"
                style={{ borderColor: 'var(--border-subtle)' }}>
                <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                  {bankAccount ? 'Change Bank Account' : 'Add Bank Account'}
                </h2>
                <button onClick={() => setShowBankForm(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg)] transition-colors"
                  style={{ color: 'var(--text-muted)' }}>✕</button>
              </div>
              <div className="p-5 overflow-y-auto">
                <BankForm initial={bankAccount || {}} onSave={handleBankSaved} onCancel={() => setShowBankForm(false)} />
              </div>
            </div>
          </div>
        )}

        {/* ── Recent Transactions ── */}
        {txns.length > 0 && (
          <div className="card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Recent Transactions</h2>
              <Link href="/transactions" className="text-xs font-semibold hover:opacity-80 transition-opacity" style={{ color: '#6C5CE7' }}>
                View all
              </Link>
            </div>
            <ul>
              {txns.map((t, i) => (
                <li key={t.id || i} className="flex items-center gap-3 px-5 py-3 table-row-hover transition-colors"
                  style={{ borderBottom: i < txns.length - 1 ? '1px solid var(--border-subtle)' : undefined }}>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base"
                    style={{ background: t.type === 'withdrawal' ? '#FFF0F0' : '#D4F6EE' }}>
                    {t.type === 'withdrawal' ? '↑' : '↓'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{t.description || t.type}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {t.created_at ? new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </p>
                  </div>
                  <p className="text-sm font-bold shrink-0" style={{ color: t.type === 'withdrawal' ? '#C0392B' : '#00875A' }}>
                    {t.type === 'withdrawal' ? '-' : '+'}{fmt(t.amount)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
