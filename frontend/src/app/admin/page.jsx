'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import {
  Users, Megaphone, ClipboardList, CreditCard, DollarSign,
  TrendingUp, UserPlus, BarChart2, ChevronRight,
  Smartphone, CheckCircle2, Clock, XCircle,
} from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';
import UserAvatar from '@/components/UserAvatar';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';

function fmt(n) {
  return '₦' + parseFloat(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const PLATFORM_META = {
  instagram: { Icon: FaInstagram, bg: '#FFE8F4', color: '#C13584' },
  tiktok:    { Icon: FaTiktok,    bg: '#F0F0F0', color: '#333333' },
  youtube:   { Icon: FaYoutube,   bg: '#FFE8E8', color: '#FF0000' },
  twitter:   { Icon: FaXTwitter,  bg: '#E8F5FF', color: '#1DA1F2' },
  facebook:  { Icon: FaFacebook,  bg: '#E8EFFF', color: '#1877F2' },
  other:     { Icon: Smartphone,  bg: '#F0EEFF', color: '#6C5CE7' },
};

const STATUS_META = {
  approved: { Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A' },
  pending:  { Icon: Clock,        bg: '#FFF3D6', color: '#B45309' },
  rejected: { Icon: XCircle,      bg: '#FFE0E0', color: '#C0392B' },
};

export default function AdminDashboard() {
  const [stats,       setStats]       = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [chartData,   setChartData]   = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet('/admin/stats'),
      apiGet('/admin/submissions?status=pending&per_page=5'),
    ]).then(([s, sub]) => {
      if (s) { setStats(s); setChartData(s.chart || []); }
      setSubmissions(sub?.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const s = stats || {
    total_users: 0, total_campaigns: 0, active_campaigns: 0,
    pending_submissions: 0, pending_withdrawals: 0,
    total_paid_out: 0, total_earned_by_users: 0, new_users_this_month: 0,
  };

  const statCards = [
    { label: 'Total Users',         value: s.total_users?.toLocaleString(),  Icon: Users,        bg: '#EEF2FF', color: 'var(--primary)', link: '/admin/users'       },
    { label: 'Active Campaigns',    value: s.active_campaigns,               Icon: Megaphone,    bg: '#D4F6EE', color: '#00875A',        link: '/admin/campaigns'   },
    { label: 'Pending Submissions', value: s.pending_submissions,            Icon: ClipboardList,bg:'#FFF3D6',  color: '#B45309',        link: '/admin/submissions' },
    { label: 'Pending Withdrawals', value: s.pending_withdrawals,            Icon: CreditCard,   bg: '#FFE0E0', color: '#C0392B',        link: '/admin/withdrawals' },
    { label: 'Total Paid Out',      value: fmt(s.total_paid_out),            Icon: DollarSign,   bg: '#EEF2FF', color: 'var(--primary)', link: '/admin/withdrawals' },
    { label: 'Total User Earnings', value: fmt(s.total_earned_by_users),     Icon: TrendingUp,   bg: '#D4F6EE', color: '#00875A',        link: null                 },
    { label: 'New Users (Month)',   value: s.new_users_this_month,           Icon: UserPlus,     bg: '#F0EEFF', color: '#6C5CE7',        link: '/admin/users'       },
    { label: 'Total Campaigns',     value: s.total_campaigns,                Icon: BarChart2,    bg: '#FFF3D6', color: '#B45309',        link: '/admin/campaigns'   },
  ];

  const quickActions = [
    { label: 'Review Submissions', href: '/admin/submissions', Icon: ClipboardList, urgent: s.pending_submissions > 0 },
    { label: 'Process Withdrawals',href: '/admin/withdrawals', Icon: CreditCard,    urgent: s.pending_withdrawals > 0 },
    { label: 'Manage Campaigns',   href: '/admin/campaigns',   Icon: Megaphone,     urgent: false },
    { label: 'Manage Users',       href: '/admin/users',       Icon: Users,         urgent: false },
  ];

  return (
    <DashboardLayout title="Admin Overview" subtitle="Platform statistics and management" adminOnly>

      {/* Stat grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {statCards.map(s => (
          <div key={s.label} className="card rounded-2xl p-5 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>
                <s.Icon size={17} strokeWidth={1.9} />
              </span>
            </div>
            <p className="font-black text-2xl mb-2" style={{ color: s.color, letterSpacing: '-0.02em' }}>{s.value}</p>
            {s.link && (
              <Link href={s.link} className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--primary)' }}>
                Manage <ChevronRight size={11} />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Chart — 30-day earnings & users */}
      {chartData.length > 0 && (
        <div className="card rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Platform Activity</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Last 30 days — earnings, new users, submissions</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6C5CE7" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00875A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#00875A" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid var(--border-subtle)', borderRadius: 12, fontSize: 12 }}
                formatter={(value, name) => [
                  name === 'earnings' ? `₦${parseFloat(value).toLocaleString('en-NG')}` : value,
                  name === 'earnings' ? 'Earnings' : name === 'new_users' ? 'New Users' : 'Submissions',
                ]}
              />
              <Legend iconType="circle" iconSize={8}
                formatter={v => v === 'earnings' ? 'Earnings' : v === 'new_users' ? 'New Users' : 'Submissions'} />
              <Area type="monotone" dataKey="earnings"    stroke="#6C5CE7" strokeWidth={2} fill="url(#gEarnings)" dot={false} />
              <Area type="monotone" dataKey="new_users"   stroke="#00875A" strokeWidth={2} fill="url(#gUsers)"    dot={false} />
              <Area type="monotone" dataKey="submissions" stroke="#B45309" strokeWidth={1.5} fill="none"          dot={false} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {quickActions.map(a => (
          <Link key={a.label} href={a.href}
            className="card rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition-all group">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
              <a.Icon size={17} strokeWidth={1.9} />
            </span>
            <span className="text-sm font-semibold flex-1" style={{ color: 'var(--text)' }}>{a.label}</span>
            {a.urgent && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#C0392B' }} />}
            <ChevronRight size={15} className="opacity-30 group-hover:opacity-70 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* Recent submissions */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Recent Submissions</h2>
          <Link href="/admin/submissions" className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--primary)' }}>
            View all <ChevronRight size={12} />
          </Link>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-7 h-7 rounded-full border-[3px] animate-spin mx-auto"
              style={{ borderColor: 'var(--border-subtle)', borderTopColor: '#6C5CE7' }} />
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>
            No pending submissions
          </div>
        ) : (
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['User', 'Campaign', 'Reward', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => {
              const pm = PLATFORM_META[s.campaign?.platform] || PLATFORM_META.other;
              const sm = STATUS_META[s.status] || STATUS_META.pending;
              return (
                <tr key={s.id}
                  style={{ borderBottom: i < submissions.length - 1 ? '1px solid var(--border-subtle)' : undefined }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <UserAvatar user={s.user} size={28} />
                      <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{s.user?.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: pm.bg, color: pm.color }}>
                        <pm.Icon size={12} />
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.campaign?.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold" style={{ color: 'var(--text)' }}>
                    ₦{parseFloat(s.campaign?.reward_per_task || 0).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ background: sm.bg, color: sm.color }}>
                      <sm.Icon size={11} strokeWidth={2.2} /> {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {s.created_at ? new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-3.5">
                    {s.status === 'pending' && (
                      <Link href="/admin/submissions" className="text-xs font-semibold" style={{ color: '#6C5CE7' }}>
                        Review →
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </DashboardLayout>
  );
}
