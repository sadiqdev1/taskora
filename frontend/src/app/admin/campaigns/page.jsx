'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet, apiPut, apiPost, apiDel } from '@/lib/api';
import { getToken } from '@/lib/auth';
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

const DIFF_COLORS = { easy: { bg: '#D4F6EE', color: '#00875A' }, medium: { bg: '#FFF3D6', color: '#B45309' }, hard: { bg: '#FFE0E0', color: '#C0392B' } };
const STATUS_COLORS = { active: { bg: '#D4F6EE', color: '#00875A' }, paused: { bg: '#FFF3D6', color: '#B45309' }, draft: { bg: '#EEF2FF', color: 'var(--primary)' }, completed: { bg: '#E0F0FF', color: '#0369A1' } };

const MOCK = [
  { id: 1, title: 'Instagram Post Engagement', platform: 'instagram', reward_per_task: 3.00, total_slots: 100, filled_slots: 50,  difficulty: 'easy',   status: 'active',    description: 'Like and comment on Instagram post' },
  { id: 2, title: 'TikTok Video Promotion',    platform: 'tiktok',    reward_per_task: 4.00, total_slots: 50,  filled_slots: 20,  difficulty: 'easy',   status: 'active',    description: 'Watch and like TikTok video' },
  { id: 3, title: 'YouTube Channel Boost',     platform: 'youtube',   reward_per_task: 4.00, total_slots: 30,  filled_slots: 10,  difficulty: 'medium', status: 'active',    description: 'Subscribe and watch full video' },
  { id: 4, title: 'Twitter Post Engagement',   platform: 'twitter',   reward_per_task: 2.50, total_slots: 25,  filled_slots: 15,  difficulty: 'easy',   status: 'paused',    description: 'Retweet and like the post' },
  { id: 5, title: 'Facebook Page Like',        platform: 'facebook',  reward_per_task: 2.50, total_slots: 50,  filled_slots: 25,  difficulty: 'easy',   status: 'active',    description: 'Like page and stay active' },
  { id: 6, title: 'Download App & Review',     platform: 'other',     reward_per_task: 3.80, total_slots: 200, filled_slots: 0,   difficulty: 'hard',   status: 'draft',     description: 'Download app and leave 5-star review' },
];

const EMPTY = { title: '', description: '', platform: 'instagram', reward_per_task: '', total_slots: '', difficulty: 'easy', status: 'active', instructions: '' };

function StyledInput({ value, onChange, type = 'text', placeholder, as = 'input', rows }) {
  const props = {
    value, onChange, type, placeholder,
    className: 'w-full px-4 py-2.5 rounded-xl text-sm outline-none',
    style: { background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' },
    onFocus: e => (e.target.style.borderColor = 'var(--primary)'),
    onBlur:  e => (e.target.style.borderColor = 'var(--border)'),
  };
  if (as === 'textarea') return <textarea {...props} rows={rows} style={{ ...props.style, resize: 'none' }} />;
  return <input {...props} />;
}

function StyledSelect({ value, onChange, children }) {
  return (
    <select value={value} onChange={onChange}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
      style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}>
      {children}
    </select>
  );
}

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState(MOCK);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(null);
  const [error, setError]         = useState('');

  useEffect(() => {
    apiGet('/admin/campaigns', { headers: { Authorization: `Bearer ${getToken()}` } })
      .then(d => { if (d?.data?.length) setCampaigns(d.data); }).catch(() => {});
  }, []);

  function openCreate() { setEditing(null); setForm(EMPTY); setShowForm(true); setError(''); }
  function openEdit(c)  { setEditing(c.id); setForm({ ...c }); setShowForm(true); setError(''); }

  function field(key) {
    return { value: form[key] ?? '', onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) };
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title || !form.reward_per_task || !form.total_slots) { setError('Title, reward, and slots are required.'); return; }
    setSaving(true); setError('');
    const payload = { ...form, reward_per_task: parseFloat(form.reward_per_task), total_slots: parseInt(form.total_slots) };
    const headers = { Authorization: `Bearer ${getToken()}` };
    try {
      if (editing) {
        await apiPut(`/admin/campaigns/${editing}`, payload, { headers });
        setCampaigns(prev => prev.map(c => c.id === editing ? { ...c, ...payload } : c));
      } else {
        const created = await apiPost('/admin/campaigns', payload, { headers });
        setCampaigns(prev => [created || { ...payload, id: Date.now(), filled_slots: 0 }, ...prev]);
      }
      setShowForm(false);
    } catch {
      if (editing) setCampaigns(prev => prev.map(c => c.id === editing ? { ...c, ...payload } : c));
      else setCampaigns(prev => [{ ...payload, id: Date.now(), filled_slots: 0 }, ...prev]);
      setShowForm(false);
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this campaign?')) return;
    setDeleting(id);
    try { await apiDel(`/admin/campaigns/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } }); } catch {}
    finally { setCampaigns(prev => prev.filter(c => c.id !== id)); setDeleting(null); }
  }

  return (
    <DashboardLayout title="Manage Campaigns" subtitle="Create, edit and control all campaigns" adminOnly>

      <div className="flex items-center justify-end mb-5">
        <button onClick={openCreate}
          className="bg-[#6C5CE7] hover:bg-[#5A4BD1] flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-colors">
          <Plus size={16} strokeWidth={2.5} /> New Campaign
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-sm mb-5" style={{ color: 'var(--text)' }}>
            {editing ? 'Edit Campaign' : 'New Campaign'}
          </h2>
          {error && <div className="px-4 py-3 rounded-xl text-sm mb-4" style={{ background: '#FFF0F0', color: '#C0392B' }}>{error}</div>}
          <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Campaign Title *</label>
              <StyledInput placeholder="e.g. Instagram Post Engagement" {...field('title')} />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Platform *</label>
              <StyledSelect {...field('platform')}>
                {Object.entries({ instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', twitter: 'Twitter', facebook: 'Facebook', other: 'Other' }).map(([v,l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </StyledSelect>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Difficulty</label>
              <StyledSelect {...field('difficulty')}>
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </StyledSelect>
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Reward per Task ($) *</label>
              <StyledInput type="number" placeholder="3.00" {...field('reward_per_task')} />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Total Slots *</label>
              <StyledInput type="number" placeholder="100" {...field('total_slots')} />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--text)' }}>Status</label>
              <StyledSelect {...field('status')}>
                <option value="active">Active</option><option value="paused">Paused</option><option value="draft">Draft</option>
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
                className="bg-[#6C5CE7] hover:bg-[#5A4BD1] px-6 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 transition-colors">
                {saving ? 'Saving…' : editing ? 'Update Campaign' : 'Create Campaign'}
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

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
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
                        <pm.Icon size={17} strokeWidth={1.8} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{c.title}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.description || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 capitalize text-sm" style={{ color: 'var(--text-secondary)' }}>{c.platform}</td>
                  <td className="px-5 py-3.5 font-bold text-sm" style={{ color: 'var(--primary)' }}>${parseFloat(c.reward_per_task).toFixed(2)}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{c.filled_slots}/{c.total_slots}</p>
                    <div className="progress-track mt-1 w-20"><div className="progress-fill" style={{ width: `${prog}%` }} /></div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: diff.bg, color: diff.color }}>{c.difficulty}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize" style={{ background: sc.bg, color: sc.color }}>{c.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(c)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                        style={{ background: '#EEF2FF', color: 'var(--primary)' }}>
                        <Pencil size={12} strokeWidth={2.5} /> Edit
                      </button>
                      <button onClick={() => handleDelete(c.id)} disabled={deleting === c.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
                        style={{ background: '#FFE0E0', color: '#C0392B' }}>
                        <Trash2 size={12} strokeWidth={2.5} />
                        {deleting === c.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
