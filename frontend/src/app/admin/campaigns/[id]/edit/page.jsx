'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet, apiPut } from '@/lib/api';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const EMPTY = {
  title: '',
  description: '',
  platform: 'instagram',
  difficulty: 'easy',
  reward_per_task: '',
  total_slots: '',
  status: 'active',
  instructions: '',
};

function StyledInput({ value, onChange, type = 'text', placeholder, as = 'input', rows, disabled }) {
  const sharedStyle = {
    background: disabled ? 'var(--bg)' : 'var(--surface)',
    border: '1.5px solid var(--border)',
    color: 'var(--text)',
    opacity: disabled ? 0.6 : 1,
  };
  const sharedClass = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none';
  const handlers = disabled
    ? {}
    : {
        onFocus: e => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'; },
        onBlur:  e => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none'; },
      };

  if (as === 'textarea') {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={sharedClass}
        style={{ ...sharedStyle, resize: 'none' }}
        {...handlers}
      />
    );
  }
  return (
    <input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      className={sharedClass}
      style={sharedStyle}
      {...handlers}
    />
  );
}

function StyledSelect({ value, onChange, children, disabled }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
      style={{
        background: disabled ? 'var(--bg)' : 'var(--surface)',
        border: '1.5px solid var(--border)',
        color: 'var(--text)',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {children}
    </select>
  );
}

export default function EditCampaignPage() {
  const router = useRouter();
  const { id }  = useParams();

  const [form,    setForm]    = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch campaign on mount
  useEffect(() => {
    if (!id) return;
    apiGet(`/campaigns/${id}`)
      .then(d => {
        const c = d?.campaign || d?.data || d;
        setForm({
          title:           c.title           ?? '',
          description:     c.description     ?? '',
          platform:        c.platform        ?? 'other',
          difficulty:      c.difficulty      ?? 'easy',
          // Stringify numbers so controlled inputs work correctly
          reward_per_task: String(c.reward_per_task ?? ''),
          total_slots:     String(c.total_slots     ?? ''),
          status:          c.status          ?? 'active',
          instructions:    c.instructions    ?? '',
        });
      })
      .catch(() => setError('Failed to load campaign.'))
      .finally(() => setLoading(false));
  }, [id]);

  function field(key) {
    return {
      value: form[key] ?? '',
      onChange: e => setForm(p => ({ ...p, [key]: e.target.value })),
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.reward_per_task || !form.total_slots) {
      setError('Title, reward, and slots are required.');
      return;
    }
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      reward_per_task: parseFloat(form.reward_per_task),
      total_slots:     parseInt(form.total_slots, 10),
    };
    try {
      await apiPut(`/admin/campaigns/${id}`, payload);
      setSuccess(true);
      setTimeout(() => router.push('/admin/campaigns'), 1200);
    } catch (err) {
      setError(err.message || 'Failed to update campaign.');
      setSaving(false);
    }
  }

  return (
    <DashboardLayout title="Edit Campaign" subtitle="Update the campaign details below" adminOnly>
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {/* Back link */}
        <Link
          href="/admin/campaigns"
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:opacity-70 transition-opacity w-fit"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={14} strokeWidth={2} /> Back to Campaigns
        </Link>

        {/* Loading skeleton */}
        {loading ? (
          <div className="card rounded-2xl flex items-center justify-center py-16">
            <div className="w-7 h-7 rounded-full border-[3px] animate-spin"
              style={{ borderColor: 'var(--border-subtle)', borderTopColor: '#6C5CE7' }} />
          </div>
        ) : (
          <div className="card rounded-2xl p-6">

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-5"
                style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
                <AlertCircle size={15} className="shrink-0" strokeWidth={2} /> {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-5"
                style={{ background: '#D4F6EE', color: '#00875A', border: '1px solid #A3E6CB' }}>
                <CheckCircle2 size={15} className="shrink-0" strokeWidth={2} /> Campaign updated — redirecting…
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">

              {/* Title */}
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                  Campaign Title <span style={{ color: '#C0392B' }}>*</span>
                </label>
                <StyledInput placeholder="e.g. Instagram Post Engagement" {...field('title')} disabled={saving || success} />
              </div>

              {/* Platform */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Platform</label>
                <StyledSelect {...field('platform')} disabled={saving || success}>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="other">Other</option>
                </StyledSelect>
              </div>

              {/* Difficulty */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Difficulty</label>
                <StyledSelect {...field('difficulty')} disabled={saving || success}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </StyledSelect>
              </div>

              {/* Reward */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                  Reward per Task (₦) <span style={{ color: '#C0392B' }}>*</span>
                </label>
                <StyledInput type="number" placeholder="3.00" {...field('reward_per_task')} disabled={saving || success} />
              </div>

              {/* Total Slots */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                  Total Slots <span style={{ color: '#C0392B' }}>*</span>
                </label>
                <StyledInput type="number" placeholder="100" {...field('total_slots')} disabled={saving || success} />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Status</label>
                <StyledSelect {...field('status')} disabled={saving || success}>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Completed</option>
                </StyledSelect>
              </div>

              {/* Description */}
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Description</label>
                <StyledInput placeholder="Short description shown to earners" {...field('description')} disabled={saving || success} />
              </div>

              {/* Instructions */}
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Instructions</label>
                <StyledInput
                  as="textarea"
                  rows={5}
                  placeholder="Step-by-step instructions for earners…"
                  {...field('instructions')}
                  disabled={saving || success}
                />
              </div>

              {/* Actions */}
              <div className="sm:col-span-2 flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving || success}
                  className="bg-[#6C5CE7] hover:bg-[#5A4BD1] px-6 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 transition-colors flex items-center gap-2"
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {saving ? 'Saving…' : 'Update Campaign'}
                </button>
                <Link
                  href="/admin/campaigns"
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
