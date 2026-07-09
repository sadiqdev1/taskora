'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet, apiPatch } from '@/lib/api';
import { Smartphone, CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';
import UserAvatar from '@/components/UserAvatar';

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

export default function AdminSubmissionsPage() {
  const [submissions,  setSubmissions]  = useState([]);
  const [filter,       setFilter]       = useState('all');
  const [loading,      setLoading]      = useState(true);
  const [rejectingId,  setRejectingId]  = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing,   setProcessing]   = useState(null);
  const [actionError,  setActionError]  = useState('');

  useEffect(() => {
    apiGet('/admin/submissions?status=all&per_page=50')
      .then(d => setSubmissions(d?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handle(id, action, reason = '') {
    setProcessing(id);
    setActionError('');
    try {
      await apiPatch(`/admin/submissions/${id}/review`, { status: action, rejection_reason: reason });
      // Only update UI after confirmed server success
      setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: action } : s));
      setRejectingId(null);
      setRejectReason('');
    } catch (err) {
      setActionError(err.message || 'Action failed. Please try again.');
    } finally {
      setProcessing(null);
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

      {/* Action error banner */}
      {actionError && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl mb-4"
          style={{ background: '#FFF0F0', border: '1px solid #FFD0D0', color: '#C0392B' }}>
          <span className="text-sm">{actionError}</span>
          <button onClick={() => setActionError('')} className="text-xs font-semibold hover:opacity-70">Dismiss</button>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl mb-5 overflow-x-auto" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap shrink-0 cursor-pointer"
            style={filter === f ? { background: '#6C5CE7', color: 'white' } : { color: 'var(--text-secondary)' }}>
            {f === 'all' ? 'All' : f}
            <span className="text-xs px-1.5 py-0.5 rounded-full"
              style={filter === f ? { background: 'rgba(255,255,255,0.25)' } : { background: 'var(--border)' }}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="w-7 h-7 rounded-full border-[3px] animate-spin mx-auto"
            style={{ borderColor: 'var(--border-subtle)', borderTopColor: '#6C5CE7' }} />
        </div>
      ) : (
      <div className="card rounded-2xl overflow-hidden">

        {/* ── Desktop table — hidden on mobile ── */}
        <div className="admin-table-wrap">
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
                const pm = PLATFORM_META[s.campaign?.platform] || PLATFORM_META.other;
                const sm = STATUS_META[s.status] || STATUS_META.pending;
                return (
                  <>
                    <tr key={s.id}
                      style={{ borderBottom: rejectingId === s.id ? undefined : i < filtered.length - 1 ? '1px solid var(--border-subtle)' : undefined }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <UserAvatar user={s.user} size={32} />
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
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.campaign?.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 max-w-[130px]">
                        <a href={s.proof} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs hover:underline truncate"
                          style={{ color: 'var(--primary)' }}>
                          <ExternalLink size={11} strokeWidth={2} className="flex-shrink-0" />
                          <span className="truncate"> {s.proof}</span>
                        </a>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-sm" style={{ color: 'var(--text)' }}>
                        ₦{parseFloat(s.campaign?.reward_per_task || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ background: sm.bg, color: sm.color }}>
                          <sm.Icon size={11} strokeWidth={2.2} /> {sm.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                        {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
        </div>

        {/* ── Mobile card list — shown only on mobile ── */}
        <div className="admin-cards-wrap" style={{ borderColor: 'var(--border-subtle)' }}>
          {filtered.map((s, i) => {
            const pm = PLATFORM_META[s.campaign?.platform] || PLATFORM_META.other;
            const sm = STATUS_META[s.status] || STATUS_META.pending;
            return (
              <div key={s.id}>
                <div className="p-4 flex flex-col gap-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {/* Row 1: User avatar + name + email */}
                  <div className="flex items-center gap-3">
                    <UserAvatar user={s.user} size={36} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{s.user.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{s.user.email}</p>
                    </div>
                  </div>

                  {/* Row 2: Campaign platform icon + title */}
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: pm.bg, color: pm.color }}>
                      <pm.Icon size={13} />
                    </span>
                    <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{s.campaign?.title}</span>
                  </div>

                  {/* Row 3: Proof link + reward + status badge */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <a href={s.proof} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs hover:underline max-w-[50%] truncate"
                      style={{ color: 'var(--primary)' }}>
                      <ExternalLink size={11} strokeWidth={2} className="flex-shrink-0" />
                      <span className="truncate">View Proof</span>
                    </a>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                        ₦{parseFloat(s.campaign?.reward_per_task || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: sm.bg, color: sm.color }}>
                        <sm.Icon size={11} strokeWidth={2.2} /> {sm.label}
                      </span>
                    </div>
                  </div>

                  {/* Row 4: Date + action buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
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
                  </div>
                </div>

                {/* Reject reason panel — shown below the card on mobile */}
                {rejectingId === s.id && (
                  <div className="px-4 pb-4 pt-3 flex flex-col gap-2" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg)' }}>
                    <input value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      placeholder="Reason for rejection (optional)…"
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text)' }} />
                    <div className="flex gap-2">
                      <button onClick={() => handle(s.id, 'rejected', rejectReason)} disabled={processing === s.id}
                        className="flex-1 py-2 rounded-xl text-xs font-bold hover:opacity-80 disabled:opacity-50"
                        style={{ background: '#C0392B', color: 'white' }}>
                        Confirm Reject
                      </button>
                      <button onClick={() => setRejectingId(null)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold"
                        style={{ background: 'var(--surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

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
      )}
    </DashboardLayout>
  );
}
