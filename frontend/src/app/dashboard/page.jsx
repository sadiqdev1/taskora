'use client';

import { useEffect, useState, useCallback } from 'react';import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import {
  Wallet, DollarSign, CheckCircle2, Smartphone,
  TrendingUp, Award, CircleDollarSign, ArrowUpRight,
  ChevronDown, Bell, Zap, Megaphone,
} from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';

const fmt = n => '₦' + parseFloat(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PLATFORM = {
  instagram: { Icon: FaInstagram, bg: '#FFE8F4', color: '#C13584' },
  tiktok:    { Icon: FaTiktok,    bg: '#F0F0F0', color: '#333'    },
  youtube:   { Icon: FaYoutube,   bg: '#FFE8E8', color: '#FF0000' },
  twitter:   { Icon: FaXTwitter,  bg: '#E8F5FF', color: '#1DA1F2' },
  facebook:  { Icon: FaFacebook,  bg: '#E8EFFF', color: '#1877F2' },
  other:     { Icon: Smartphone,  bg: '#F0EEFF', color: '#6C5CE7' },
};

const NOTIF_META = {
  earning:        { Icon: CheckCircle2,     bg: '#D4F6EE', color: '#00875A' },
  withdrawal:     { Icon: ArrowUpRight,     bg: '#E8F0FF', color: '#1877F2' },
  campaign:       { Icon: Megaphone,        bg: '#EEF2FF', color: '#6C5CE7' },
  referral_bonus: { Icon: Award,            bg: '#FFF3D6', color: '#B45309' },
  default:        { Icon: CircleDollarSign, bg: '#F0F0FF', color: '#6C5CE7' },
};

function MiniChart({ data = [], color = '#6C5CE7' }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const range = max - min || 1;
  const W = 320, H = 80, P = 6;
  const pts = data.map((v, i) => {
    const x = P + (i / (data.length - 1)) * (W - P * 2);
    const y = H - P - ((v - min) / range) * (H - P * 2);
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0"    />
        </linearGradient>
      </defs>
      <path d={`M${pts.join('L')}L${W-P},${H-P}L${P},${H-P}Z`} fill="url(#cg)" />
      <path d={`M${pts.join('L')}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Onboarding Checklist Modal — compulsory until all steps done ── */
function OnboardingModal({ tasksDone, walletData }) {
  const step1Done = true;
  // Step 2 ticks as soon as user has submitted ANY task (pending counts too)
  const step2Done = (walletData?.tasks_submitted ?? tasksDone) > 0;
  const step3Done = !!(walletData?.bank_set_up || walletData?.bank_account?.account_number);

  const allDone   = step2Done && step3Done;
  const doneCount = [step1Done, step2Done, step3Done].filter(Boolean).length;

  useEffect(() => {
    if (allDone) {
      document.documentElement.classList.remove('modal-open');
      return;
    }
    document.documentElement.classList.add('modal-open');
    return () => { document.documentElement.classList.remove('modal-open'); };
  }, [allDone]);

  if (allDone) return null;

  const STEPS = [
    { done: step1Done, label: 'Create your account',      sub: "You're in!",                       href: null      },
    { done: step2Done, label: 'Complete your first task',  sub: 'Browse available tasks and earn',  href: '/tasks'  },
    { done: step3Done, label: 'Set up withdrawal method',  sub: 'Add your bank account in Wallet',  href: '/wallet' },
  ];

  return (
    /* Backdrop — no click-outside dismiss */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,12,40,0.55)', backdropFilter: 'blur(4px)' }}>

      {/* Centered card on all screens */}
      <div className="bg-white w-full sm:max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxHeight: '90dvh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b shrink-0" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h2 className="font-black text-lg tracking-tight" style={{ color: 'var(--text)' }}>Get started 🚀</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Complete these steps to unlock your account</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
            {doneCount}/3
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full shrink-0" style={{ background: 'var(--border-subtle)' }}>
          <div className="h-full bg-[#6C5CE7] transition-all duration-500" style={{ width: `${Math.round((doneCount / 3) * 100)}%` }} />
        </div>

        {/* Steps */}
        <div className="px-4 py-3 flex flex-col gap-1 overflow-y-auto">
          {STEPS.map((s, i) => {
            const inner = (
              <>
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 text-[0.6rem] font-black transition-all"
                  style={s.done
                    ? { background: '#00875A', borderColor: '#00875A', color: 'white' }
                    : { background: 'white', borderColor: '#6C5CE7', color: '#6C5CE7' }}>
                  {s.done ? '✓' : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight"
                    style={{ color: s.done ? '#00875A' : 'var(--text)', textDecoration: s.done ? 'line-through' : 'none' }}>
                    {s.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.sub}</p>
                </div>
                {!s.done && s.href && (
                  <span className="text-xs font-bold shrink-0 px-2.5 py-1 rounded-lg"
                    style={{ background: '#EEF2FF', color: '#6C5CE7' }}>Go →</span>
                )}
                {s.done && (
                  <CheckCircle2 size={16} strokeWidth={2} style={{ color: '#00875A', shrink: 0 }} />
                )}
              </>
            );
            return s.href && !s.done ? (
              <Link key={i} href={s.href}
                className="flex items-center gap-3 px-3 py-3.5 rounded-xl no-underline transition-colors hover:bg-[var(--primary-muted)]"
                style={{ background: 'var(--bg)' }}>
                {inner}
              </Link>
            ) : (
              <div key={i} className="flex items-center gap-3 px-3 py-3.5 rounded-xl"
                style={{ background: s.done ? '#F0FDF4' : 'var(--bg)' }}>
                {inner}
              </div>
            );
          })}
        </div>

        {/* Footer — no dismiss, just CTA to next undone step */}
        <div className="px-6 py-4 border-t shrink-0 flex items-center justify-between gap-3"
          style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Complete both steps to continue
          </p>
          <Link href={STEPS.find(s => !s.done && s.href)?.href || '/tasks'}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] transition-colors no-underline">
            Continue →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [walletData,    setWalletData]    = useState(null);
  const [campaigns,     setCampaigns]     = useState([]);
  const [myCampaigns,   setMyCampaigns]   = useState([]);
  const [notifs,        setNotifs]        = useState([]);
  const [dataLoaded,    setDataLoaded]    = useState(false);

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const load = useCallback(async () => {
    try {
      const [w, c, mc, n] = await Promise.all([
        apiGet('/wallet'),
        apiGet('/campaigns?per_page=8'),
        apiGet('/campaigns?mine=1&per_page=10'),
        apiGet('/transactions?per_page=5'),
      ]);
      setWalletData(w);
      setCampaigns(c?.data || []);
      setMyCampaigns(mc?.data || []);
      setNotifs((n?.data?.slice(0, 5) || []).map(t => ({
        type: t.type,
        text: t.type === 'earning'        ? 'Task approved'
            : t.type === 'withdrawal'     ? 'Withdrawal sent'
            : t.type === 'referral_bonus' ? 'Referral bonus'
            : 'Update',
        sub:  t.description || '',
        time: t.created_at ? new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
      })));
      
    } catch { /* api down — show zeros */ }
    finally { setDataLoaded(true); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const walletBal     = parseFloat(walletData?.wallet_balance     ?? 0);
  const totalEarnings = parseFloat(walletData?.total_earnings     ?? 0);
  const tasksDone     = walletData?.tasks_completed               ?? 0;
  const thisMonth     = parseFloat(walletData?.this_month_earnings ?? 0);
  const lastMonth     = parseFloat(walletData?.last_month_earnings ?? 0);
  const pendingBal    = parseFloat(walletData?.pending_balance     ?? 0);
  const chartData     = walletData?.monthly_chart || Array(12).fill(0);

  return (
    <DashboardLayout title="Dashboard" subtitle="Welcome back — here's your earnings overview">
      <div className="flex flex-col gap-5">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Here&apos;s what&apos;s happening with your earnings today.
            </p>
          </div>
          <Link href="\/tasks"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] transition-colors">
            <Zap size={14} strokeWidth={2.5} /> Browse Tasks
          </Link>        </div>

        {/* ── Onboarding checklist — only show after data loaded to prevent flash ── */}
        {dataLoaded && <OnboardingModal tasksDone={tasksDone} walletData={walletData} />}

        {/* ── ROW 1: 4 stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Wallet balance — hero card */}
          <div className="col-span-2 lg:col-span-2 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #7C3AED 100%)', boxShadow: '0 8px 24px rgba(108,92,231,0.28)', minHeight: 140 }}>
            <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Wallet size={12} className="text-white/60 shrink-0" />
                <span className="text-xs font-semibold text-white/60">Wallet Balance</span>
              </div>
              <p className="text-white font-black leading-none" style={{ fontSize: '1.9rem', letterSpacing: '-0.03em' }}>
                {fmt(walletBal)}
              </p>
              <p className="text-xs text-white/50 mt-1">Available to withdraw</p>
              <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Pending: <span className="text-white/80 font-bold">{fmt(pendingBal)}</span>
              </p>
            </div>
            {/* Always show withdraw + deposit — disable withdraw if balance is 0 */}
            <div className="flex items-center gap-2 mt-4">
              <Link href="/wallet"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.25)', opacity: walletBal > 0 ? 1 : 0.45, pointerEvents: walletBal > 0 ? 'auto' : 'none' }}>
                Withdraw 
              </Link>
              <Link href="/wallet/deposit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.20)' }}>
                Deposit
              </Link>
            </div>
          </div>

          {/* Total Earnings */}
          <div className="card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Total Earnings</p>
              <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
                <DollarSign size={15} strokeWidth={2} />
              </span>
            </div>
            <div>
              <p className="font-black leading-none mt-2" style={{ fontSize: '1.6rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>
                {fmt(totalEarnings)}
              </p>
              <p className="text-xs font-semibold flex items-center gap-1 mt-2" style={{ color: 'var(--text-muted)' }}>
                <TrendingUp size={11} strokeWidth={2.5} />
                {lastMonth > 0
                  ? `${((thisMonth - lastMonth) / lastMonth * 100).toFixed(1)}% vs last month`
                  : fmt(thisMonth) + ' this month'}
              </p>
            </div>
          </div>

          {/* Tasks completed */}
          <div className="card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Tasks Completed</p>
              <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#D4F6EE', color: '#00875A' }}>
                <CheckCircle2 size={15} strokeWidth={2} />
              </span>
            </div>
            <div>
              <p className="font-black leading-none mt-2" style={{ fontSize: '1.6rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>
                {tasksDone}
              </p>
              <p className="text-xs font-semibold flex items-center gap-1 mt-2" style={{ color: 'var(--text-muted)' }}>
                <TrendingUp size={11} strokeWidth={2.5} />
                {tasksDone > 0 ? `${tasksDone} approved` : 'Complete tasks to earn'}
              </p>
            </div>
          </div>

        </div>

        {/* ── ROW 2: Active Campaigns table — full width ── */}
        <div className="bg-white rounded-2xl border border-[var(--border-subtle)] overflow-hidden"
          style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Available Tasks</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Pick a task and start earning</p>
            </div>
            <Link href="\/tasks" className="text-xs font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: '#6C5CE7' }}>
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {/* Desktop table / Mobile cards */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]" style={{ background: 'var(--bg)' }}>
                  {['Campaign', 'Platform', 'Progress', 'Reward', 'Status'].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-xs font-semibold"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                    No active campaigns yet. <Link href="\/tasks" style={{ color: '#6C5CE7' }} className="font-semibold">Browse tasks →</Link>
                  </td></tr>
                ) : campaigns.map((c, i) => {
                  const pm     = PLATFORM[c.platform] || PLATFORM.other;
                  const filled = c.filled_slots || 0;
                  const total  = c.total_slots  || 100;
                  const prog   = c.progress_percentage ?? Math.round((filled / total) * 100);
                  const earned = (filled * parseFloat(c.reward_per_task || 0)).toFixed(2);
                  return (
                    <tr key={c.id}
                      className="table-row-hover transition-colors"
                      style={{ borderBottom: i < campaigns.length - 1 ? '1px solid var(--border-subtle)' : undefined }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: pm.bg, color: pm.color }}>
                            <pm.Icon size={14} />
                          </span>
                          <div>
                            <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text)' }}>{c.title}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{c.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 capitalize text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{c.platform}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="progress-track w-20 shrink-0">
                            <div className="progress-fill" style={{ width: `${prog}%` }} />
                          </div>
                          <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{filled}/{total}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{fmt(c.reward_per_task)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="badge badge-progress">In Progress</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden flex flex-col divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {campaigns.length === 0
              ? <p className="text-sm text-center py-8" style={{ color: 'var(--text-muted)' }}>No campaigns yet</p>
              : campaigns.map(c => {
              const pm     = PLATFORM[c.platform] || PLATFORM.other;
              const filled = c.filled_slots || 0;
              const total  = c.total_slots  || 100;
              const prog   = c.progress_percentage ?? Math.round((filled / total) * 100);
              const earned = (filled * parseFloat(c.reward_per_task || 0)).toFixed(2);
              return (
                <div key={c.id} className="flex items-start gap-3 px-4 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: pm.bg, color: pm.color }}>
                    <pm.Icon size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{c.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="progress-track flex-1" style={{ height: 4 }}>
                        <div className="progress-fill" style={{ width: `${prog}%` }} />
                      </div>
                      <span className="text-xs tabular-nums shrink-0" style={{ color: 'var(--text-muted)' }}>{filled}/{total}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{fmt(c.reward_per_task)}</p>
                    <span className="badge badge-progress mt-1">In Progress</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ROW 3: Earnings Overview + Notifications side by side ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Earnings Overview */}
          <div className="bg-white rounded-2xl p-5 border border-[var(--border-subtle)]"
            style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Earnings Overview</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Monthly earnings trend</p>
              </div>
              <button className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[var(--border)] transition-colors hover:border-[#6C5CE7]"
                style={{ color: 'var(--text-muted)', background: 'var(--bg)' }}>
                This Month <ChevronDown size={11} />
              </button>
            </div>

            <div className="flex items-end justify-between mb-1">
              <div>
                <p className="font-black leading-none" style={{ fontSize: '2rem', letterSpacing: '-0.03em', color: 'var(--text)' }}>
                  {fmt(thisMonth)}
                </p>
                <p className="text-xs font-semibold flex items-center gap-1 mt-1.5" style={{ color: 'var(--text-muted)' }}>
                  <TrendingUp size={11} strokeWidth={2.5} />
                  {lastMonth > 0
                    ? `${((thisMonth - lastMonth) / lastMonth * 100).toFixed(1)}% vs last month (${fmt(lastMonth)})`
                    : fmt(thisMonth) + ' earned this month'}
                </p>
              </div>
            </div>

            <div className="-mx-1 mt-3">
              <MiniChart data={chartData} color="#6C5CE7" />
            </div>

            <div className="grid grid-cols-6 gap-1 mt-2 pt-3 border-t border-[var(--border-subtle)]">
              {['J','F','M','A','M','J','J','A','S','O','N','D'].map((m, i) => (
                <div key={i} className="text-center">
                  <div className="h-1 rounded-full mb-1" style={{
                    background: i === 11 ? '#6C5CE7' : 'var(--border)',
                    opacity: i > 5 ? 1 : 0.4,
                  }} />
                  <span className="text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Notifications — from real transactions */}
          <div className="bg-white rounded-2xl border border-[var(--border-subtle)] overflow-hidden"
            style={{ boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
              <div>
                <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Recent Activity</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Your latest updates</p>
              </div>
              <Link href="/notifications" className="text-xs font-semibold hover:opacity-80 transition-opacity flex items-center gap-1"
                style={{ color: '#6C5CE7' }}>
                View all <ArrowUpRight size={11} />
              </Link>
            </div>
            {notifs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Bell size={28} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.35 }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No activity yet</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>Complete tasks to see earnings here</p>
              </div>
            ) : (
              <ul>
                {notifs.map((n, i) => {
                  const m = NOTIF_META[n.type] || NOTIF_META.default;
                  return (
                    <li key={i}
                      className="table-row-hover flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors"
                      style={{ borderBottom: i < notifs.length - 1 ? '1px solid var(--border-subtle)' : undefined }}>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: m.bg, color: m.color }}>
                        <m.Icon size={13} strokeWidth={2} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight truncate" style={{ color: 'var(--text)' }}>{n.text}</p>
                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>{n.sub}</p>
                      </div>
                      <span className="text-xs shrink-0 tabular-nums" style={{ color: 'var(--text-muted)' }}>{n.time}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>


      </div>
    </DashboardLayout>
  );
}
