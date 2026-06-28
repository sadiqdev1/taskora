'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet, apiPost } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Search, Users, CheckCircle2, Clock, DollarSign, ShieldCheck } from 'lucide-react';

function fmt(n) {
  return '$' + parseFloat(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const MOCK = [
  { id: 1, name: 'John Doe',    email: 'john@example.com',   role: 'user', wallet_balance: 1250.50, total_earnings: 3560.75, is_verified: true,  task_submissions_count: 128, created_at: '2026-01-15' },
  { id: 2, name: 'Alice Kim',   email: 'alice@example.com',  role: 'user', wallet_balance:  480.00, total_earnings:  980.00, is_verified: true,  task_submissions_count: 42,  created_at: '2026-02-20' },
  { id: 3, name: 'Bob Lee',     email: 'bob@example.com',    role: 'user', wallet_balance:  120.75, total_earnings:  320.75, is_verified: false, task_submissions_count: 15,  created_at: '2026-03-10' },
  { id: 4, name: 'Sara Martin', email: 'sara@example.com',   role: 'user', wallet_balance:  640.20, total_earnings: 1200.20, is_verified: true,  task_submissions_count: 67,  created_at: '2026-04-05' },
  { id: 5, name: 'David Park',  email: 'david@example.com',  role: 'user', wallet_balance:   50.00, total_earnings:  150.00, is_verified: false, task_submissions_count: 8,   created_at: '2026-05-18' },
  { id: 6, name: 'Eva Cruz',    email: 'eva@example.com',    role: 'user', wallet_balance:  890.50, total_earnings: 2100.50, is_verified: true,  task_submissions_count: 98,  created_at: '2026-05-22' },
];

export default function AdminUsersPage() {
  const [users, setUsers]       = useState(MOCK);
  const [search, setSearch]     = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    apiGet('/admin/users', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(d => { if (d?.data?.length) setUsers(d.data); }).catch(() => {});
  }, []);

  async function toggleVerify(u) {
    setUpdating(u.id);
    const newVal = !u.is_verified;
    try {
      await apiPost(`/admin/users/${u.id}`, { is_verified: newVal }, { headers: { Authorization: `Bearer ${getToken()}` } });
    } catch {}
    finally {
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_verified: newVal } : x));
      setUpdating(null);
    }
  }

  const filtered = search
    ? users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    : users;

  const totalEarnings = users.reduce((a, u) => a + parseFloat(u.total_earnings || 0), 0);

  return (
    <DashboardLayout title="Manage Users" subtitle="View and manage all platform users" adminOnly>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Users',    value: users.length,                              Icon: Users,        bg: '#EEF2FF', color: 'var(--primary)' },
          { label: 'Verified',       value: users.filter(u => u.is_verified).length,   Icon: ShieldCheck,  bg: '#D4F6EE', color: '#00875A'        },
          { label: 'Unverified',     value: users.filter(u => !u.is_verified).length,  Icon: Clock,        bg: '#FFF3D6', color: '#B45309'        },
          { label: 'Total Earnings', value: fmt(totalEarnings),                         Icon: DollarSign,   bg: '#EEF2FF', color: 'var(--primary)' },
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

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 max-w-sm"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="flex-1 bg-transparent outline-none text-sm" style={{ color: 'var(--text)' }} />
      </div>

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['User', 'Wallet', 'Total Earned', 'Tasks', 'Joined', 'Verified', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id}
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : undefined }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="gradient-brand w-9 h-9 rounded-full text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                      {u.name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{u.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-bold text-sm" style={{ color: 'var(--primary)' }}>{fmt(u.wallet_balance)}</td>
                <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: 'var(--text)' }}>{fmt(u.total_earnings)}</td>
                <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{u.task_submissions_count}</td>
                <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                  {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                    style={u.is_verified ? { background: '#D4F6EE', color: '#00875A' } : { background: '#FFF3D6', color: '#B45309' }}>
                    {u.is_verified
                      ? <><CheckCircle2 size={11} strokeWidth={2.2} /> Verified</>
                      : <><Clock size={11} strokeWidth={2.2} /> Pending</>}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggleVerify(u)} disabled={updating === u.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 disabled:opacity-50 transition-opacity"
                    style={u.is_verified
                      ? { background: '#FFF3D6', color: '#B45309' }
                      : { background: '#D4F6EE', color: '#00875A' }}>
                    {updating === u.id ? '…' : u.is_verified ? 'Unverify' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Search size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No users found for &ldquo;{search}&rdquo;</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
