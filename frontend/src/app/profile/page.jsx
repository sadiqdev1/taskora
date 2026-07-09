'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import {
  CheckCircle2, Star, Users, TrendingUp, Globe, CalendarDays,
  ShieldCheck, Pencil, Upload, AlertCircle, X, Copy, Check,
} from 'lucide-react';
import {
  FaTwitter, FaInstagram, FaTiktok, FaYoutube, FaFacebook,
} from 'react-icons/fa6';

function fmtNGN(n) {
  const v = parseFloat(n || 0);
  if (v >= 1_000_000) return '₦' + (v / 1_000_000).toFixed(1) + 'M';
  if (v >= 1_000)     return '₦' + (v / 1_000).toFixed(1) + 'K';
  return '₦' + v.toLocaleString('en-NG', { minimumFractionDigits: 2 });
}

const SOCIAL_META = {
  twitter:   { Icon: FaTwitter,   base: 'https://twitter.com/',   color: '#1DA1F2', label: 'Twitter'   },
  instagram: { Icon: FaInstagram, base: 'https://instagram.com/', color: '#C13584', label: 'Instagram' },
  tiktok:    { Icon: FaTiktok,    base: 'https://tiktok.com/@',   color: '#333',    label: 'TikTok'    },
  youtube:   { Icon: FaYoutube,   base: 'https://youtube.com/@',  color: '#FF0000', label: 'YouTube'   },
  facebook:  { Icon: FaFacebook,  base: 'https://facebook.com/',  color: '#1877F2', label: 'Facebook'  },
};

/* ── Edit Profile Modal ── */
function EditModal({ profile, onClose, onSaved }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name:     profile?.name      || '',
    username: profile?.username  || '',
    bio:      profile?.bio       || '',
    twitter:  profile?.social?.twitter   || '',
    instagram:profile?.social?.instagram || '',
    tiktok:   profile?.social?.tiktok    || '',
    youtube:  profile?.social?.youtube   || '',
    facebook: profile?.social?.facebook  || '',
    website:  profile?.social?.website   || '',
  });
  const [avatar,  setAvatar]  = useState(null);
  const [preview, setPreview] = useState(profile?.avatar || null);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  // Revoke blob URL when component unmounts or preview changes to prevent memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function setField(k) { return e => setForm(p => ({ ...p, [k]: e.target.value })); }

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    // Revoke previous blob before creating a new one
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setAvatar(f);
    setPreview(URL.createObjectURL(f));
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      if (avatar) fd.append('avatar', avatar);
      const updated = await apiFetch('/profile/update', { method: 'POST', body: fd });
      onSaved(updated);
    } catch (err) {
      setError(err.message || 'Failed to save.');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,12,40,0.65)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '90dvh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0"
          style={{ borderColor: 'var(--border-subtle)' }}>
          <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Edit Profile</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg)] transition-colors"
            style={{ color: 'var(--text-muted)' }}><X size={16} strokeWidth={2} /></button>
        </div>

        <form id="profile-edit-form" onSubmit={save} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
              style={{ background: '#FFF0F0', color: '#C0392B' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center text-white text-xl font-black"
                style={{ background: 'linear-gradient(135deg,#6C5CE7,#7C3AED)' }}>
                {preview ? <img src={preview} alt="av" className="w-full h-full object-cover" /> : form.name?.[0]}
              </div>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center"
                style={{ borderColor: 'var(--border)' }}>
                <Upload size={10} strokeWidth={2.5} style={{ color: '#6C5CE7' }} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Profile Photo</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>JPG, PNG, WEBP · max 2MB</p>
            </div>
          </div>

          {/* Basic fields */}
          {[
            { key: 'name',     label: 'Full Name',  placeholder: 'Your full name' },
            { key: 'username', label: 'Username',   placeholder: 'yourhandle', prefix: '@' },
          ].map(f => (
            <div key={f.key} className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{f.label}</label>
              <div className="relative">
                {f.prefix && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: 'var(--text-muted)' }}>{f.prefix}</span>}
                <input value={form[f.key]} onChange={setField(f.key)} placeholder={f.placeholder}
                  className="w-full py-2.5 rounded-xl text-sm outline-none"
                  style={{ paddingLeft: f.prefix ? 28 : 14, paddingRight: 14, background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
                  onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Bio</label>
            <textarea value={form.bio} onChange={setField('bio')} placeholder="Tell people about yourself…"
              rows={2} maxLength={500}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)', resize: 'none' }}
              onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>

          {/* Social links */}
          <p className="text-xs font-bold uppercase tracking-widest pt-1" style={{ color: 'var(--text-muted)' }}>Social Links</p>
          {Object.entries(SOCIAL_META).map(([key, meta]) => (
            <div key={key} className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'var(--bg)', border: '1px solid var(--border-subtle)', color: meta.color }}>
                <meta.Icon size={14} />
              </span>
              <input value={form[key]} onChange={setField(key)} placeholder={`${meta.label} handle`}
                className="flex-1 py-2 rounded-xl text-sm outline-none"
                style={{ paddingLeft: 14, paddingRight: 14, background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Website</label>
            <input value={form.website} onChange={setField('website')} placeholder="https://yoursite.com" type="url"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
              onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t shrink-0 flex gap-3" style={{ borderColor: 'var(--border-subtle)' }}>
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-[var(--bg)]"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>Cancel</button>
          <button type="submit" form="profile-edit-form" disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
            {saving && <span className="btn-spinner" />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Profile Page ── */
export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [copied,   setCopied]   = useState(false);

  useEffect(() => {
    apiFetch('/profile/me')
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleSaved(updated) {
    setProfile(updated);
    if (updated?.name) setUser(p => ({ ...p, name: updated.name, avatar: updated.avatar, username: updated.username }));
    setShowEdit(false);
  }

  function copyLink() {
    const slug = profile?.username || ('user-' + user?.id);
    const url  = `${window.location.origin}/u/${slug}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => fallbackCopy(url));
    } else {
      fallbackCopy(url);
    }
  }

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

  const p = profile;
  const socialLinks = p ? Object.entries(SOCIAL_META).filter(([k]) => p.social?.[k]) : [];
  const initials = p?.display_name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || user?.name?.[0]?.toUpperCase() || '?';

  return (
    <DashboardLayout title="Profile" subtitle="Your public profile">
      {showEdit && <EditModal profile={p} onClose={() => setShowEdit(false)} onSaved={handleSaved} />}

      <div className="max-w-2xl mx-auto flex flex-col gap-5">
        {loading ? (
          <div className="card rounded-2xl overflow-hidden animate-pulse">
            <div className="h-28" style={{ background: 'var(--border-subtle)' }} />
            <div className="pt-14 px-6 pb-6 flex flex-col gap-3">
              <div className="h-5 w-40 rounded" style={{ background: 'var(--border-subtle)' }} />
              <div className="h-3 w-64 rounded" style={{ background: 'var(--border-subtle)' }} />
            </div>
          </div>
        ) : (
          <>
            {/* ── Profile card ── */}
            <div className="card rounded-2xl overflow-hidden">
              {/* Cover */}
              <div className="h-28 relative"
                style={{ background: 'linear-gradient(135deg, #6C5CE7 0%, #7C3AED 100%)' }}>
                <div className="absolute -bottom-10 left-6">
                  <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden flex items-center justify-center text-white text-2xl font-black"
                    style={{ background: 'linear-gradient(135deg,#6C5CE7,#7C3AED)', boxShadow: '0 4px 16px rgba(108,92,231,0.4)' }}>
                    {p?.avatar
                      ? <img src={p.avatar} alt={p.display_name} className="w-full h-full object-cover" />
                      : initials}
                  </div>
                </div>
                {/* Edit + Share buttons in cover */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button onClick={copyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                    style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
                    {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Share</>}
                  </button>
                  <button onClick={() => setShowEdit(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
                    style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <Pencil size={11} /> Edit
                  </button>
                </div>
              </div>

              <div className="pt-14 px-6 pb-6 flex flex-col gap-4">
                {/* Name row */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-black text-xl tracking-tight" style={{ color: 'var(--text)' }}>
                      {p?.display_name || user?.name}
                    </h1>
                    {p?.is_verified && (
                      <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
                        <ShieldCheck size={11} strokeWidth={2.5} /> Verified
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
                      💼 Earner
                    </span>
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    @{p?.username || ('user-' + user?.id)}
                  </p>
                </div>

                {/* Bio */}
                {p?.bio ? (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.bio}</p>
                ) : (
                  <button onClick={() => setShowEdit(true)} className="text-sm text-left hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    + Add a bio
                  </button>
                )}

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} strokeWidth={2} /> Joined {p?.member_since || 'recently'}
                  </span>
                </div>

                {/* Social links */}
                {socialLinks.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {socialLinks.map(([key, meta]) => (
                      <a key={key}
                        href={`${meta.base}${p.social[key]}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                        style={{ background: 'var(--bg)', color: meta.color, border: '1px solid var(--border-subtle)' }}>
                        <meta.Icon size={12} /> {p.social[key]}
                      </a>
                    ))}
                    {p?.social?.website && (
                      <a href={p.social.website} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-opacity hover:opacity-80"
                        style={{ background: 'var(--bg)', color: '#6C5CE7', border: '1px solid var(--border-subtle)' }}>
                        <Globe size={12} /> Website
                      </a>
                    )}
                  </div>
                ) : (
                  <button onClick={() => setShowEdit(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-70 transition-opacity w-fit"
                    style={{ color: '#6C5CE7' }}>
                    + Add social links
                  </button>
                )}
              </div>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Tasks Done',   value: p?.stats?.tasks_completed ?? 0,        Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A' },
                { label: 'Total Earned', value: fmtNGN(p?.stats?.total_earnings ?? 0), Icon: TrendingUp,   bg: '#EEF2FF', color: '#6C5CE7' },
                { label: 'Success Rate', value: `${p?.stats?.success_rate ?? 0}%`,     Icon: Star,         bg: '#FFF3D6', color: '#B45309' },
                { label: 'Referrals',    value: p?.stats?.referrals_count ?? 0,        Icon: Users,        bg: '#F0EEFF', color: '#6C5CE7' },
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

            {/* ── View public profile link ── */}
            <Link href={`/u/${p?.username || 'user-' + user?.id}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors no-underline hover:bg-[var(--primary-muted)]"
              style={{ border: '1.5px solid var(--border)', color: '#6C5CE7' }}>
              View public profile →
            </Link>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
