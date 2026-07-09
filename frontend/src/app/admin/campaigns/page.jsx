'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import ConfirmModal from '@/components/ConfirmModal';
import { apiGet, apiPost, apiDel } from '@/lib/api';
import { Smartphone, Pencil, Trash2, Plus } from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';

const PLATFORM_META = {
  instagram: { Icon: FaInstagram, bg: '#FFE8F4', color: '#C13584' },
  tiktok:    { Icon: FaTiktok,    bg: '#F0F0F0', color: '#333333' },
  youtube:   { Icon: FaYoutube,   bg: '#FFE8E8', color: '#FF0000' },
  twitter:   { Icon: FaXTwitter,  bg: '#E8F5FF', color: '#1DA1F2' },
  facebook:  { Icon: FaFacebook,  bg: '#E8EFFF', color: '#1877F2' },
  other:     { Icon: Smartphone,  bg: '#F0EEFF', color: '#6C5CE7' },
};

const DIFF_COLORS   = { easy: { bg: '#D4F6EE', color: '#00875A' }, medium: { bg: '#FFF3D6', color: '#B45309' }, hard: { bg: '#FFE0E0', color: '#C0392B' } };
const STATUS_COLORS = { active: { bg: '#D4F6EE', color: '#00875A' }, paused: { bg: '#FFF3D6', color: '#B45309' }, draft: { bg: '#EEF2FF', color: 'var(--primary)' }, completed: { bg: '#E0F0FF', color: '#0369A1' } };

const EMPTY = { title: '', description: '', platform: 'instagram', reward_per_task: '', total_slots: '', difficulty: 'easy', status: 'active', instructions: '' };

function StyledInput({ value, onChange, type = 'text', placeholder, as = 'input', rows }) {
  const sharedStyle = {
    background: 'var(--bg)',
    border: '1.5px solid var(--border)',
    color: 'var(--text)',
  };
  const sharedClass = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none';
  const handlers = {
    onFocus: e => (e.target.style.borderColor = 'var(--primary)'),
    onBlur:  e => (e.target.style.borderColor = 'var(--border)'),
  };
  if (as === 'textarea') {
    return <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} className={sharedClass} style={{ ...sharedStyle, resize: 'none' }} {...handlers} />;
  }
  return <input value={value} onChange={onChange} type={type} placeholder={placeholder} className={sharedClass} style={sharedStyle} {...handlers} />;
}

function StyledSelect({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
      style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
      {children}
    </select>
  );
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [search,    setSearch]    = useState('');
  const [searchQ,   setSearchQ]   = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null); // { id, title }
  const [deleting,     setDeleting]     = useState(false);
  const [deleteError,  setDeleteError]  = useState('');

  useEffect(() => {
    const t = setTimeout(() => setSearchQ(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const params = searchQ ? `?search=${encodeURIComponent(searchQ)}` : '';
    apiGet(`/admin/campaigns${params}`)
      .then(d => setCampaigns(d?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchQ]);

  function openCreate() { setForm(EMPTY); setShowForm(true); setError(''); }

  function field(key) {
    return { value: form[key] ?? '', onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) };
  }

  async function handleSave(e) {
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
      total_slots:     parseInt(form.total_slots),
    };
    try {
      const created = await apiPost('/admin/campaigns', payload);
      // Only add to list after confirmed server success
      setCampaigns(prev => [created, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError(err.message || 'Failed to create campaign.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');
    try {
      await apiDel(`/admin/campaigns/${deleteTarget.id}`);
      // Only remove from list after confirmed server success
      setCampaigns(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err.message || 'Failed to archive campaign.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <DashboardLayout title="Manage Campaigns" subtitle="Create, edit and control all campaigns" adminOnly>

      {/* Delete confirmation modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Archive campaign?"
        message={`"${deleteTarget?.title}" will be archived and hidden from earners. This can be undone by editing the status.`}
        confirmLabel="Archive"
        confirmColor="#C0392B"
        loading={deleting}
        error={deleteError}
        onConfirm={handleDeleteConfirm}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />

      {/* Toolbar */}
      <div className="flex items-center gap-3 justify-between mb-5">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl flex-1 max-w-xs"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search campaigns…"
            className="flex-1 bg-transparent outline-none text-sm" style={{ color: 'var(--text)' }} />
        </div>
        <button onClick={openCreate}
          className="bg-[#6C5CE7] hover:bg-[#5A4BD1] flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-colors shrink-0">
          <Plus size={16} strokeWidth={2.5} /> New Campaign
        </button>
      </div>

      {/* Inline create form */}
      {showForm && (
        <div className="card rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-sm mb-5" style={{ color: 'var(--text)' }}>New Campaign</h2>
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm mb-4" style={{ background: '#FFF0F0', color: '#C0392B' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Campaign Title *</label>
              <StyledInput placeholder="e.g. Instagram Post Engagement" {...field('title')} />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Platform *</label>
              <StyledSelect {...field('platform')}>
                {Object.entries({ instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter', facebook: 'Facebook', other: 'Other' }).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </StyledSelect>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Difficulty</label>
              <StyledSelect {...field('difficulty')}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </StyledSelect>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Reward per Task (₦) *</label>
              <StyledInput type="number" placeholder="3.00" {...field('reward_per_task')} />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Total Slots *</label>
              <StyledInput type="number" placeholder="100" {...field('total_slots')} />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Status</label>
              <StyledSelect {...field('status')}>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="draft">Draft</option>
              </StyledSelect>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Description</label>
              <StyledInput placeholder="Short description shown to users" {...field('description')} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Instructions</label>
              <StyledInput as="textarea" rows={3} placeholder="Step-by-step instructions for users…" {...field('instructions')} />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-[#6C5CE7] hover:bg-[#5A4BD1] px-6 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 transition-colors flex items-center gap-2">
                {saving && <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
                {saving ? 'Saving…' : 'Create Campaign'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table / Cards */}
      {loading ? (
        <div className="text-center py-10">
          <div className="w-7 h-7 rounded-full border-[3px] animate-spin mx-auto"
            style={{ borderColor: 'var(--border-subtle)', borderTopColor: '#6C5CE7' }} />
        </div>
      ) : (
        <div className="card rounded-2xl overflow-hidden">

          {/* ── Desktop table — hidden on mobile ── */}
          <div className="admin-table-wrap">
          <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Campaign', 'Platform', 'Reward', 'Slots', 'Difficulty', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c, i) => {
                  const pm   = PLATFORM_META[c.platform] || PLATFORM_META.other;
                  const diff = DIFF_COLORS[c.difficulty]  || DIFF_COLORS.easy;
                  const sc   = STATUS_COLORS[c.status]    || STATUS_COLORS.draft;
                  const prog = Math.round(((c.filled_slots || 0) / (c.total_slots || 1)) * 100);
                  return (
                    <tr key={c.id}
                      style={{ borderBottom: i < campaigns.length - 1 ? '1px solid var(--border-subtle)' : undefined }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: pm.bg, color: pm.color }}>
                            <pm.Icon size={17} />
                          </span>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{c.title}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.description || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 capitalize text-sm" style={{ color: 'var(--text-secondary)' }}>{c.platform}</td>
                      <td className="px-5 py-3.5 font-bold text-sm" style={{ color: 'var(--primary)' }}>
                        ₦{parseFloat(c.reward_per_task).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{c.filled_slots}/{c.total_slots}</p>
                        <div className="progress-track mt-1 w-20">
                          <div className="progress-fill" style={{ width: `${prog}%` }} />
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: diff.bg, color: diff.color }}>
                          {c.difficulty}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: sc.bg, color: sc.color }}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/campaigns/${c.slug}/edit`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ background: '#EEF2FF', color: 'var(--primary)' }}>
                            <Pencil size={12} strokeWidth={2.5} /> Edit
                          </Link>
                          <button
                            onClick={() => setDeleteTarget({ id: c.id, title: c.title })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ background: '#FFE0E0', color: '#C0392B' }}>
                            <Trash2 size={12} strokeWidth={2.5} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
          </table>
          </div>

          {/* ── Mobile card list — shown only on mobile ── */}
          <div className="admin-cards-wrap divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {campaigns.map(c => {
              const pm   = PLATFORM_META[c.platform] || PLATFORM_META.other;
              const diff = DIFF_COLORS[c.difficulty]  || DIFF_COLORS.easy;
              const sc   = STATUS_COLORS[c.status]    || STATUS_COLORS.draft;
              const prog = Math.round(((c.filled_slots || 0) / (c.total_slots || 1)) * 100);
              return (
                <div key={c.id} className="p-4 flex flex-col gap-3">
                  {/* Row 1: Platform icon + title + status badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: pm.bg, color: pm.color }}>
                        <pm.Icon size={17} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{c.title}</p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{c.description || '—'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize flex-shrink-0" style={{ background: sc.bg, color: sc.color }}>
                      {c.status}
                    </span>
                  </div>

                  {/* Row 2: Reward + difficulty + slots */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-black text-lg" style={{ color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                      ₦{parseFloat(c.reward_per_task).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: diff.bg, color: diff.color }}>
                      {c.difficulty}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {c.filled_slots}/{c.total_slots} slots
                    </span>
                  </div>

                  {/* Row 3: Progress bar */}
                  <div className="progress-track w-full">
                    <div className="progress-fill" style={{ width: `${prog}%` }} />
                  </div>

                  {/* Row 4: Edit + Delete buttons */}
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/campaigns/${c.slug}/edit`}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold"
                      style={{ background: '#EEF2FF', color: 'var(--primary)' }}>
                      <Pencil size={12} strokeWidth={2.5} /> Edit
                    </Link>
                    <button
                      onClick={() => setDeleteTarget({ id: c.id, title: c.title })}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold"
                      style={{ background: '#FFE0E0', color: '#C0392B' }}>
                      <Trash2 size={12} strokeWidth={2.5} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {campaigns.length === 0 && (
            <div className="text-center py-10 text-sm" style={{ color: 'var(--text-muted)' }}>
              No campaigns yet. Create one above.
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
