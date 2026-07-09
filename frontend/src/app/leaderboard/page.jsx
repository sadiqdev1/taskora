'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { ShieldCheck, Trophy, Medal, Star } from 'lucide-react';
import { FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa6';

function fmtNGN(n) {
  const v = parseFloat(n || 0);
  if (v >= 1_000_000) return '₦' + (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000)     return '₦' + (v / 1_000).toFixed(1) + 'K';
  return '₦' + v.toLocaleString('en-NG', { minimumFractionDigits: 2 });
}

const SOCIAL = {
  twitter:   { Icon: FaTwitter,   color: '#1DA1F2' },
  instagram: { Icon: FaInstagram, color: '#C13584' },
  tiktok:    { Icon: FaTiktok,    color: '#333'    },
};

const TIER = [
  { min: 1,  max: 1,  label: '🥇 Gold',   bg: 'linear-gradient(135deg,#F59E0B,#D97706)', text: 'white'    },
  { min: 2,  max: 3,  label: '🥈 Silver', bg: 'linear-gradient(135deg,#94A3B8,#64748B)', text: 'white'    },
  { min: 4,  max: 10, label: '🥉 Bronze', bg: 'linear-gradient(135deg,#CD7C2F,#A35C1A)', text: 'white'    },
  { min: 11, max: 25, label: '⭐ Rising',  bg: '#EEF2FF',                                  text: '#6C5CE7'  },
  { min: 26, max: 50, label: '🌱 Earner',  bg: '#F0FDF4',                                  text: '#00875A'  },
];

function getTier(rank) {
  return TIER.find(t => rank >= t.min && rank <= t.max) || TIER[4];
}

function Avatar({ user, size = 'md' }) {
  const dim = size === 'lg' ? 'w-16 h-16 text-xl' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-11 h-11 text-sm';
  const radius = size === 'lg' ? 'rounded-2xl' : 'rounded-xl';
  return (
    <div className={`${dim} ${radius} overflow-hidden flex items-center justify-center text-white font-black shrink-0`}
      style={{ background: 'linear-gradient(135deg,#6C5CE7,#7C3AED)' }}>
      {user.avatar
        ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        : (user.name?.[0] ?? '?')}
    </div>
  );
}

function PodiumCard({ user, rank }) {
  const isFirst  = rank === 1;
  const tier     = getTier(rank);
  const medals   = ['', '🥇', '🥈', '🥉'];

  return (
    <Link href={`/u/${user.username}`}
      className="relative flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-5 rounded-2xl no-underline transition-all duration-200 hover:-translate-y-1"
      style={{
        background:  isFirst ? 'linear-gradient(135deg,#6C5CE7 0%,#7C3AED 100%)' : 'white',
        border:      isFirst ? 'none' : '1px solid var(--border-subtle)',
        boxShadow:   isFirst ? '0 12px 32px rgba(108,92,231,0.4)' : 'var(--shadow-md)',
        paddingTop:  isFirst ? 28 : 20,
      }}>

      {/* Crown for #1 */}
      {isFirst && (
        <span className="absolute -top-5 text-3xl" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>👑</span>
      )}

      <span className="text-2xl">{medals[rank]}</span>

      {/* Avatar with ring */}
      <div className="relative">
        <div className={`rounded-2xl overflow-hidden flex items-center justify-center text-white font-black shrink-0 ${isFirst ? 'w-14 h-14 sm:w-20 sm:h-20 text-xl sm:text-2xl' : 'w-12 h-12 sm:w-16 sm:h-16 text-lg sm:text-xl'}`}
          style={{
            background: isFirst ? 'rgba(255,255,255,0.25)' : 'linear-gradient(135deg,#6C5CE7,#7C3AED)',
            boxShadow: isFirst ? '0 0 0 3px rgba(255,255,255,0.3)' : '0 0 0 3px #EEF2FF',
          }}>
          {user.avatar
            ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            : user.name?.[0]}
        </div>
        {user.is_verified && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
            <ShieldCheck size={11} strokeWidth={2.5} style={{ color: '#6C5CE7' }} />
          </span>
        )}
      </div>

      <div className="text-center">
        <p className={`font-bold text-xs sm:text-sm truncate max-w-[70px] sm:max-w-[100px] ${isFirst ? 'text-white' : ''}`}
          style={{ color: isFirst ? 'white' : 'var(--text)' }}>{user.name}</p>
        <p className="text-[0.6rem] sm:text-[0.65rem] mt-0.5 truncate max-w-[70px] sm:max-w-[100px]"
          style={{ color: isFirst ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)' }}>
          @{user.username}
        </p>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <p className={`font-black text-xs sm:text-base tracking-tight`}
          style={{ color: isFirst ? 'white' : '#6C5CE7' }}>
          {fmtNGN(user.total_earnings)}
        </p>
        <p className="text-[0.6rem]"
          style={{ color: isFirst ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>
          {user.tasks_completed} tasks
        </p>
      </div>
    </Link>
  );
}

function Skeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4 items-end">
        {[80, 100, 72].map((h, i) => (
          <div key={i} className="rounded-2xl animate-pulse" style={{ height: h + 120, background: 'var(--border-subtle)' }} />
        ))}
      </div>
      <div className="card rounded-2xl overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b last:border-0 animate-pulse"
            style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="w-7 h-4 rounded" style={{ background: 'var(--border-subtle)' }} />
            <div className="w-11 h-11 rounded-xl" style={{ background: 'var(--border-subtle)' }} />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3.5 w-36 rounded" style={{ background: 'var(--border-subtle)' }} />
              <div className="h-3 w-24 rounded" style={{ background: 'var(--border-subtle)' }} />
            </div>
            <div className="h-4 w-20 rounded" style={{ background: 'var(--border-subtle)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState('all');

  useEffect(() => {
    setLoading(true);
    apiGet(`/leaderboard?period=${period}`)
      .then(d => setLeaders(d?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  const top3 = leaders.slice(0, 3);
  const rest  = leaders.slice(3);

  return (
    <DashboardLayout title="Leaderboard" subtitle="Top earners on Taskora">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">

        {/* Header banner */}
        <div className="rounded-2xl p-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#1E1B3A 0%,#2D1B6E 100%)', boxShadow: '0 8px 32px rgba(30,27,58,0.35)' }}>
          <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full"
            style={{ background: 'rgba(108,92,231,0.15)' }} />
          <div className="absolute right-16 bottom-0 w-24 h-24 rounded-full"
            style={{ background: 'rgba(162,155,254,0.08)' }} />
          <div className="relative z-10 flex items-center gap-4">
            <span className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: 'rgba(255,255,255,0.08)' }}>🏆</span>
            <div>
              <h2 className="text-white font-black text-xl tracking-tight">Top Earners</h2>
              <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {leaders.length} earners ranked by total earnings
              </p>
            </div>
          </div>
        </div>

        {/* Period filter tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl self-start"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {[
            { value: 'all',   label: 'All Time' },
            { value: 'month', label: 'This Month' },
            { value: 'week',  label: 'This Week' },
          ].map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap"
              style={period === p.value
                ? { background: '#6C5CE7', color: 'white' }
                : { color: 'var(--text-secondary)' }}>
              {p.label}
            </button>
          ))}
        </div>

        {loading ? <Skeleton /> : leaders.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <Trophy size={44} strokeWidth={1.5} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No earners yet</p>
          </div>
        ) : (
          <>
            {/* ── Podium top 3 ── */}
            {top3.length > 0 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end pt-6">
                {[top3[1], top3[0], top3[2]].map((u, col) => {
                  if (!u) return <div key={col} />;
                  const rank = col === 1 ? 1 : col === 0 ? 2 : 3;
                  return <PodiumCard key={u.id} user={u} rank={rank} />;
                })}
              </div>
            )}

            {/* ── Rankings list ── */}
            {rest.length > 0 && (
              <div className="card rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b"
                  style={{ borderColor: 'var(--border-subtle)' }}>
                  <h2 className="text-sm font-bold" style={{ color: 'var(--text)' }}>Full Rankings</h2>
                  <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{ background: '#EEF2FF', color: '#6C5CE7' }}>{leaders.length} earners</span>
                </div>
                <ul>
                  {rest.map((u, i) => {
                    const tier         = getTier(u.rank);
                    const socialItems  = Object.entries(SOCIAL).filter(([k]) => u.social?.[k]);
                    return (
                      <li key={u.id}
                        className="flex items-center gap-3 px-5 py-3.5 table-row-hover transition-colors cursor-pointer"
                        style={{ borderBottom: i < rest.length - 1 ? '1px solid var(--border-subtle)' : undefined }}>

                        {/* Rank number */}
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                          style={{ background: tier.bg, color: tier.text }}>
                          {u.rank}
                        </div>

                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center text-white text-sm font-black shrink-0"
                          style={{ background: 'linear-gradient(135deg,#6C5CE7,#7C3AED)' }}>
                          {u.avatar
                            ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                            : u.name?.[0]}
                        </div>

                        {/* Name & meta */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/u/${u.username}`}
                            className="flex items-center gap-1.5 no-underline w-fit group">
                            <p className="text-sm font-semibold truncate group-hover:underline"
                              style={{ color: 'var(--text)' }}>{u.name}</p>
                            {u.is_verified && (
                              <ShieldCheck size={11} strokeWidth={2.5} style={{ color: '#6C5CE7' }} />
                            )}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                              @{u.username} · {u.tasks_completed} tasks
                            </p>
                            {socialItems.slice(0, 2).map(([key, meta]) => (
                              <meta.Icon key={key} size={10} style={{ color: meta.color }} />
                            ))}
                          </div>
                        </div>

                        {/* Tier badge — desktop only */}
                        <span className="hidden sm:block text-[0.65rem] font-bold px-2 py-0.5 rounded-lg shrink-0"
                          style={{ background: tier.bg, color: tier.text }}>
                          {tier.label}
                        </span>

                        {/* Earnings */}
                        <p className="text-sm font-black shrink-0 ml-1" style={{ color: '#6C5CE7', letterSpacing: '-0.02em' }}>
                          {fmtNGN(u.total_earnings)}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
