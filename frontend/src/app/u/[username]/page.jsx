'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { apiGet } from '@/lib/api';
import {
  CheckCircle2, Star, Users, TrendingUp, Globe,
  MapPin, CalendarDays, ShieldCheck, Trophy, Copy, Check, ArrowRight,
} from 'lucide-react';
import {
  FaInstagram, FaTiktok, FaYoutube, FaFacebook, FaXTwitter,
} from 'react-icons/fa6';
import { Smartphone } from 'lucide-react';

function fmtNGN(n) {
  return '₦' + parseFloat(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const SOCIAL_META = {
  twitter:   { Icon: FaXTwitter,  base: 'https://twitter.com/',   color: '#1DA1F2', label: 'Twitter'   },
  instagram: { Icon: FaInstagram, base: 'https://instagram.com/', color: '#C13584', label: 'Instagram' },
  tiktok:    { Icon: FaTiktok,    base: 'https://tiktok.com/@',   color: '#333333', label: 'TikTok'    },
  youtube:   { Icon: FaYoutube,   base: 'https://youtube.com/@',  color: '#FF0000', label: 'YouTube'   },
  facebook:  { Icon: FaFacebook,  base: 'https://facebook.com/',  color: '#1877F2', label: 'Facebook'  },
};

export default function PublicProfilePage() {
  const { username }    = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied,   setCopied]   = useState(false);

  useEffect(() => {
    apiGet(`/users/${username}`)
      .then(setProfile)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  function fallbackCopy(text) {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity  = '0';
    document.body.appendChild(el);
    el.select();
    try { document.execCommand('copy'); } catch {}
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 rounded-full border-4 animate-spin"
          style={{ borderColor: 'var(--border-subtle)', borderTopColor: '#6C5CE7' }} />
      </div>
    </DashboardLayout>
  );

  if (notFound) return (
    <DashboardLayout title="User Not Found">
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: '#EEF2FF' }}>👤</div>
        <p className="text-lg font-bold" style={{ color: 'var(--text)' }}>User not found</p>
        <Link href="/tasks" className="text-sm font-semibold" style={{ color: '#6C5CE7' }}>← Back to Tasks</Link>
      </div>
    </DashboardLayout>
  );

  const initials = profile.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const socialLinks = Object.entries(SOCIAL_META).filter(([key]) => profile.social?.[key]);

  return (
    <DashboardLayout title={`${profile.display_name}'s Profile`}>
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {/* ── Profile card ── */}
        <div className="card rounded-2xl overflow-hidden">
          {/* Cover gradient */}
          <div className="h-28 relative"
            style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #7C3AED 100%)' }}>
            <div className="absolute -bottom-10 left-6">
              <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden flex items-center justify-center text-white text-2xl font-black"
                style={{ background: '#6C5CE7', boxShadow: '0 4px 16px rgba(108,92,231,0.4)' }}>
                {profile.avatar
                  ? <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  : initials}
              </div>
            </div>
          </div>

          <div className="pt-14 px-6 pb-6 flex flex-col gap-4">
            {/* Name + verification */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-black text-xl tracking-tight" style={{ color: 'var(--text)' }}>
                    {profile.display_name}
                  </h1>
                  {profile.is_verified && (
                    <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
                      <ShieldCheck size={11} strokeWidth={2.5} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  @{profile.username}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Role badge */}
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold capitalize shrink-0"
                  style={{ background: profile.role === 'admin' ? '#FFE0E0' : '#EEF2FF',
                           color:      profile.role === 'admin' ? '#C0392B'  : '#6C5CE7' }}>
                  {profile.role === 'admin' ? '⚡ Admin' : '💼 Earner'}
                </span>
                {/* Share */}
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/u/${profile.username}`;
                    if (navigator.clipboard?.writeText) {
                      navigator.clipboard.writeText(url).then(() => {
                        setCopied(true); setTimeout(() => setCopied(false), 2000);
                      }).catch(() => fallbackCopy(url));
                    } else {
                      fallbackCopy(url);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                  style={{ background: copied ? '#D4F6EE' : 'var(--bg)', color: copied ? '#00875A' : 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>
                  {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2} />}
                  {copied ? 'Copied!' : 'Share'}
                </button>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {profile.bio}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1">
                <CalendarDays size={12} strokeWidth={2} /> Joined {profile.member_since}
              </span>
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map(([key, meta]) => (
                  <a key={key}
                    href={`${meta.base}${profile.social[key]}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{ background: 'var(--bg)', color: meta.color, border: '1px solid var(--border-subtle)' }}>
                    <meta.Icon size={13} />
                    {profile.social[key]}
                  </a>
                ))}
                {profile.social?.website && (
                  <a href={profile.social.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{ background: 'var(--bg)', color: '#6C5CE7', border: '1px solid var(--border-subtle)' }}>
                    <Globe size={13} /> Website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Tasks Done',    value: profile.stats.tasks_completed,           Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A' },
            { label: 'Total Earned',  value: fmtNGN(profile.stats.total_earnings),    Icon: TrendingUp,   bg: '#EEF2FF', color: '#6C5CE7' },
            { label: 'Success Rate',  value: `${profile.stats.success_rate}%`,         Icon: Star,         bg: '#FFF3D6', color: '#B45309' },
            { label: 'Referrals',     value: profile.stats.referrals_count,           Icon: Users,        bg: '#F0EEFF', color: '#6C5CE7' },
          ].map(s => (
            <div key={s.label} className="card rounded-2xl p-4 flex flex-col gap-2">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg, color: s.color }}>
                <s.Icon size={17} strokeWidth={1.9} />
              </span>
              <p className="font-black text-xl leading-none" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>{s.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Campaigns created by this user ── */}
        {profile.campaigns?.length > 0 && (
          <div className="card rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Tasks Created</h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
                {profile.campaigns.length}
              </span>
            </div>
            <div className="flex flex-col divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {profile.campaigns.map(c => {
                const PLATFORM_META = {
                  instagram: { Icon: FaInstagram, bg: '#FFE8F4', color: '#C13584' },
                  tiktok:    { Icon: FaTiktok,    bg: '#F0F0F0', color: '#333333' },
                  youtube:   { Icon: FaYoutube,   bg: '#FFE8E8', color: '#FF0000' },
                  twitter:   { Icon: FaXTwitter,  bg: '#E8F5FF', color: '#1DA1F2' },
                  facebook:  { Icon: FaFacebook,  bg: '#E8EFFF', color: '#1877F2' },
                  other:     { Icon: Smartphone,  bg: '#F0EEFF', color: '#6C5CE7' },
                };
                const pm     = PLATFORM_META[c.platform] || PLATFORM_META.other;
                const filled = c.filled_slots || 0;
                const total  = c.total_slots  || 1;
                const prog   = Math.round((filled / total) * 100);
                const isFull = filled >= total;
                const statusLabel = c.status === 'completed' || isFull ? 'Expired' : c.status === 'paused' ? 'Inactive' : c.status;
                const statusStyle = (c.status === 'completed' || isFull)
                  ? { bg: '#F0F0F0', color: '#888' }
                  : c.status === 'active'
                  ? { bg: '#D4F6EE', color: '#00875A' }
                  : { bg: '#FFF3D6', color: '#B45309' };

                return (
                  <div key={c.id} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: pm.bg, color: pm.color }}>
                      <pm.Icon size={16} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{c.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="progress-track w-20 shrink-0" style={{ height: 3 }}>
                          <div className="progress-fill" style={{ width: `${prog}%` }} />
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{filled}/{total} slots</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-sm" style={{ color: '#6C5CE7' }}>
                        ₦{parseFloat(c.reward_per_task).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                        style={{ background: statusStyle.bg, color: statusStyle.color }}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
