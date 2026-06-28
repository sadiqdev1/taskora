'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet, apiPost } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { CreditCard, Building2, Bitcoin, CheckCircle2, Clock, XCircle, DollarSign, AlertCircle } from 'lucide-react';

function fmt(n) {
  return '$' + parseFloat(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const METHOD_META = {
  paypal: { Icon: CreditCard,  label: 'PayPal'         },
  bank:   { Icon: Building2,   label: 'Bank Transfer'  },
  crypto: { Icon: Bitcoin,     label: 'Crypto'         },
};

const STATUS_META = {
  pending:   { Icon: Clock,        bg: '#FFF3D6', color: '#B45309', label: 'Pending'   },
  completed: { Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A', label: 'Completed' },
  rejected:  { Icon: XCircle,      bg: '#FFE0E0', color: '#C0392B', label: 'Rejected'  },
};

const MOCK = [
  { id: 1, user: { name: 'John Doe',    email: 'john@example.com'  }, amount: 300.00, payment_method: 'paypal',  payment_details: 'john@paypal.com',  status: 'pending',   created_at: '2026-06-22T08:00:00Z' },
  { id: 2, user: { name: 'Alice Kim',   email: 'alice@example.com' }, amount: 150.00, payment_method: 'bank',    payment_details: '****4521',          status: 'pending',   created_at: '2026-06-21T14:00:00Z' },
  { id: 3, user: { name: 'Sara Martin', email: 'sara@example.com'  }, amount: 500.00, payment_method: 'crypto',  payment_details: '0x1a2b...3c4d',     status: 'completed', created_at: '2026-06-20T10:00:00Z' },
  { id: 4, user: { name: 'Eva Cruz',    email: 'eva@example.com'   }, amount:  80.00, payment_method: 'paypal',  payment_details: 'eva@paypal.com',    status: 'completed', created_at: '2026-06-19T09:00:00Z' },
  { id: 5, user: { name: 'Bob Lee',     email: 'bob@example.com'   }, amount: 200.00, payment_method: 'bank',    payment_details: '****9923',          status: 'rejected',  created_at: '2026-06-18T16:00:00Z' },
];

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals]     = useState(MOCK);
  const [filter, setFilter]               = useState('pending');
  const [processing, setProcessing]       = useState(null);
  const [rejectingId, setRejectingId]     = useState(null);
  const [rejectReason, setRejectReason]   = useState('');

  useEffect(() => {
    apiGet('/admin/withdrawals', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(d => { if (d?.data?.length) setWithdrawals(d.data); }).catch(() => {});
  }, []);

  async function handle(id, status, reason = '') {
    setProcessing(id);
    try {
      await apiPost(`/admin/withdrawals/${id}/process`, { status, rejection_reason: reason },
        { headers: { Authorization: `Bearer ${getToken()}` } });
    } catch {}
    finally {
      setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status } : w));
      setProcessing(null); setRejectingId(null); setRejectReason('');
    }
  }

  const filtered     = filter === 'all' ? withdrawals : withdrawals.filter(w => w.status === filter);
  const pendingTotal = withdrawals.filter(w => w.status === 'pending').reduce((a, w) => a + parseFloat(w.amount), 0);
  const counts = {
    pending: withdrawals.filter(w => w.status === 'pending').length,
    completed: withdrawals.filter(w => w.status === 'completed').length,
    rejected: withdrawals.filter(w => w.status === 'rejected').length,
    all: withdrawals.length,
  };

  return (
    <DashboardLayout title="Withdrawals" subtitle="Review and process user withdrawal requests" adminOnly>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Pending Requests', value: counts.pending,     Icon: Clock,        bg: '#FFF3D6', color: '#B45309' },
          { label: 'Pending Amount',   value: fmt(pendingTotal),  Icon: AlertCircle,  bg: '#FFE0E0', color: '#C0392B' },
          { label: 'Completed',        value: counts.completed,   Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A' },
          { label: 'Rejected',         value: counts.rejected,    Icon: XCircle,      bg: '#EEF2FF', color: 'var(--primary)' },
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
        {['pending', 'completed', 'rejected', 'all'].map(f => (
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

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['User', 'Amount', 'Method', 'Details', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((w, i) => {
              const mm = METHOD_META[w.payment_method] || METHOD_META.paypal;
              const sm = STATUS_META[w.status] || STATUS_META.pending;
              return (
                <>
                  <tr key={w.id}
                    style={{ borderBottom: rejectingId === w.id ? undefined : i < filtered.length - 1 ? '1px solid var(--border-subtle)' : undefined }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="gradient-brand w-9 h-9 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                          {w.user.name[0]}
                        </span>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{w.user.name}</p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{w.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-black text-lg" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>{fmt(w.amount)}</span>
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
                    <td className="px-5 py-3.5 text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{w.payment_details}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ background: sm.bg, color: sm.color }}>
                        <sm.Icon size={11} strokeWidth={2.2} /> {sm.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {new Date(w.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5">
                      {w.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button onClick={() => handle(w.id, 'completed')} disabled={processing === w.id}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 disabled:opacity-50 transition-opacity"
                            style={{ background: '#D4F6EE', color: '#00875A' }}>
                            {processing === w.id ? '…' : 'Approve'}
                          </button>
                          <button onClick={() => setRejectingId(rejectingId === w.id ? null : w.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                            style={{ background: '#FFE0E0', color: '#C0392B' }}>
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                  {rejectingId === w.id && (
                    <tr key={`rej-${w.id}`} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : undefined }}>
                      <td colSpan={7} className="px-5 pb-4 pt-2">
                        <div className="flex gap-3 items-center">
                          <input value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                            placeholder="Reason for rejection (optional)…"
                            className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
                            style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }} />
                          <button onClick={() => handle(w.id, 'rejected', rejectReason)} disabled={processing === w.id}
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
          <div className="text-center py-12">
            <CreditCard size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No {filter === 'all' ? '' : filter} withdrawals.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
