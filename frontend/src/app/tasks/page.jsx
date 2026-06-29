'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Smartphone, CheckCircle2, Clock, XCircle, DollarSign } from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';

const PLATFORM_META = {
  instagram: { Icon: FaInstagram, bg: '#FFE8F4', color: '#C13584' },
  tiktok:    { Icon: FaTiktok,    bg: '#F0F0F0', color: '#333333' },
  youtube:   { Icon: FaYoutube,   bg: '#FFE8E8', color: '#FF0000' },
  twitter:   { Icon: FaXTwitter,  bg: '#E8F5FF', color: '#1DA1F2' },
  facebook:  { Icon: FaFacebook,  bg: '#E8EFFF', color: '#1877F2' },
  other:     { Icon: Smartphone,  bg: '#F0EEFF', color: '#6C5CE7' },
};

const STATUS_META = {
  approved: { label: 'Approved', Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A' },
  pending:  { label: 'Pending',  Icon: Clock,        bg: '#FFF3D6', color: '#B45309' },
  rejected: { label: 'Rejected', Icon: XCircle,      bg: '#FFE0E0', color: '#C0392B' },
};

const MOCK = [
  { id: 1, status: 'approved', earned: 3.00, completed_at: '2026-06-21T10:00:00Z', campaign: { id: 1, title: 'Instagram Post Engagement', platform: 'instagram', reward_per_task: 3.00 } },
  { id: 2, status: 'approved', earned: 4.00, completed_at: '2026-06-20T14:00:00Z', campaign: { id: 2, title: 'TikTok Video Promotion',    platform: 'tiktok',    reward_per_task: 4.00 } },
  { id: 3, status: 'pending',  earned: 0,    completed_at: '2026-06-22T08:00:00Z', campaign: { id: 3, title: 'YouTube Channel Boost',     platform: 'youtube',   reward_per_task: 4.00 } },
  { id: 4, status: 'rejected', earned: 0,    completed_at: '2026-06-19T11:00:00Z', campaign: { id: 4, title: 'Twitter Post Engagement',   platform: 'twitter',   reward_per_task: 2.50 } },
  { id: 5, status: 'approved', earned: 2.50, completed_at: '2026-06-18T16:00:00Z', campaign: { id: 5, title: 'Facebook Page Like',        platform: 'facebook',  reward_per_task: 2.50 } },
];

export default function TasksPage() {
  const [submissions, setSubmissions] = useState(MOCK);
  const [filter, setFilter]           = useState('all');

  useEffect(() => {
    apiGet('/my-submissions', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(d => { if (d?.data?.length) setSubmissions(d.data); })
      .catch(() => {});
  }, []);

  const filtered     = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);
  const totalEarned  = submissions.filter(s => s.status === 'approved').reduce((a, s) => a + parseFloat(s.earned || 0), 0);

  const counts = {
    all:      submissions.length,
    approved: submissions.filter(s => s.status === 'approved').length,
    pending:  submissions.filter(s => s.status === 'pending').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  return (
    <DashboardLayout title="My Tasks" subtitle="Track all your task submissions">

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Submitted', value: counts.all,      Icon: CheckCircle2, bg: '#EEF2FF', color: 'var(--primary)' },
          { label: 'Approved',        value: counts.approved,  Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A'        },
          { label: 'Pending',         value: counts.pending,   Icon: Clock,        bg: '#FFF3D6', color: '#B45309'        },
          { label: 'Total Earned',    value: '$' + totalEarned.toFixed(2), Icon: DollarSign, bg: '#EEF2FF', color: 'var(--primary)' },
        ].map(s => (
          <div key={s.label} className="card rounded-2xl p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>
              <s.Icon size={18} strokeWidth={2} />
            </span>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              <p className="font-black text-xl" style={{ color: s.color, letterSpacing: '-0.02em' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="scroll-tabs flex items-center gap-1 p-1 rounded-xl mb-5 overflow-x-auto" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {['all', 'approved', 'pending', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap shrink-0"
          style={filter === f ? { background: '#6C5CE7', color: 'white' } : { color: 'var(--text-secondary)' }}>
            {f === 'all' ? 'All Tasks' : f}
            <span className="text-xs px-1.5 py-0.5 rounded-full"
              style={filter === f ? { background: 'rgba(255,255,255,0.25)' } : { background: 'var(--border)' }}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['Campaign', 'Platform', 'Reward', 'Status', 'Date', ''].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const pm   = PLATFORM_META[s.campaign?.platform] || PLATFORM_META.other;
              const sm   = STATUS_META[s.status] || STATUS_META.pending;
              const date = s.completed_at ? new Date(s.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—';
              return (
                <tr key={s.id}
                  className="table-row-hover transition-colors"
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : undefined }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: pm.bg, color: pm.color }}>
                        <pm.Icon size={16} strokeWidth={1.8} />
                      </span>
                      <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{s.campaign?.title || 'Unknown'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 capitalize text-sm" style={{ color: 'var(--text-secondary)' }}>{s.campaign?.platform}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-sm" style={{ color: s.status === 'approved' ? '#00875A' : 'var(--text-muted)' }}>
                      {s.status === 'approved' ? '+$' + parseFloat(s.earned || 0).toFixed(2) : '$' + parseFloat(s.campaign?.reward_per_task || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                      style={{ background: sm.bg, color: sm.color }}>
                      <sm.Icon size={12} strokeWidth={2.2} />
                      {sm.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>{date}</td>
                  <td className="px-5 py-3.5">
                    {s.status === 'rejected' && (
                      <Link href={`/tasks/${s.campaign_id || s.campaign?.id}`} className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                        Retry
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            {/* Simple SVG spot illustration */}
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="16" fill="#EEF2FF"/>
              <path d="M20 44 L20 28 L32 20 L44 28 L44 44 Z" stroke="#6C5CE7" strokeWidth="1.5" strokeLinejoin="round" fill="#F5F3FF"/>
              <rect x="27" y="34" width="10" height="10" rx="2" stroke="#6C5CE7" strokeWidth="1.5" fill="white"/>
              <path d="M24 30 L32 24 L40 30" stroke="#A29BFE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="text-center">
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>No {filter === 'all' ? '' : filter} tasks yet</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Complete campaigns to see your submissions here.</p>
            </div>
            <Link href="/campaigns"
              className="bg-[#6C5CE7] hover:bg-[#5A4BD1] mt-1 px-5 py-2 rounded-xl text-white text-xs font-semibold transition-colors">
              Browse Campaigns
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
