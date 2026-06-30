'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';
import {
  Wallet, DollarSign, CheckCircle2, Star, Smartphone,
  TrendingUp, Award, CircleDollarSign, ArrowUpRight,
  ChevronDown, Bell, Zap,
} from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';

const fmt = n => '$' + parseFloat(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

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
  campaign:       { Icon: Star,             bg: '#EEF2FF', color: '#6C5CE7' },
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

const CHART_DATA = [1200, 1800, 1400, 2200, 1900, 2600, 2800, 3100, 2900, 3300, 3450, 3560];
const MOCK_CAMPAIGNS = [
  { id: 1, title: 'Instagram Post Engagement', description: 'Like and comment on post',     platform: 'instagram', reward_per_task: 3.00, total_slots: 100, filled_slots: 50, progress_percentage: 50 },
  { id: 2, title: 'TikTok Video Promotion',    description: 'Watch and like TikTok video',  platform: 'tiktok',    reward_per_task: 4.00, total_slots: 50,  filled_slots: 20, progress_percentage: 40 },
  { id: 3, title: 'YouTube Channel Boost',     description: 'Subscribe & watch full video', platform: 'youtube',   reward_per_task: 4.00, total_slots: 30,  filled_slots: 10, progress_percentage: 33 },
  { id: 4, title: 'Twitter Post Engagement',   description: 'Retweet and like the post',    platform: 'twitter',   reward_per_task: 2.50, total_slots: 25,  filled_slots: 15, progress_percentage: 60 },
  { id: 5, title: 'Facebook Page Like',        description: 'Like page and stay active',    platform: 'facebook',  reward_per_task: 2.50, total_slots: 50,  filled_slots: 25, progress_percentage: 50 },
];
const MOCK_NOTIFS = [
  { type: 'earning',        text: 'Task approved',        sub: 'You earned $3.00 from Instagram Boost',  time: '2m ago'  },
  { type: 'campaign',       text: 'New campaign live',    sub: 'YouTube Boost — $4.00 per task',         time: '15m ago' },
  { type: 'withdrawal',     text: 'Withdrawal sent',      sub: '$300.00 sent to your bank account',      time: '1h ago'  },
  { type: 'referral_bonus', text: 'Referral bonus',       sub: '$5.00 from a friend you invited',        time: '3h ago'  },
  { type: 'earning',        text: 'Task approved',        sub: 'You earned $2.50 from Facebook Like',    time: '5h ago'  },
];

function SkeletonBox({ className, style }) {
  return <div className={`rounded-xl animate-pulse bg-[#E8E6F8] ${className}`} style={style} />;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [walletData, setWalletData] = useState(null);
  const [campaigns,  setCampaigns]  = useState([]);
  const [isLoading,  setIsLoading]  = useState(true);

  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const load = useCallback(async () => {
    try {
      const [w, c] = await Promise.all([
        apiGet('/wallet',                        { headers: { Authorization: `Bearer ${getToken()}` } }),
        apiGet('/campaigns?mine=1&per_page=5',   { headers: { Authorization: `Bearer ${getToken()}` } }),
      ]);
      setWalletData(w);
      setCampaigns(c?.data || []);
    } catch { /* fallback to mock */ }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const walletBal     = walletData ? parseFloat(walletData.wallet_balance)      : 1250.00;
  const totalEarnings = walletData ? parseFloat(walletData.total_earnings)      : 3560.75;
  const tasksDone     = walletData ? walletData.tasks_completed                 : 128;
  const successRate   = walletData ? walletData.success_rate                    : 98.5;
  const thisMonth     = walletData ? parseFloat(walletData.this_month_earnings) : 3560.75;
  const lastMonth     = walletData ? parseFloat(walletData.last_month_earnings) : 3165.20;
  const data          = campaigns.length ? campaigns : MOCK_CAMPAIGNS;

  if (isLoading && !walletData && campaigns.length === 0) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Welcome back — here's your earnings overview">
        <div className="flex flex-col gap-5">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <SkeletonBox className="h-6 w-48" />
              <SkeletonBox className="h-4 w-72" />
            </div>
            <SkeletonBox className="h-9 w-32 hidden sm:block" />
          </div>
          {/* Stat cards skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <SkeletonBox className="col-span-2 lg:col-span-2 h-36" />
            <SkeletonBox className="h-36" />
            <SkeletonBox className="h-36" />
          </div>
          {/* Campaigns table skeleton */}
          <div className="bg-white rounded-2xl border border-[var(--border-subtle)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
              <SkeletonBox className="h-5 w-40" />
              <SkeletonBox className="h-4 w-16" />
            </div>
            <div className="flex flex-col divide-y divide-[var(--border-subtle)]">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <SkeletonBox className="w-8 h-8 shrink-0" />
                  <div className="flex flex-col gap-1.5 flex-1">
                    <SkeletonBox className="h-3.5 w-48" />
                    <SkeletonBox className="h-3 w-32" />
                  </div>
                  <SkeletonBox className="h-3 w-20 hidden sm:block" />
                  <SkeletonBox className="h-3 w-24 hidden sm:block" />
                  <SkeletonBox className="h-3 w-16 hidden sm:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
          <Link href="/tasks"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] transition-colors">
            <Zap size={14} strokeWidth={2.5} /> Browse Tasks
          </Link>
        </div>

        {/* ── Onboarding checklist — show only if tasks completed < 1 ── */}
        {tasksDone === 0 && (
          <div className="card rounded-2xl p-5 border-l-4" style={{ borderLeftColor: '#6C5CE7' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Get started 🚀</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Complete these steps to start earning</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
                1/4 done
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { done: true,  label: 'Create your account',            sub: 'You\'re in!'                          },
                { done: false, label: 'Complete your first task',        sub: 'Browse available tasks and earn'      },
                { done: false, label: 'Set up your withdrawal method',   sub: 'Add your bank account in Wallet'      },
                { done: false, label: 'Invite a friend',                 sub: 'Earn 10% of their earnings forever'   },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                  style={{ background: item.done ? '#F0FDF4' : 'var(--bg)' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2"
                    style={item.done
                      ? { background: '#00875A', borderColor: '#00875A', color: 'white' }
                      : { background: 'white', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                    {item.done && <span className="text-[0.6rem] font-black">✓</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: item.done ? '#00875A' : 'var(--text)', textDecoration: item.done ? 'line-through' : 'none' }}>
                      {item.label}
                    </p>
                    <p className="text-[0.65rem]" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
              {/* Pending balance */}
              <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Pending: <span className="text-white/80 font-bold">{fmt(walletData?.pending_balance ?? 125.00)}</span>
              </p>
            </div>
            {/* Always show withdraw + deposit — disable withdraw if $0 */}
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
              <p className="text-xs font-semibold flex items-center gap-1 mt-2 text-emerald-600">
                <TrendingUp size={11} strokeWidth={2.5} /> +12.5% this month
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
              <p className="text-xs font-semibold flex items-center gap-1 mt-2 text-emerald-600">
                <TrendingUp size={11} strokeWidth={2.5} /> +15.6% this week
              </p>
            </div>
          </div>

        </div>

        {/* ── ROW 2: Active Campaigns table — full width ── */}
        <div className="bg-white rounded-2xl border border-[var(--border-subtle)] overflow-hidden"
          style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>My Active Campaigns</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Your currently running campaigns</p>
            </div>
            <Link href="/campaigns" className="text-xs font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: '#6C5CE7' }}>
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          {/* Desktop table / Mobile cards */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]" style={{ background: 'var(--bg)' }}>
                  {['Campaign', 'Platform', 'Progress', 'Earned', 'Status'].map(h => (
                    <th key={h} className="px-5 py-2.5 text-left text-xs font-semibold"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((c, i) => {
                  const pm     = PLATFORM[c.platform] || PLATFORM.other;
                  const filled = c.filled_slots || 0;
                  const total  = c.total_slots  || 100;
                  const prog   = c.progress_percentage ?? Math.round((filled / total) * 100);
                  const earned = (filled * parseFloat(c.reward_per_task || 0)).toFixed(2);
                  return (
                    <tr key={c.id}
                      className="table-row-hover transition-colors"
                      style={{ borderBottom: i < data.length - 1 ? '1px solid var(--border-subtle)' : undefined }}>
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
                      <td className="px-5 py-3.5 capitalize text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                        {c.platform}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="progress-track w-20 shrink-0">
                            <div className="progress-fill" style={{ width: `${prog}%` }} />
                          </div>
                          <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                            {filled}/{total}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{fmt(earned)}</span>
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
            {data.map(c => {
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
                    <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{fmt(earned)}</p>
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
                <p className="text-xs font-semibold flex items-center gap-1 mt-1.5 text-emerald-600">
                  <TrendingUp size={11} strokeWidth={2.5} /> 12.5% vs last month ({fmt(lastMonth)})
                </p>
              </div>
            </div>

            <div className="-mx-1 mt-3">
              <MiniChart data={CHART_DATA} color="#6C5CE7" />
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

          {/* Recent Notifications */}
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
            {MOCK_NOTIFS.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Bell size={28} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.35 }} />
                <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>You&apos;re all caught up</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>No new notifications</p>
              </div>
            ) : (
              <ul>
                {MOCK_NOTIFS.map((n, i) => {
                  const m = NOTIF_META[n.type] || NOTIF_META.default;
                  return (
                    <li key={i}
                      className="table-row-hover flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors"
                      style={{ borderBottom: i < MOCK_NOTIFS.length - 1 ? '1px solid var(--border-subtle)' : undefined }}>
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

        {/* ── ROW 4: Available Tasks — full width ── */}
        <div className="bg-white rounded-2xl border border-[var(--border-subtle)] overflow-hidden"
          style={{ boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Available Tasks</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Pick a task and start earning</p>
            </div>
            <Link href="/tasks" className="text-xs font-semibold flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: '#6C5CE7' }}>
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {data.map(t => {
              const pm = PLATFORM[t.platform] || PLATFORM.other;
              const slotsLeft = (t.total_slots || 0) - (t.filled_slots || 0);
              const diffBg = { easy: '#D4F6EE', medium: '#FFF3D6', hard: '#FFE0E0' }[t.difficulty] || '#D4F6EE';
              const diffColor = { easy: '#00875A', medium: '#B45309', hard: '#C0392B' }[t.difficulty] || '#00875A';
              return (
                <div key={t.id}
                  className="rounded-xl p-4 flex flex-col gap-3 border border-[var(--border-subtle)] transition-all hover:shadow-md hover:-translate-y-0.5 duration-150"
                  style={{ background: 'var(--bg)' }}>
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: pm.bg, color: pm.color }}>
                      <pm.Icon size={17} />
                    </span>
                    <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full capitalize"
                      style={{ background: diffBg, color: diffColor }}>
                      {t.difficulty || 'easy'}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-snug" style={{ color: 'var(--text)' }}>{t.title}</p>
                    <p className="text-sm font-black mt-1" style={{ color: '#6C5CE7', letterSpacing: '-0.02em' }}>
                      {fmt(t.reward_per_task)}
                    </p>
                  </div>
                  {/* Slots left */}
                  <div>
                    <div className="flex items-center justify-between text-[0.62rem] mb-1" style={{ color: 'var(--text-muted)' }}>
                      <span>{slotsLeft} slots left</span>
                      <span>{t.progress_percentage ?? 0}%</span>
                    </div>
                    <div className="progress-track" style={{ height: 4 }}>
                      <div className="progress-fill" style={{ width: `${t.progress_percentage ?? 0}%` }} />
                    </div>
                  </div>
                  <Link href={`/tasks/${t.id}`}
                    className="w-full py-1.5 rounded-lg text-center text-xs font-semibold bg-[#6C5CE7] text-white hover:bg-[#5A4BD1] transition-colors mt-auto">
                    Start Task
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
