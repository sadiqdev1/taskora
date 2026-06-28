'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet, apiPost } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Smartphone, CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';
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
  approved: { Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A', label: 'Approved' },
  pending:  { Icon: Clock,        bg: '#FFF3D6', color: '#B45309', label: 'Pending'  },
  rejected: { Icon: XCircle,      bg: '#FFE0E0', color: '#C0392B', label: 'Rejected' },
};

const MOCK = [
  { id: 1, user: { name: 'John Doe',  email: 'john@example.com'  }, campaign: { title: 'Instagram Post Engagement', platform: 'instagram', reward_per_task: 3.00 }, proof: 'https://instagram.com/p/example', status: 'pending',  created_at: '2026-06-22T08:00:00Z' },
  { id: 2, user: { name: 'Alice K.',  email: 'alice@example.com' }, campaign: { title: 'TikTok Video Promotion',    platform: 'tiktok',    reward_per_task: 4.00 }, proof: 'https://tiktok.com/@user/123',   status: 'pending',  created_at: '2026-06-22T09:00:00Z' },
  { id: 3, user: { name: 'Bob Lee',   email: 'bob@example.com'   }, campaign: { title: 'YouTube Channel Boost',     platform: 'youtube',   reward_per_task: 4.00 }, proof: 'https://youtube.com/channel/ex', status: 'approved', created_at: '2026-06-21T14:00:00Z' },
  { id: 4, user: { name: 'Sara M.',   email: 'sara@example.com'  }, campaign: { title: 'Twitter Post Engagement',   platform: 'twitter',   reward_per_task: 2.50 }, proof: 'https://twitter.com/status/123', status: 'rejected', created_at: '2026-06-21T10:00:00Z' },
  { id: 5, user: { name: 'David P.',  email: 'david@example.com' }, campaign: { title: 'Facebook Page Like',        platform: 'facebook',  reward_per_task: 2.50 }, proof: 'https://fb.com/page/example',   status: 'pending',  created_at: '2026-06-22T07:30:00Z' },
];

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState(MOCK);
  const [filter, setFilter]           = useState('pending');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing]   = useState(null);

  useEffect(() => {
    apiGet('/admin/submissions', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(d => { if (d?.data?.length) setSubmissions(d.data); }).catch(() => {});
  }, []);

  async function handle(id, action, reason = '') {
    setProcessing(id);
    try {
      await apiPost(`/admin/submissions/${id}/review`, { status: action, rejection_reason: reason },
        { headers: { Authorization: `Bearer ${getToken()}` } });
    } catch {}
    finally {
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: action } : s));
      setProcessing(null); setRejectingId(null); setRejectReason('');
    }
  }

  const filtered = filter === 'all' ? submissions : submissions.filter(s => s.status === filter);
  const counts = {
    all:      submissions.length,
    pending:  submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  return (
    <DashboardLayout title="Submissions Review" subtitle="Approve or reject task submissions" adminOnly>

      {/* Filter tabs */}
      <div className="scroll-tabs flex items-center gap-1 p-1 rounded-xl mb-5 overflow-x-auto" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {['pending', 'approved', 'rejected', 'all'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap shrink-0"
            style={filter === f ? { background: '#6C5CE7', color: 'white' } : { color: 'var(--text-secondary)' }}>
            {f === 'all' ? 'All' : f}
            <span className="text-xs px-1.5 py-0.5 rounded-full"
              style={filter === f ? { background: 'rgba(255,255,255,0.25)' } : { background: 'var(--border)' }}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      <div className="card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['User', 'Campaign', 'Proof', 'Reward', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const pm = PLATFORM_META[s.campaign.platform] || PLATFORM_META.other;
              const sm = STATUS_META[s.status] || STATUS_META.pending;
              return (
                <>
                  <tr key={s.id}
                    style={{ borderBottom: rejectingId === s.id ? undefined : i < filtered.length - 1 ? '1px solid var(--border-subtle)' : undefined }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="gradient-brand w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {s.user.name[0]}
                        </span>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{s.user.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: pm.bg, color: pm.color }}>
                          <pm.Icon size={13} strokeWidth={1.8} />
                        </span>
                        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.campaign.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 max-w-[130px]">
                      <a href={s.proof} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs hover:underline truncate"
                        style={{ color: 'var(--primary)' }}>
                        <ExternalLink size={11} strokeWidth={2} className="flex-shrink-0" />
                        <span className="truncate">{s.proof}</span>
                      </a>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-sm" style={{ color: 'var(--text)' }}>
                      ${parseFloat(s.campaign.reward_per_task).toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ background: sm.bg, color: sm.color }}>
                        <sm.Icon size={11} strokeWidth={2.2} /> {sm.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      {s.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handle(s.id, 'approved')} disabled={processing === s.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 disabled:opacity-50 transition-opacity"
                            style={{ background: '#D4F6EE', color: '#00875A' }}>
                            {processing === s.id ? '…' : 'Approve'}
                          </button>
                          <button onClick={() => setRejectingId(rejectingId === s.id ? null : s.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                            style={{ background: '#FFE0E0', color: '#C0392B' }}>
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {rejectingId === s.id && (
                    <tr key={`rej-${s.id}`} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : undefined }}>
                      <td colSpan={7} className="px-5 pb-4 pt-2">
                        <div className="flex gap-3 items-center">
                          <input value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection (optional)…"
                            className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
                            style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }} />
                          <button onClick={() => handle(s.id, 'rejected', rejectReason)} disabled={processing === s.id}
                            className="px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 disabled:opacity-50"
                            style={{ background: '#C0392B', color: 'white' }}>
                            Confirm
                          </button>
                          <button onClick={() => setRejectingId(null)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold"
                            style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <rect width="56" height="56" rx="14" fill="#EEF2FF"/>
              <path d="M14 42 L14 22 L28 13 L42 22 L42 42 Z" stroke="#6C5CE7" strokeWidth="1.5" strokeLinejoin="round" fill="#F5F3FF"/>
              <rect x="21" y="30" width="14" height="12" rx="2" stroke="#6C5CE7" strokeWidth="1.5" fill="white"/>
              <path d="M18 24 L28 16 L38 24" stroke="#A29BFE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="text-center">
              <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>No {filter} submissions</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Submissions will appear here once they come in.</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
