'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Smartphone, ArrowRight, ChevronDown } from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const PLATFORM_META = {
  instagram: { Icon: FaInstagram, bg: '#FFE8F4', color: '#C13584', label: 'Instagram' },
  tiktok:    { Icon: FaTiktok,    bg: '#F0F0F0', color: '#333333', label: 'TikTok'    },
  youtube:   { Icon: FaYoutube,   bg: '#FFE8E8', color: '#FF0000', label: 'YouTube'   },
  twitter:   { Icon: FaXTwitter,  bg: '#E8F5FF', color: '#1DA1F2', label: 'Twitter'   },
  facebook:  { Icon: FaFacebook,  bg: '#E8EFFF', color: '#1877F2', label: 'Facebook'  },
  other:     { Icon: Smartphone,  bg: '#F0EEFF', color: '#6C5CE7', label: 'Other'     },
};

const DIFF_COLORS = {
  easy:   { bg: '#D4F6EE', color: '#00875A' },
  medium: { bg: '#FFF3D6', color: '#B45309' },
  hard:   { bg: '#FFE0E0', color: '#C0392B' },
};

export default function TasksPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [platform,  setPlatform]  = useState('all');
  const [loading,   setLoading]   = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page,      setPage]      = useState(1);
  const [hasMore,   setHasMore]   = useState(false);
  const [open,      setOpen]      = useState(false);

  const selectedPM = PLATFORM_META[platform];

  const load = useCallback(async (pageNum = 1, append = false) => {
    try {
      const params = new URLSearchParams({ page: pageNum, per_page: 12 });
      if (platform !== 'all') params.set('platform', platform);
      const data = await apiGet(`/campaigns?${params}`);
      const items = data?.data || [];
      setCampaigns(prev => append ? [...prev, ...items] : items);
      setHasMore(data?.current_page < data?.last_page);
      setPage(pageNum);
    } catch { setCampaigns([]); }
    finally { setLoading(false); setLoadingMore(false); }
  }, [platform]);

  useEffect(() => { setLoading(true); load(1); }, [load]);

  function loadMore() { setLoadingMore(true); load(page + 1, true); }

  const filtered = platform === 'all' ? campaigns : campaigns.filter(c => c.platform === platform);

  return (
    <DashboardLayout title="Tasks" subtitle="Browse and start earning from available tasks">

      {/* Header row */}
      <div className="flex items-center gap-3 mb-6">

        {/* Platform dropdown filter */}
        <div className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:border-[#6C5CE7]"
            style={{
              background: 'var(--surface)',
              border: open ? '1.5px solid #6C5CE7' : '1.5px solid var(--border)',
              color: 'var(--text)',
              boxShadow: open ? '0 0 0 3px rgba(108,92,231,0.1)' : undefined,
            }}
          >
            {selectedPM
              ? <><selectedPM.Icon size={14} style={{ color: selectedPM.color }} /> {selectedPM.label}</>
              : <span style={{ color: 'var(--text-secondary)' }}>All Platforms</span>
            }
            <ChevronDown size={14} strokeWidth={2} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--text-muted)' }} />
          </button>

          {open && (
            <>
              {/* Backdrop to close */}
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div
                className="absolute left-0 top-full mt-1.5 z-20 rounded-xl overflow-hidden py-1"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', minWidth: 180 }}
              >
                {/* All option */}
                <button
                  onClick={() => { setPlatform('all'); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg)]"
                  style={{ color: platform === 'all' ? '#6C5CE7' : 'var(--text)', fontWeight: platform === 'all' ? 600 : 400 }}
                >
                  <span className="w-5 h-5 rounded flex items-center justify-center text-[0.6rem] font-black shrink-0" style={{ background: '#EEF2FF', color: '#6C5CE7' }}>✦</span>
                  All Platforms
                  {platform === 'all' && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#6C5CE7]" />}
                </button>
                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '2px 0' }} />
                {Object.entries(PLATFORM_META).map(([key, pm]) => (
                  <button
                    key={key}
                    onClick={() => { setPlatform(key); setOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg)]"
                    style={{ color: platform === key ? pm.color : 'var(--text)', fontWeight: platform === key ? 600 : 400 }}
                  >
                    <span className="w-5 h-5 rounded flex items-center justify-center shrink-0" style={{ background: pm.bg }}>
                      <pm.Icon size={11} style={{ color: pm.color }} />
                    </span>
                    {pm.label}
                    {platform === key && <span className="ml-auto w-1.5 h-1.5 rounded-full shrink-0" style={{ background: pm.color }} />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <Link href="/tasks/create"
          className="ml-auto shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] transition-colors whitespace-nowrap">
           Create Task
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card rounded-2xl overflow-hidden flex flex-col animate-pulse">
              <div className="h-1 w-full" style={{ background: 'var(--border-subtle)' }} />
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl shrink-0" style={{ background: 'var(--border-subtle)' }} />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-3.5 rounded w-36" style={{ background: 'var(--border-subtle)' }} />
                    <div className="h-3 rounded w-20" style={{ background: 'var(--border-subtle)' }} />
                  </div>
                </div>
                <div className="h-3 rounded w-full" style={{ background: 'var(--border-subtle)' }} />
                <div className="h-1.5 rounded-full w-full" style={{ background: 'var(--border-subtle)' }} />
                <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div className="h-6 rounded w-16" style={{ background: 'var(--border-subtle)' }} />
                  <div className="h-8 rounded-xl w-24" style={{ background: 'var(--border-subtle)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect width="64" height="64" rx="16" fill="#EEF2FF"/>
            <path d="M16 48 L16 24 L32 14 L48 24 L48 48 Z" stroke="#6C5CE7" strokeWidth="1.5" strokeLinejoin="round" fill="#F5F3FF"/>
            <rect x="24" y="34" width="16" height="14" rx="2" stroke="#6C5CE7" strokeWidth="1.5" fill="white"/>
            <path d="M20 26 L32 18 L44 26" stroke="#A29BFE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="text-center">
            <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>No tasks found</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Try a different platform filter</p>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => {
            const pm   = PLATFORM_META[c.platform] || PLATFORM_META.other;
            const diff = DIFF_COLORS[c.difficulty]  || DIFF_COLORS.easy;
            const prog = c.progress_percentage ?? Math.round(((c.filled_slots || 0) / (c.total_slots || 1)) * 100);
            return (
              <div key={c.id}
                className="card rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
                <div className="h-1 w-full shrink-0" style={{ background: pm.color }} />
                <div className="p-5 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: pm.bg, color: pm.color }}>
                        <pm.Icon size={22} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-sm leading-tight truncate" style={{ color: 'var(--text)' }}>{c.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{pm.label}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0 capitalize" style={{ background: diff.bg, color: diff.color }}>
                      {c.difficulty}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.description}</p>

                  <span className="text-[0.6rem] font-semibold px-2 py-0.5 rounded-full w-fit" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                    ~{c.difficulty === 'hard' ? '10' : c.difficulty === 'medium' ? '5' : '2'} min
                  </span>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                      <span>{c.filled_slots || 0} / {c.total_slots} slots</span>
                      <span>{prog}%</span>
                    </div>
                    <div className="progress-track">
                      <motion.div className="progress-fill" initial={{ width: 0 }}
                        animate={{ width: `${prog}%` }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 mt-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reward</p>
                      <p className="font-black text-xl" style={{ color: '#6C5CE7', letterSpacing: '-0.02em' }}>
                        ₦{parseFloat(c.reward_per_task).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <Link href={`/tasks/${c.slug || c.id}`}
                      className="bg-[#6C5CE7] hover:bg-[#5A4BD1] px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition-colors">
                      Start Task <ArrowRight size={12} />
                    </Link>
                  </div>
                  {c.creator && (
                    <Link href={`/u/${c.creator.username || 'user-' + c.creator.id}`}
                      className="flex items-center gap-1.5 pt-2 no-underline group"
                      style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center text-white text-[0.55rem] font-black shrink-0"
                        style={{ background: '#6C5CE7' }}>
                        {c.creator.avatar
                          ? <img src={c.creator.avatar} alt={c.creator.name} className="w-full h-full object-cover" />
                          : c.creator.name?.[0]}
                      </div>
                      <p className="text-[0.65rem] truncate group-hover:underline" style={{ color: 'var(--text-muted)' }}>
                        by {c.creator.name}
                      </p>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load more */}
      {!loading && hasMore && filtered.length > 0 && (
        <div className="flex justify-center mt-2">
          <button onClick={loadMore} disabled={loadingMore}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 hover:bg-[var(--primary-muted)]"
            style={{ border: '1.5px solid var(--border)', color: 'var(--text-secondary)' }}>
            {loadingMore
              ? <><span className="w-4 h-4 rounded-full border-2 border-[#6C5CE7] border-t-transparent animate-spin" /> Loading…</>
              : 'Load more tasks'}
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
