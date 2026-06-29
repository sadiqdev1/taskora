'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Link2, Users, DollarSign, CheckCircle2, Clock, Copy, Check, UserCheck } from 'lucide-react';

function fmt(n) {
  return '$' + parseFloat(n || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const MOCK_REFERRALS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', joined: '2026-06-01', earnings_generated: 120, bonus_earned: 12.00, status: 'active' },
  { id: 2, name: 'Bob Smith',     email: 'bob@example.com',   joined: '2026-06-10', earnings_generated: 85,  bonus_earned:  8.50, status: 'active' },
  { id: 3, name: 'Carol White',   email: 'carol@example.com', joined: '2026-06-15', earnings_generated: 40,  bonus_earned:  4.00, status: 'active' },
  { id: 4, name: 'David Lee',     email: 'david@example.com', joined: '2026-06-18', earnings_generated: 10,  bonus_earned:  1.00, status: 'active' },
  { id: 5, name: 'Eva Martinez',  email: 'eva@example.com',   joined: '2026-06-20', earnings_generated: 0,   bonus_earned:  5.00, status: 'pending' },
];

export default function ReferralsPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiGet('/wallet', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(setWallet).catch(() => {});
  }, []);

  const referralCode = wallet?.referral_code || user?.referral_code || 'REF12345';
  const referralLink = `https://taskora.io/register?ref=${referralCode}`;
  const totalBonus   = MOCK_REFERRALS.reduce((a, r) => a + r.bonus_earned, 0);

  function copy(text) {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <DashboardLayout title="Referrals" subtitle="Invite friends and earn 10% of their earnings">

      {/* How it works */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { step: '1', Icon: Link2,         title: 'Share your link',    desc: 'Copy your unique referral link and share with friends on social media, email or messaging apps.' },
          { step: '2', Icon: UserCheck,     title: 'Friend signs up',    desc: 'Your friend creates a free account using your link and starts earning on the platform.' },
          { step: '3', Icon: DollarSign,    title: 'Earn 10% forever',   desc: 'Earn 10% of every dollar your referral earns — forever. No cap on referral earnings.' },
        ].map(s => (
          <div key={s.step} className="card rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full gradient-brand text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{s.step}</span>
              <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                <s.Icon size={18} strokeWidth={1.8} />
              </span>
            </div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{s.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Referral link */}
      <div className="gradient-card rounded-2xl p-6 mb-6 relative overflow-hidden" style={{ boxShadow: '0 8px 24px rgba(108,92,231,0.30)' }}>
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <p className="text-xs font-semibold mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>Your Referral Code</p>
        <p className="font-black text-white text-3xl mb-1" style={{ letterSpacing: '0.05em' }}>{referralCode}</p>
        <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.5)' }}>Share this code or your link below</p>
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-0 flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Link2 size={13} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
            <span className="text-xs truncate text-white opacity-80">{referralLink}</span>
          </div>
          <button onClick={() => copy(referralLink)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ background: 'white', color: 'var(--primary)' }}>
            {copied ? <Check size={15} strokeWidth={2.5} /> : <Copy size={15} strokeWidth={2} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Referrals',  value: MOCK_REFERRALS.length,                                       Icon: Users,        bg: '#EEF2FF', color: 'var(--primary)' },
          { label: 'Total Bonus',      value: fmt(totalBonus),                                               Icon: DollarSign,   bg: '#D4F6EE', color: '#00875A'        },
          { label: 'Active',           value: MOCK_REFERRALS.filter(r => r.status === 'active').length,     Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A'        },
          { label: 'Pending',          value: MOCK_REFERRALS.filter(r => r.status === 'pending').length,    Icon: Clock,        bg: '#FFF3D6', color: '#B45309'        },
        ].map(s => (
          <div key={s.label} className="card rounded-2xl p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>
              <s.Icon size={18} strokeWidth={2} />
            </span>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              <p className="font-bold text-lg" style={{ color: s.color, letterSpacing: '-0.01em' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Your Referrals</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['User', 'Joined', 'Their Earnings', 'Your Bonus', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_REFERRALS.map((r, i) => (
              <tr key={r.id}
                style={{ borderBottom: i < MOCK_REFERRALS.length - 1 ? '1px solid var(--border-subtle)' : undefined }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="gradient-brand w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {r.name[0]}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{r.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {new Date(r.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: 'var(--text)' }}>{fmt(r.earnings_generated)}</td>
                <td className="px-5 py-3.5">
                  <span className="font-bold text-sm" style={{ color: '#00875A' }}>+{fmt(r.bonus_earned)}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                    style={r.status === 'active'
                      ? { background: '#D4F6EE', color: '#00875A' }
                      : { background: '#FFF3D6', color: '#B45309' }}>
                    {r.status === 'active' ? <CheckCircle2 size={11} strokeWidth={2.2} /> : <Clock size={11} strokeWidth={2.2} />}
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
