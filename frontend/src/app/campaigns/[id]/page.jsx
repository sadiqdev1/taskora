'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet, apiPost } from '@/lib/api';
import { getToken } from '@/lib/auth';
import Link from 'next/link';
import {
  Smartphone, CheckCircle2, ClipboardList, ArrowRight, ArrowLeft, Users, Clock,
} from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';

const PLATFORM_META = {
  instagram: { Icon: FaInstagram, bg: '#FFE8F4', color: '#C13584', label: 'Instagram' },
  tiktok:    { Icon: FaTiktok,    bg: '#F0F0F0', color: '#333333', label: 'TikTok'    },
  youtube:   { Icon: FaYoutube,   bg: '#FFE8E8', color: '#FF0000', label: 'YouTube'   },
  twitter:   { Icon: FaXTwitter,  bg: '#E8F5FF', color: '#1DA1F2', label: 'Twitter'   },
  facebook:  { Icon: FaFacebook,  bg: '#E8EFFF', color: '#1877F2', label: 'Facebook'  },
  other:     { Icon: Smartphone,  bg: '#F0EEFF', color: '#6C5CE7', label: 'Other'     },
};

const DIFF_COLORS = { easy: { bg: '#D4F6EE', color: '#00875A' }, medium: { bg: '#FFF3D6', color: '#B45309' }, hard: { bg: '#FFE0E0', color: '#C0392B' } };

export default function CampaignDetailPage() {
  const { id }    = useParams();
  const [campaign, setCampaign] = useState(null);
  const [proof,   setProof]     = useState('');
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    apiGet(`/campaigns/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(setCampaign).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true); setError('');
    try {
      await apiPost(`/campaigns/${id}/submit`, { proof }, { headers: { Authorization: `Bearer ${getToken()}` } });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally { setSubmitting(false); }
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin w-8 h-8 rounded-full border-4"
          style={{ borderColor: 'var(--primary-muted)', borderTopColor: 'var(--primary)' }} />
      </div>
    </DashboardLayout>
  );

  // Fallback mock
  const c = campaign || {
    id, title: 'Instagram Post Engagement',
    description: 'Like and comment on Instagram post',
    platform: 'instagram', reward_per_task: 3.00,
    total_slots: 100, filled_slots: 50, difficulty: 'easy',
    instructions: 'Visit the post, like it, and leave a genuine comment of at least 5 words. Submit the URL of your comment as proof.',
  };
  const pm   = PLATFORM_META[c.platform] || PLATFORM_META.other;
  const diff = DIFF_COLORS[c.difficulty] || DIFF_COLORS.easy;
  const prog = Math.round(((c.filled_slots || 0) / (c.total_slots || 1)) * 100);

  return (
    <DashboardLayout title="Task Details" subtitle={`${pm.label} task`}>
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {/* Back button */}
        <Link href="/campaigns" className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity w-fit" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={14} strokeWidth={2} /> Back to Tasks
        </Link>

        {/* Campaign header */}
        <div className="card rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-5">
            <span className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: pm.bg, color: pm.color }}>
              <pm.Icon size={28} strokeWidth={1.7} />
            </span>
            <div className="flex-1">
              <h1 className="font-bold text-lg leading-tight" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>{c.title}</h1>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{c.description}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reward</p>
              <p className="font-black text-2xl" style={{ color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                ${parseFloat(c.reward_per_task).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-xl mb-5" style={{ background: 'var(--bg)' }}>
            {[
              ['Difficulty', <span key="d" className="text-xs font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: diff.bg, color: diff.color }}>{c.difficulty || 'easy'}</span>],
              ['Slots Left',  `${(c.total_slots || 0) - (c.filled_slots || 0)} remaining`],
              ['Progress',    `${prog}%`],
            ].map(([label, val]) => (
              <div key={label} className="text-center">
                <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1"><Users size={12} strokeWidth={2} /> {c.filled_slots || 0} completed</span>
              <span>{c.total_slots || 0} total slots</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${prog}%` }} />
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
              <ClipboardList size={14} strokeWidth={2} />
            </span>
            <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Instructions</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {c.instructions || 'Complete the task as described and submit proof of completion.'}
          </p>
        </div>

        {/* Submit proof */}
        <div className="card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#D4F6EE', color: '#00875A' }}>
              <CheckCircle2 size={14} strokeWidth={2} />
            </span>
            <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Submit Your Proof</h2>
          </div>

          {submitted ? (
            <div className="text-center py-8 flex flex-col items-center gap-3">
              <span className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#D4F6EE', color: '#00875A' }}>
                <CheckCircle2 size={32} strokeWidth={1.8} />
              </span>
              <h3 className="font-bold text-lg" style={{ color: 'var(--text)' }}>Submission Received!</h3>
              <p className="text-sm max-w-xs text-center" style={{ color: 'var(--text-muted)' }}>
                Your submission is under review. You&apos;ll be notified when it&apos;s approved.
              </p>
              <Link href="/campaigns"
                className="bg-[#6C5CE7] hover:bg-[#5A4BD1] flex items-center gap-2 mt-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-colors">
                Browse More Tasks <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div className="px-4 py-3 rounded-xl text-sm" style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
                  {error}
                </div>
              )}
              <div>
                <label className="text-xs font-semibold block mb-2" style={{ color: 'var(--text)' }}>
                  Proof of completion (URL, screenshot link, or description)
                </label>
                <textarea value={proof} onChange={e => setProof(e.target.value)} rows={4}
                  placeholder="Paste a link to your screenshot or describe what you did…"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => (e.target.style.borderColor = 'var(--primary)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
              <button type="submit" disabled={submitting}
                className="bg-[#6C5CE7] hover:bg-[#5A4BD1] w-full py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {submitting && <span className="btn-spinner" />}
                {submitting ? 'Submitting…' : 'Submit for Review'}
              </button>
              <p className="text-xs text-center flex items-center justify-center gap-1" style={{ color: 'var(--text-muted)' }}>
                <Clock size={11} strokeWidth={2} /> Reviews are processed within 24 hours
              </p>
            </form>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
