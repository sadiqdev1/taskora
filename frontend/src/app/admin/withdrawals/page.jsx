'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet, apiPatch } from '@/lib/api';
import { CreditCard, Building2, Bitcoin, CheckCircle2, Clock, XCircle, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';

function fmt(n) {
  return '₦' + parseFloat(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const METHOD_META = {
  paypal: { Icon: CreditCard, label: 'PayPal'        },
  bank:   { Icon: Building2,  label: 'Bank Transfer' },
  crypto: { Icon: Bitcoin,    label: 'Crypto'        },
};

const STATUS_META = {
  pending:   { Icon: Clock,        bg: '#FFF3D6', color: '#B45309', label: 'Pending'   },
  completed: { Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A', label: 'Completed' },
  rejected:  { Icon: XCircle,      bg: '#FFE0E0', color: '#C0392B', label: 'Rejected'  },
};

/* ── Confirmation modal for the Approve action ── */
function ApproveModal({ withdrawal, onConfirm, onCancel, processing }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,12,40,0.6)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxHeight: '90dvh' }}>
        <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#D4F6EE', color: '#00875A' }}>
            <CheckCircle2 size={18} strokeWidth={2} />
          </span>
          <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Confirm Approval</h2>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            You are about to approve a withdrawal of{' '}
            <span className="font-black" style={{ color: 'var(--text)' }}>{fmt(withdrawal.amount)}</span>{' '}
            for <span className="font-semibold" style={{ color: 'var(--text)' }}>{withdrawal.user?.name}</span>.
          </p>
          <p className="text-xs px-3 py-2 rounded-xl" style={{ background: '#FFF3D6', color: '#B45309' }}>
            This action credits the user's bank account and cannot be undone.
          </p>
          <div className="flex gap-2">
            <button onClick={onCancel} disabled={processing}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              Cancel
            </button>
            <button onClick={onConfirm} disabled={processing}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: '#00875A', color: 'white' }}>
              {processing && <span className="btn-spinner" />}
              {processing ? 'Processing…' : 'Yes, Approve'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminWithdrawalsPage() {
  const [withdrawals,    setWithdrawals]    = useState([]);
  const [filter,         setFilter]         = useState('pending');
  const [loading,        setLoading]        = useState(true);
  const [processing,     setProcessing]     = useState(null);
  const [rejectingId,    setRejectingId]    = useState(null);
  const [rejectReason,   setRejectReason]   = useState('');
  const [confirmApprove, setConfirmApprove] = useState(null); // withdrawal object to approve
  const [actionError,    setActionError]    = useState('');   // per-action error message
  const [page,           setPage]           = useState(1);
  const [lastPage,       setLastPage]       = useState(1);

  const load = useCallback((status = filter, pg = 1) => {
    setLoading(true);
    apiGet(`/admin/withdrawals?status=${status}&per_page=20&page=${pg}`)
      .then(d => {
        setWithdrawals(pg === 1 ? (d?.data || []) : prev => [...prev, ...(d?.data || [])]);
        setLastPage(d?.last_page ?? 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    setPage(1);
    setWithdrawals([]);
    load(filter, 1);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handle(id, status, reason = '') {
    setProcessing(id);
    setActionError('');
    try {
      await apiPatch(`/admin/withdrawals/${id}/process`, { status, rejection_reason: reason });
      // Only update UI on confirmed success
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
      setConfirmApprove(null);
      setRejectingId(null);
      setRejectReason('');
    } catch (err) {
      // Surface the error — don't silently update UI
      setActionError(err.message || 'Action failed. Please try again.');
      setConfirmApprove(null);
    } finally {
      setProcessing(null);
    }
  }

  function loadMore() {
    const next = page + 1;
    setPage(next);
    load(filter, next);
  }

  const counts = {
    pending:   withdrawals.filter(w => w.status === 'pending').length,
    completed: withdrawals.filter(w => w.status === 'completed').length,
    rejected:  withdrawals.filter(w => w.status === 'rejected').length,
    all:       withdrawals.length,
  };
  const pendingTotal = withdrawals.filter(w => w.status === 'pending')
    .reduce((a, w) => a + parseFloat(w.amount), 0);

  return (
    <DashboardLayout title="Withdrawals" subtitle="Review and process user withdrawal requests" adminOnly>

      {/* Approval confirmation modal */}
      {confirmApprove && (
        <ApproveModal
          withdrawal={confirmApprove}
          processing={processing === confirmApprove.id}
          onConfirm={() => handle(confirmApprove.id, 'completed')}
          onCancel={() => setConfirmApprove(null)}
        />
      )}

      {/* Global action error banner */}
      {actionError && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl mb-4"
          style={{ background: '#FFF0F0', border: '1px solid #FFD0D0', color: '#C0392B' }}>
          <span className="flex items-center gap-2 text-sm">
            <AlertCircle size={15} strokeWidth={2} className="shrink-0" /> {actionError}
          </span>
          <button onClick={() => setActionError('')} className="text-xs font-semibold hover:opacity-70">Dismiss</button>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Pending Requests', value: counts.pending,    Icon: Clock,        bg: '#FFF3D6', color: '#B45309' },
          { label: 'Pending Amount',   value: fmt(pendingTotal), Icon: AlertCircle,  bg: '#FFE0E0', color: '#C0392B' },
          { label: 'Completed',        value: counts.completed,  Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A' },
          { label: 'Rejected',         value: counts.rejected,   Icon: XCircle,      bg: '#EEF2FF', color: 'var(--primary)' },
        ].map(s => (
          <div key={s.label} className="card rounded-2xl p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg, color: s.color }}>
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
      <div className="flex items-center gap-1 p-1 rounded-xl mb-5 overflow-x-auto"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {['pending', 'all', 'completed', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap shrink-0"
            style={filter === f ? { background: '#6C5CE7', color: 'white' } : { color: 'var(--text-secondary)' }}>
            {f === 'all' ? 'All' : f}
            {f !== 'all' && (
              <span className="text-xs px-1.5 py-0.5 rounded-full"
                style={filter === f ? { background: 'rgba(255,255,255,0.25)' } : { background: 'var(--border)' }}>
                {counts[f]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading && withdrawals.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-7 h-7 rounded-full border-[3px] animate-spin mx-auto"
            style={{ borderColor: 'var(--border-subtle)', borderTopColor: '#6C5CE7' }} />
        </div>
      ) : (
        <div className="card rounded-2xl overflow-hidden">

          {/* ── Desktop table ── */}
          <div className="admin-table-wrap">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['User', 'Amount', 'Method', 'Details', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w, i) => {
                  const mm = METHOD_META[w.payment_method] || METHOD_META.bank;
                  const sm = STATUS_META[w.status]         || STATUS_META.pending;
                  return (
                    <>
                      <tr key={w.id}
                        style={{ borderBottom: rejectingId === w.id ? undefined : i < withdrawals.length - 1 ? '1px solid var(--border-subtle)' : undefined }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <UserAvatar user={w.user} size={36} />
                            <div>
                              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{w.user.name}</p>
                              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{w.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-black text-lg" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                            {fmt(w.amount)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                              <mm.Icon size={13} strokeWidth={1.8} />
                            </span>
                            <span className="text-sm capitalize" style={{ color: 'var(--text-secondary)' }}>{mm.label}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
                          {w.payment_details}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                            style={{ background: sm.bg, color: sm.color }}>
                            <sm.Icon size={11} strokeWidth={2.2} /> {sm.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                          {new Date(w.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3.5">
                          {w.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setConfirmApprove(w)}
                                disabled={!!processing}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 disabled:opacity-40 transition-opacity"
                                style={{ background: '#D4F6EE', color: '#00875A' }}>
                                Approve
                              </button>
                              <button
                                onClick={() => { setRejectingId(rejectingId === w.id ? null : w.id); setRejectReason(''); }}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                                style={{ background: '#FFE0E0', color: '#C0392B' }}>
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>

                      {/* Reject reason row */}
                      {rejectingId === w.id && (
                        <tr key={`rej-${w.id}`}
                          style={{ borderBottom: i < withdrawals.length - 1 ? '1px solid var(--border-subtle)' : undefined }}>
                          <td colSpan={7} className="px-5 pb-4 pt-2">
                            <div className="flex gap-3 items-center">
                              <input
                                value={rejectReason}
                                onChange={e => setRejectReason(e.target.value)}
                                placeholder="Reason for rejection (optional)…"
                                className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
                                style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }} />
                              <button
                                onClick={() => handle(w.id, 'rejected', rejectReason)}
                                disabled={processing === w.id}
                                className="px-4 py-2 rounded-xl text-xs font-bold hover:opacity-80 disabled:opacity-50 flex items-center gap-1.5"
                                style={{ background: '#C0392B', color: 'white' }}>
                                {processing === w.id && <span className="btn-spinner" />}
                                Confirm
                              </button>
                              <button
                                onClick={() => setRejectingId(null)}
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

          {/* ── Mobile card list ── */}
          <div className="admin-cards-wrap" style={{ borderColor: 'var(--border-subtle)' }}>
            {withdrawals.map(w => {
              const mm = METHOD_META[w.payment_method] || METHOD_META.bank;
              const sm = STATUS_META[w.status]         || STATUS_META.pending;
              return (
                <div key={w.id}>
                  <div className="p-4 flex flex-col gap-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="flex items-center gap-3">
                      <UserAvatar user={w.user} size={40} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{w.user.name}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{w.user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-2xl" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>
                        {fmt(w.amount)}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ background: sm.bg, color: sm.color }}>
                        <sm.Icon size={11} strokeWidth={2.2} /> {sm.label}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                          <mm.Icon size={12} strokeWidth={1.8} />
                        </span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{mm.label}</span>
                      </div>
                      <p className="text-xs font-mono truncate" style={{ color: 'var(--text-muted)' }}>{w.payment_details}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(w.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>

                    {w.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setConfirmApprove(w)}
                          disabled={!!processing}
                          className="flex-1 py-2 rounded-lg text-xs font-bold hover:opacity-80 disabled:opacity-40 transition-opacity"
                          style={{ background: '#D4F6EE', color: '#00875A' }}>
                          Approve
                        </button>
                        <button
                          onClick={() => { setRejectingId(rejectingId === w.id ? null : w.id); setRejectReason(''); }}
                          className="flex-1 py-2 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                          style={{ background: '#FFE0E0', color: '#C0392B' }}>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>

                  {rejectingId === w.id && (
                    <div className="px-4 pb-4 pt-3 flex flex-col gap-2"
                      style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg)' }}>
                      <input
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection (optional)…"
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text)' }} />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handle(w.id, 'rejected', rejectReason)}
                          disabled={processing === w.id}
                          className="flex-1 py-2 rounded-xl text-xs font-bold hover:opacity-80 disabled:opacity-50 flex items-center justify-center gap-1.5"
                          style={{ background: '#C0392B', color: 'white' }}>
                          {processing === w.id && <span className="btn-spinner" />}
                          Confirm Reject
                        </button>
                        <button
                          onClick={() => setRejectingId(null)}
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

          {withdrawals.length === 0 && !loading && (
            <div className="text-center py-12">
              <CreditCard size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                No {filter === 'all' ? '' : filter} withdrawals.
              </p>
            </div>
          )}

          {/* Load more */}
          {page < lastPage && (
            <div className="px-5 py-4 border-t flex justify-center" style={{ borderColor: 'var(--border-subtle)' }}>
              <button
                onClick={loadMore}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                style={{ background: 'var(--bg)', color: 'var(--primary)', border: '1px solid var(--border)' }}>
                {loading ? <span className="btn-spinner" /> : <RefreshCw size={13} strokeWidth={2.5} />}
                Load more
              </button>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
