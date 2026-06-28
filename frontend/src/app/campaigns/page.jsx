'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { Smartphone, ArrowRight, ChevronDown } from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';

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

const MOCK = [
  { id: 1, title: 'Instagram Post Engagement', description: 'Like and comment on Instagram post',   platform: 'instagram', reward_per_task: 3.00, total_slots: 100, filled_slots: 50, difficulty: 'easy',   progress_percentage: 50 },
  { id: 2, title: 'TikTok Video Promotion',    description: 'Watch and like TikTok video',          platform: 'tiktok',    reward_per_task: 4.00, total_slots: 50,  filled_slots: 20, difficulty: 'easy',   progress_percentage: 40 },
  { id: 3, title: 'YouTube Channel Boost',     description: 'Subscribe and watch full video',       platform: 'youtube',   reward_per_task: 4.00, total_slots: 30,  filled_slots: 10, difficulty: 'medium', progress_percentage: 33 },
  { id: 4, title: 'Twitter Post Engagement',   description: 'Retweet and like the post',            platform: 'twitter',   reward_per_task: 2.50, total_slots: 25,  filled_slots: 15, difficulty: 'easy',   progress_percentage: 60 },
  { id: 5, title: 'Facebook Page Like',        description: 'Like Facebook page and stay active',   platform: 'facebook',  reward_per_task: 2.50, total_slots: 50,  filled_slots: 25, difficulty: 'easy',   progress_percentage: 50 },
  { id: 6, title: 'Download App & Review',     description: 'Download app and leave 5-star review', platform: 'other',     reward_per_task: 3.80, total_slots: 200, filled_slots: 0,  difficulty: 'hard',   progress_percentage: 0  },
];

export default function TasksPage() {
  const [campaigns, setCampaigns] = useState(MOCK);
  const [platform,  setPlatform]  = useState('all');
  const [open, setOpen] = useState(false);

  const selectedPM = PLATFORM_META[platform];

  const load = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (platform !== 'all') params.set('platform', platform);
      const data = await apiGet(`/campaigns?${params}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      if (data?.data?.length) setCampaigns(data.data);
    } catch { /* keep mock */ }
  }, [platform]);

  useEffect(() => { load(); }, [load]);

  const filtered = campaigns.filter(c => platform === 'all' || c.platform === platform);

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

        <Link href="/campaigns/create"
          className="ml-auto shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] transition-colors whitespace-nowrap">
           Create Task
        </Link>
      </div>

      {/* Grid */}
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

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    <span>{c.filled_slots || 0} / {c.total_slots} slots</span>
                    <span>{prog}%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${prog}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 mt-auto" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reward</p>
                    <p className="font-black text-xl" style={{ color: '#6C5CE7', letterSpacing: '-0.02em' }}>
                      ${parseFloat(c.reward_per_task).toFixed(2)}
                    </p>
                  </div>
                  <Link href={`/campaigns/${c.id}`}
                    className="bg-[#6C5CE7] hover:bg-[#5A4BD1] px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition-colors">
                    Start Task <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
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
      )}
    </DashboardLayout>
  );
}
