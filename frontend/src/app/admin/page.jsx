'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';
import {
  Users, Megaphone, ClipboardList, CreditCard, DollarSign,
  TrendingUp, UserPlus, BarChart2, ChevronRight,
  Smartphone, CheckCircle2, Clock, XCircle,
} from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';

function fmt(n) {
  return '$' + parseFloat(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const PLATFORM_META = {
  instagram: { Icon: FaInstagram, bg: '#FFE8F4', color: '#C13584' },
  tiktok:    { Icon: FaTiktok,    bg: '#F0F0F0', color: '#333333' },
  youtube:   { Icon: FaYoutube,   bg: '#FFE8E8', color: '#FF0000' },
  twitter:   { Icon: FaXTwitter,  bg: '#E8F5FF', color: '#1DA1F2' },
  facebook:  { Icon: FaFacebook,  bg: '#E8EFFF', color: '#1877F2' },
  other:     { Icon: Smartphone,  bg: '#F0EEFF', color: '#6C5CE7' },
};

const MOCK_STATS = {
  total_users: 5240, total_campaigns: 38, active_campaigns: 12,
  pending_submissions: 147, pending_withdrawals: 23,
  total_paid_out: 218450.00, total_earned_by_users: 312000.00, new_users_this_month: 342,
};

const RECENT_SUBMISSIONS = [
  { id: 1, user: { name: 'John Doe'  }, campaign: { title: 'Instagram Post Engagement', platform: 'instagram' }, reward: 3.00, status: 'pending',  time: '5m ago'  },
  { id: 2, user: { name: 'Alice K.'  }, campaign: { title: 'TikTok Video Promotion',    platform: 'tiktok'    }, reward: 4.00, status: 'pending',  time: '12m ago' },
  { id: 3, user: { name: 'Bob Lee'   }, campaign: { title: 'YouTube Channel Boost',     platform: 'youtube'   }, reward: 4.00, status: 'approved', time: '1h ago'  },
  { id: 4, user: { name: 'Sara M.'   }, campaign: { title: 'Twitter Post Engagement',   platform: 'twitter'   }, reward: 2.50, status: 'rejected', time: '2h ago'  },
  { id: 5, user: { name: 'David P.'  }, campaign: { title: 'Facebook Page Like',        platform: 'facebook'  }, reward: 2.50, status: 'pending',  time: '3h ago'  },
];

const STATUS_META = {
  approved: { Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A' },
  pending:  { Icon: Clock,        bg: '#FFF3D6', color: '#B45309' },
  rejected: { Icon: XCircle,      bg: '#FFE0E0', color: '#C0392B' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(MOCK_STATS);

  useEffect(() => {
    apiGet('/admin/stats', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(d => { if (d) setStats(d); }).catch(() => {});
  }, []);

  const statCards = [
    { label: 'Total Users',         value: stats.total_users?.toLocaleString(), Icon: Users,       bg: '#EEF2FF', color: 'var(--primary)', link: '/admin/users'       },
    { label: 'Active Campaigns',    value: stats.active_campaigns,               Icon: Megaphone,   bg: '#D4F6EE', color: '#00875A',        link: '/admin/campaigns'   },
    { label: 'Pending Submissions', value: stats.pending_submissions,            Icon: ClipboardList,bg:'#FFF3D6', color: '#B45309',        link: '/admin/submissions' },
    { label: 'Pending Withdrawals', value: stats.pending_withdrawals,            Icon: CreditCard,  bg: '#FFE0E0', color: '#C0392B',        link: '/admin/withdrawals' },
    { label: 'Total Paid Out',      value: fmt(stats.total_paid_out),            Icon: DollarSign,  bg: '#EEF2FF', color: 'var(--primary)', link: '/admin/withdrawals' },
    { label: 'Total User Earnings', value: fmt(stats.total_earned_by_users),     Icon: TrendingUp,  bg: '#D4F6EE', color: '#00875A',        link: null                 },
    { label: 'New Users (Month)',   value: stats.new_users_this_month,           Icon: UserPlus,    bg: '#F0EEFF', color: '#6C5CE7',        link: '/admin/users'       },
    { label: 'Total Campaigns',     value: stats.total_campaigns,                Icon: BarChart2,   bg: '#FFF3D6', color: '#B45309',        link: '/admin/campaigns'   },
  ];

  const quickActions = [
    { label: 'Review Submissions', href: '/admin/submissions', Icon: ClipboardList, urgent: stats.pending_submissions > 0 },
    { label: 'Process Withdrawals',href: '/admin/withdrawals', Icon: CreditCard,    urgent: stats.pending_withdrawals > 0 },
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
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['User', 'Campaign', 'Reward', 'Status', 'Time', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_SUBMISSIONS.map((s, i) => {
              const pm = PLATFORM_META[s.campaign.platform] || PLATFORM_META.other;
              const sm = STATUS_META[s.status] || STATUS_META.pending;
              return (
                <tr key={s.id}
                  style={{ borderBottom: i < RECENT_SUBMISSIONS.length - 1 ? '1px solid var(--border-subtle)' : undefined }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="gradient-brand w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {s.user.name[0]}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{s.user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: pm.bg, color: pm.color }}>
                        <pm.Icon size={12} strokeWidth={1.8} />
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.campaign.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold" style={{ color: 'var(--text)' }}>${s.reward.toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ background: sm.bg, color: sm.color }}>
                      <sm.Icon size={11} strokeWidth={2.2} /> {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>{s.time}</td>
                  <td className="px-5 py-3.5">
                    {s.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: '#D4F6EE', color: '#00875A' }}>Approve</button>
                        <button className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: '#FFE0E0', color: '#C0392B' }}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
