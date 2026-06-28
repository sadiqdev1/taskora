'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { DollarSign, ArrowUpRight, ArrowDownLeft, Users, Gift, CheckCircle2, Clock, XCircle, BarChart2 } from 'lucide-react';

function fmt(n) {
  return '$' + parseFloat(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const TYPE_META = {
  earning:        { label: 'Earning',        Icon: DollarSign,   bg: '#D4F6EE', color: '#00875A', sign: '+' },
  withdrawal:     { label: 'Withdrawal',     Icon: ArrowUpRight, bg: '#E0F0FF', color: '#0369A1', sign: '-' },
  deposit:        { label: 'Deposit',        Icon: ArrowDownLeft,bg: '#EEF2FF', color: 'var(--primary)', sign: '+' },
  referral_bonus: { label: 'Referral Bonus', Icon: Users,        bg: '#FFF3D6', color: '#B45309', sign: '+' },
  bonus:          { label: 'Bonus',          Icon: Gift,         bg: '#FFF3D6', color: '#B45309', sign: '+' },
};

const STATUS_META = {
  completed: { label: 'Completed', Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A' },
  pending:   { label: 'Pending',   Icon: Clock,        bg: '#FFF3D6', color: '#B45309' },
  failed:    { label: 'Failed',    Icon: XCircle,      bg: '#FFE0E0', color: '#C0392B' },
  cancelled: { label: 'Cancelled', Icon: XCircle,      bg: '#F5F5F5', color: '#666'    },
};

const MOCK = [
  { id: 1, type: 'earning',        amount: 150.00, status: 'completed', description: 'Earned from: Instagram Post Engagement', balance_after: 1250.50, created_at: '2026-06-22T09:00:00Z' },
  { id: 2, type: 'earning',        amount:  80.00, status: 'completed', description: 'Earned from: TikTok Video Promotion',    balance_after: 1100.50, created_at: '2026-06-21T14:00:00Z' },
  { id: 3, type: 'withdrawal',     amount: 300.00, status: 'completed', description: 'Withdrawal via PayPal',                  balance_after: 1020.50, created_at: '2026-06-20T10:00:00Z' },
  { id: 4, type: 'referral_bonus', amount:   5.00, status: 'completed', description: 'Referral bonus for inviting a friend',   balance_after: 1320.50, created_at: '2026-06-19T16:00:00Z' },
  { id: 5, type: 'earning',        amount:  40.00, status: 'completed', description: 'Earned from: YouTube Channel Boost',     balance_after: 1315.50, created_at: '2026-06-18T11:00:00Z' },
  { id: 6, type: 'earning',        amount:  37.50, status: 'completed', description: 'Earned from: Twitter Post Engagement',   balance_after: 1275.50, created_at: '2026-06-17T09:00:00Z' },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState(MOCK);
  const [filter, setFilter]             = useState('all');

  useEffect(() => {
    apiGet('/transactions', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(d => { if (d?.data?.length) setTransactions(d.data); })
      .catch(() => {});
  }, []);

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

  return (
    <DashboardLayout title="Transactions" subtitle="Full history of your earnings and withdrawals">

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl mb-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', display: 'inline-flex' }}>
        {['all', 'earning', 'withdrawal', 'referral_bonus'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap"
            style={filter === f ? { background: 'var(--primary)', color: 'white' } : { color: 'var(--text-secondary)' }}>
            {f === 'all' ? 'All' : f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['Type', 'Description', 'Amount', 'Balance After', 'Status', 'Date'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const tm = TYPE_META[t.type]     || TYPE_META.earning;
              const sm = STATUS_META[t.status] || STATUS_META.completed;
              const date = t.created_at
                ? new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : '—';
              return (
                <tr key={t.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : undefined }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: tm.bg, color: tm.color }}>
                        <tm.Icon size={15} strokeWidth={2} />
                      </span>
                      <span className="text-xs font-semibold" style={{ color: tm.color }}>{tm.label}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>
                    <span className="truncate block">{t.description}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-bold text-sm" style={{ color: t.type === 'withdrawal' ? '#C0392B' : '#00875A' }}>
                      {t.type === 'withdrawal' ? '-' : '+'}{fmt(t.amount)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: 'var(--text)' }}>{fmt(t.balance_after)}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit" style={{ background: sm.bg, color: sm.color }}>
                      <sm.Icon size={11} strokeWidth={2.2} /> {sm.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <BarChart2 size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No transactions yet.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
