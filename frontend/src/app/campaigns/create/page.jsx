'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { apiPost } from '@/lib/api';
import { getToken } from '@/lib/auth';
import {
  ArrowLeft, Megaphone, DollarSign, Users, FileText,
  CheckCircle2, AlertCircle, ChevronDown,
} from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';
import { Smartphone } from 'lucide-react';

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', Icon: FaInstagram, color: '#C13584', bg: '#FFE8F4' },
  { value: 'tiktok',    label: 'TikTok',    Icon: FaTiktok,    color: '#111',    bg: '#F0F0F0' },
  { value: 'youtube',   label: 'YouTube',   Icon: FaYoutube,   color: '#FF0000', bg: '#FFE8E8' },
  { value: 'twitter',   label: 'Twitter',   Icon: FaXTwitter,  color: '#1DA1F2', bg: '#E8F5FF' },
  { value: 'facebook',  label: 'Facebook',  Icon: FaFacebook,  color: '#1877F2', bg: '#E8EFFF' },
  { value: 'other',     label: 'Other',     Icon: Smartphone,  color: '#6C5CE7', bg: '#F0EEFF' },
];

const DIFFICULTIES = [
  { value: 'easy',   label: 'Easy',   desc: 'Simple actions like liking or following',      color: '#00875A', bg: '#D4F6EE' },
  { value: 'medium', label: 'Medium', desc: 'Actions requiring more effort like comments',  color: '#B45309', bg: '#FFF3D6' },
  { value: 'hard',   label: 'Hard',   desc: 'Complex tasks like reviews or registrations',  color: '#C0392B', bg: '#FFE0E0' },
];

function Field({ label, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</label>
      {children}
      {hint && !error && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
      {error && (
        <p className="text-xs font-semibold flex items-center gap-1" style={{ color: '#C0392B' }}>
          <AlertCircle size={11} strokeWidth={2.5} /> {error}
        </p>
      )}
    </div>
  );
}

function StyledInput({ value, onChange, type = 'text', placeholder, min, step }) {
  return (
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder} min={min} step={step}
      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
      style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
      onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
    />
  );
}

function StyledTextarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value} onChange={onChange}
      placeholder={placeholder} rows={rows}
      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all resize-none"
      style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
      onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
      onBlur={e => (e.target.style.borderColor = 'var(--border)')}
    />
  );
}

const EMPTY = {
  title: '', description: '', platform: '', difficulty: 'easy',
  reward_per_task: '', total_slots: '', instructions: '', proof_requirements: '',
};

export default function CreateCampaignPage() {
  const router = useRouter();
  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState('');
  const [done, setDone]     = useState(false);

  function set(key) {
    return e => {
      setForm(p => ({ ...p, [key]: e.target.value }));
      if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
      if (serverError) setServerError('');
    };
  }

  function validate() {
    const n = {};
    if (!form.title.trim())       n.title       = 'Title is required.';
    if (!form.platform)           n.platform    = 'Select a platform.';
    if (!form.description.trim()) n.description = 'Description is required.';
    if (!form.instructions.trim())n.instructions= 'Instructions are required.';
    if (!form.reward_per_task || parseFloat(form.reward_per_task) < 0.01)
      n.reward_per_task = 'Enter a valid reward amount.';
    if (!form.total_slots || parseInt(form.total_slots) < 1)
      n.total_slots = 'Enter at least 1 slot.';
    setErrors(n);
    return !Object.keys(n).length;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true); setServerError('');
    try {
      await apiPost('/campaigns', {
        ...form,
        reward_per_task: parseFloat(form.reward_per_task),
        total_slots:     parseInt(form.total_slots),
      }, { headers: { Authorization: `Bearer ${getToken()}` } });
      setDone(true);
    } catch (err) {
      setServerError(err.message || 'Failed to create campaign. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (done) {
    return (
      <DashboardLayout title="Create Campaign">
        <div className="max-w-lg mx-auto">
          <div className="card rounded-2xl p-10 flex flex-col items-center text-center gap-4">
            <span className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#D4F6EE', color: '#00875A' }}>
              <CheckCircle2 size={32} strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="font-black text-xl" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>Campaign submitted!</h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Your campaign is under review and will go live once approved. You&apos;ll be notified by email.
              </p>
            </div>
            <div className="flex gap-3 mt-2">
              <Link href="/campaigns"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#6C5CE7] text-white hover:bg-[#5A4BD1] transition-colors">
                Browse Campaigns
              </Link>
              <button
                onClick={() => { setForm(EMPTY); setDone(false); }}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--border)] hover:bg-[var(--bg)] transition-colors"
                style={{ color: 'var(--text-secondary)' }}>
                Create Another
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Create Campaign" subtitle="Post a campaign and get tasks completed">
      <div className="max-w-2xl mx-auto">

        <Link href="/campaigns" className="inline-flex items-center gap-1.5 text-sm font-medium mb-5 hover:opacity-70 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
          <ArrowLeft size={14} strokeWidth={2} /> Back to Campaigns
        </Link>

        {serverError && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-5" style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
            <AlertCircle size={15} strokeWidth={2.2} className="shrink-0" /> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

          {/* ── Basic info ── */}
          <div className="card rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
                <Megaphone size={15} strokeWidth={2} />
              </span>
              <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Campaign Details</h2>
            </div>

            <Field label="Campaign Title *" error={errors.title}>
              <StyledInput
                value={form.title} onChange={set('title')}
                placeholder="e.g. Follow our Instagram page and like recent posts"
              />
            </Field>

            <Field label="Short Description *" hint="Shown on the campaign card — keep it under 100 characters." error={errors.description}>
              <StyledInput
                value={form.description} onChange={set('description')}
                placeholder="e.g. Like and comment on our Instagram post"
              />
            </Field>

            <Field label="Full Instructions *" hint="Step-by-step guide for earners on how to complete this task." error={errors.instructions}>
              <StyledTextarea
                value={form.instructions} onChange={set('instructions')}
                placeholder="1. Go to our Instagram profile @example&#10;2. Follow the account&#10;3. Like the pinned post&#10;4. Screenshot and submit as proof"
                rows={5}
              />
            </Field>

            <Field label="Proof Requirements" hint="What should earners submit as proof of completion?">
              <StyledTextarea
                value={form.proof_requirements} onChange={set('proof_requirements')}
                placeholder="e.g. Screenshot showing you followed the account and liked the post"
                rows={2}
              />
            </Field>
          </div>

          {/* ── Platform ── */}
          <div className="card rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Platform</h2>
            {errors.platform && (
              <p className="text-xs font-semibold flex items-center gap-1 -mt-2" style={{ color: '#C0392B' }}>
                <AlertCircle size={11} strokeWidth={2.5} /> {errors.platform}
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATFORMS.map(p => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => { setForm(f => ({ ...f, platform: p.value })); setErrors(e => ({ ...e, platform: '' })); }}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all text-left"
                  style={form.platform === p.value
                    ? { borderColor: p.color, background: p.bg, color: p.color }
                    : { borderColor: 'var(--border)', color: 'var(--text-secondary)' }
                  }
                >
                  <p.Icon size={18} className="shrink-0" />
                  <span className="text-sm font-semibold">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Difficulty ── */}
          <div className="card rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Difficulty Level</h2>
            <div className="flex flex-col gap-2">
              {DIFFICULTIES.map(d => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, difficulty: d.value }))}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left"
                  style={form.difficulty === d.value
                    ? { borderColor: d.color, background: d.bg }
                    : { borderColor: 'var(--border)' }
                  }
                >
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0" style={{ background: d.bg, color: d.color }}>
                    {d.label}
                  </span>
                  <span className="text-sm" style={{ color: form.difficulty === d.value ? d.color : 'var(--text-secondary)' }}>
                    {d.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Budget ── */}
          <div className="card rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2.5 mb-1">
              <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#D4F6EE', color: '#00875A' }}>
                <DollarSign size={15} strokeWidth={2} />
              </span>
              <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Budget</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Reward per Task ($) *" hint="Amount each earner receives per completion." error={errors.reward_per_task}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: 'var(--text-muted)' }}>$</span>
                  <input
                    type="number" min="0.01" step="0.01"
                    value={form.reward_per_task} onChange={set('reward_per_task')}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                    onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>
              </Field>

              <Field label="Total Slots *" hint="How many earners can complete this task." error={errors.total_slots}>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 shrink-0" style={{ color: 'var(--text-muted)' }}>
                    <Users size={14} strokeWidth={2} />
                  </span>
                  <input
                    type="number" min="1" step="1"
                    value={form.total_slots} onChange={set('total_slots')}
                    placeholder="100"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
                    onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
                    onBlur={e => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>
              </Field>
            </div>

            {/* Budget summary */}
            {form.reward_per_task && form.total_slots && (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                <span className="text-sm font-medium" style={{ color: '#6C5CE7' }}>Estimated total budget</span>
                <span className="font-black text-lg" style={{ color: '#6C5CE7', letterSpacing: '-0.02em' }}>
                  ${(parseFloat(form.reward_per_task || 0) * parseInt(form.total_slots || 0)).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* ── Submit ── */}
          <div className="flex items-center gap-3 pb-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl text-white font-bold text-sm bg-[#6C5CE7] hover:bg-[#5A4BD1] disabled:opacity-60 transition-colors"
            >
              {saving ? 'Submitting…' : 'Submit Campaign for Review'}
            </button>
            <Link href="/campaigns"
              className="px-6 py-3 rounded-xl text-sm font-semibold border border-[var(--border)] hover:bg-[var(--bg)] transition-colors"
              style={{ color: 'var(--text-secondary)' }}>
              Cancel
            </Link>
          </div>

        </form>
      </div>
    </DashboardLayout>
  );
}
