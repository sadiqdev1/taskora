'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet, apiPost } from '@/lib/api';
import Link from 'next/link';
import {
  ArrowLeft, ChevronDown, AlertCircle, CheckCircle2, Loader2,
} from 'lucide-react';
import {
  FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok,
} from 'react-icons/fa6';
import { Smartphone } from 'lucide-react';

const PLATFORM_COLORS = {
  instagram: '#C13584', tiktok: '#333333', youtube: '#FF0000',
  twitter:   '#1DA1F2', facebook: '#1877F2', other: '#6C5CE7',
};
const PLATFORM_BG = {
  instagram: '#FFE8F4', tiktok: '#F0F0F0', youtube: '#FFE8E8',
  twitter:   '#E8F5FF', facebook: '#E8EFFF', other: '#F0EEFF',
};
const PLATFORM_ICONS = {
  instagram: FaInstagram, tiktok: FaTiktok, youtube: FaYoutube,
  twitter: FaXTwitter, facebook: FaFacebook, other: Smartphone,
};

function fmt(n) {
  return '₦' + Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 });
}

export default function CreateTaskPage() {
  const router = useRouter();

  const [taskTypes,      setTaskTypes]      = useState([]);
  const [typesLoading,   setTypesLoading]   = useState(true);
  const [walletBalance,  setWalletBalance]  = useState(null);
  const [taskType,       setTaskType]       = useState(null);   // full object from API
  const [taskLink,       setTaskLink]       = useState('');
  const [instructions,   setInstructions]   = useState('');
  const [participants,   setParticipants]   = useState('');
  const [dropOpen,       setDropOpen]       = useState(false);
  const [loading,        setLoading]        = useState(false);
  const [error,          setError]          = useState('');
  const [search,         setSearch]         = useState('');
  const dropRef             = useRef(null);
  const autoInstructions    = useRef(true);

  // Fetch task types and wallet balance on mount
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || '/api';
    fetch(`${base}/task-types`)
      .then(r => r.json())
      .then(d => setTaskTypes(Array.isArray(d) ? d : []))
      .catch(() => setTaskTypes([]))
      .finally(() => setTypesLoading(false));

    apiGet('/wallet')
      .then(d => setWalletBalance(parseFloat(d?.wallet_balance ?? 0)))
      .catch(() => {});
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function selectType(type) {
    setTaskType(type);
    setDropOpen(false);
    setSearch('');
    if (autoInstructions.current) setInstructions(type.instructions);
  }

  function handleInstructionsChange(e) {
    autoInstructions.current = false;
    setInstructions(e.target.value);
  }

  const filteredTypes = search.trim()
    ? taskTypes.filter(t => t.label.toLowerCase().includes(search.toLowerCase()))
    : taskTypes;

  const rewardPerTask = taskType?.reward ?? 0;
  const slots         = parseInt(participants) || 0;
  const totalBudget   = rewardPerTask * slots;
  const insufficient  = walletBalance !== null && totalBudget > 0 && walletBalance < totalBudget;
  const canSubmit     = taskType && taskLink && slots >= 1 && !insufficient && !loading;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    if (slots < 1 || slots > 10000) { setError('Participants must be between 1 and 10,000.'); return; }
    if (!taskLink.startsWith('http')) { setError('Please enter a valid URL starting with http.'); return; }

    setLoading(true);
    setError('');

    try {
      await apiPost('/campaigns', {
        task_type_value: taskType.value,
        task_link:       taskLink,
        total_slots:     slots,
        instructions:    instructions || undefined,
      });
      router.push('/tasks?created=1');
    } catch (err) {
      setError(err?.message || 'Failed to create task. Please try again.');
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="Create a Task" subtitle="Post a task for earners to complete">
      <div className="max-w-lg mx-auto flex flex-col gap-5">

        <Link href="/tasks"
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity w-fit"
          style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={14} strokeWidth={2} /> Back to Tasks
        </Link>

        <div className="card rounded-2xl p-6 flex flex-col gap-5">
          <div>
            <h1 className="font-bold text-base" style={{ color: 'var(--text)' }}>Task Details</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Pick a task type — earners will see the price and instructions automatically.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
              <AlertCircle size={15} className="shrink-0" strokeWidth={2} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* ── Task type dropdown ── */}
            <div className="flex flex-col gap-1.5" ref={dropRef}>
              <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                Task Type <span style={{ color: '#C0392B' }}>*</span>
              </label>

              <div className="relative">
                {/* Trigger button */}
                <button type="button" onClick={() => setDropOpen(o => !o)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm text-left outline-none transition-all"
                  style={{
                    background: 'var(--surface)',
                    border: dropOpen ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                    color: taskType ? 'var(--text)' : 'var(--text-muted)',
                    boxShadow: dropOpen ? '0 0 0 3px var(--primary-glow)' : undefined,
                  }}>
                  {typesLoading ? (
                    <><Loader2 size={14} className="animate-spin shrink-0" style={{ color: 'var(--text-muted)' }} />
                      <span className="flex-1 text-sm" style={{ color: 'var(--text-muted)' }}>Loading task types…</span></>
                  ) : taskType ? (
                    <>
                      {(() => { const Icon = PLATFORM_ICONS[taskType.platform] ?? Smartphone; return (
                        <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: PLATFORM_BG[taskType.platform] ?? '#F0EEFF', color: PLATFORM_COLORS[taskType.platform] ?? '#6C5CE7' }}>
                          <Icon size={13} />
                        </span>
                      ); })()}
                      <span className="flex-1 font-medium truncate">{taskType.label}</span>
                      <span className="shrink-0 text-xs font-bold" style={{ color: 'var(--primary)' }}>
                        ₦{Number(taskType.reward).toLocaleString('en-NG')}/user
                      </span>
                    </>
                  ) : (
                    <span className="flex-1">Select task type</span>
                  )}
                  <ChevronDown size={15} strokeWidth={2}
                    className={`shrink-0 transition-transform duration-150 ${dropOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-muted)' }} />
                </button>

                {/* Dropdown panel */}
                {dropOpen && !typesLoading && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-30 rounded-xl overflow-hidden flex flex-col"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', maxHeight: 320 }}>

                    {/* Search inside dropdown */}
                    <div className="p-2 border-b shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
                      <input
                        autoFocus
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search task types…"
                        className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                        style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }} />
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto py-1">
                      {filteredTypes.length === 0 ? (
                        <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>No tasks match "{search}"</p>
                      ) : filteredTypes.map(t => {
                        const Icon = PLATFORM_ICONS[t.platform] ?? Smartphone;
                        const selected = taskType?.value === t.value;
                        return (
                          <button key={t.value} type="button" onClick={() => selectType(t)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg)]"
                            style={{ color: selected ? PLATFORM_COLORS[t.platform] ?? '#6C5CE7' : 'var(--text)', fontWeight: selected ? 600 : 400 }}>
                            <span className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                              style={{ background: PLATFORM_BG[t.platform] ?? '#F0EEFF', color: PLATFORM_COLORS[t.platform] ?? '#6C5CE7' }}>
                              <Icon size={13} />
                            </span>
                            <span className="flex-1 truncate text-left">{t.label}</span>
                            <span className="shrink-0 text-xs" style={{ color: 'var(--text-muted)' }}>
                              ₦{Number(t.reward).toLocaleString('en-NG')}/user
                            </span>
                            {selected && <CheckCircle2 size={14} className="shrink-0" strokeWidth={2.5} style={{ color: PLATFORM_COLORS[t.platform] ?? '#6C5CE7' }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Task link ── */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                Task Link <span style={{ color: '#C0392B' }}>*</span>
              </label>
              <input type="url" value={taskLink} onChange={e => setTaskLink(e.target.value)}
                placeholder="https://instagram.com/yourprofile"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'; }}
                onBlur={e  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none'; }} />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                The URL earners need to visit to complete the task.
              </p>
            </div>

            {/* ── Instructions ── */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Instructions</label>
                {taskType && (
                  <button type="button"
                    onClick={() => { autoInstructions.current = true; setInstructions(taskType.instructions); }}
                    className="text-xs font-medium hover:underline"
                    style={{ color: 'var(--primary)' }}>
                    Reset to default
                  </button>
                )}
              </div>
              <textarea rows={4} value={instructions} onChange={handleInstructionsChange}
                placeholder="Step-by-step instructions for earners…"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'; }}
                onBlur={e  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none'; }} />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Auto-filled from the task type. Edit if you need custom steps.
              </p>
            </div>

            {/* ── Participants ── */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                Participants <span style={{ color: '#C0392B' }}>*</span>
              </label>
              <input type="number" min="1" max="10000" value={participants}
                onChange={e => setParticipants(e.target.value)}
                placeholder="e.g. 50"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'; }}
                onBlur={e  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none'; }} />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Max 10,000 earners per task.</p>
            </div>

            {/* ── Budget summary ── */}
            <div className="rounded-2xl p-4 flex flex-col gap-2"
              style={{ background: 'var(--bg)', border: '1.5px solid var(--border)' }}>
              <p className="text-[0.7rem] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Budget Summary
              </p>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Reward per task</span>
                <span className="font-bold" style={{ color: 'var(--text)' }}>{fmt(rewardPerTask)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Participants</span>
                <span className="font-bold" style={{ color: 'var(--text)' }}>{slots > 0 ? slots.toLocaleString() : '—'}</span>
              </div>
              <div className="h-px" style={{ background: 'var(--border-subtle)' }} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Total Budget</span>
                <span className="font-black text-lg" style={{ color: totalBudget > 0 ? 'var(--primary)' : 'var(--text-muted)', letterSpacing: '-0.02em' }}>
                  {totalBudget > 0 ? fmt(totalBudget) : '₦0.00'}
                </span>
              </div>

              {/* Wallet check */}
              {walletBalance !== null && totalBudget > 0 && (
                insufficient ? (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold mt-1"
                    style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
                    <AlertCircle size={13} className="shrink-0 mt-0.5" strokeWidth={2} />
                    <span>
                      Insufficient balance. You have {fmt(walletBalance)} but need {fmt(totalBudget)}.{' '}
                      <a href="/wallet/deposit" className="underline font-bold" style={{ color: '#C0392B' }}>Top up →</a>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold mt-1"
                    style={{ background: '#D4F6EE', color: '#00875A' }}>
                    <CheckCircle2 size={13} strokeWidth={2.5} />
                    Balance OK — {fmt(walletBalance - totalBudget)} will remain after deduction.
                  </div>
                )
              )}
            </div>

            {/* ── Submit ── */}
            <button type="submit" disabled={!canSubmit}
              className="w-full py-3 rounded-xl text-white text-sm font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2 mt-1"
              style={{ background: '#6C5CE7' }}>
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Creating Task…</>
                : `Post Task · ${totalBudget > 0 ? fmt(totalBudget) : '—'}`}
            </button>

          </form>
        </div>

        {/* Info card */}
        <div className="rounded-2xl p-4 flex flex-col gap-2"
          style={{ background: 'var(--primary-muted)', border: '1px solid #DDD6FE' }}>
          <p className="text-xs font-bold" style={{ color: 'var(--primary)' }}>How it works</p>
          <ul className="flex flex-col gap-1">
            {[
              'Budget is deducted from your wallet when you post.',
              'Each earner who completes the task earns the reward directly.',
              'Rejected submissions return the slot — another earner can fill it.',
              'Unused slots are not automatically refunded — pause the campaign if needed.',
            ].map(t => (
              <li key={t} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <span className="mt-0.5 shrink-0" style={{ color: 'var(--primary)' }}>·</span> {t}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </DashboardLayout>
  );
}
