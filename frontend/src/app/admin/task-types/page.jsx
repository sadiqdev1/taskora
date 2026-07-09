'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet, apiPatch } from '@/lib/api';
import { Pencil, CheckCircle2, XCircle, AlertCircle, Loader2, Search } from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';
import { Smartphone } from 'lucide-react';

const PLATFORM_COLORS = {
  instagram: '#C13584', tiktok: '#333333', youtube: '#FF0000',
  twitter: '#1DA1F2', facebook: '#1877F2', other: '#6C5CE7',
};
const PLATFORM_BG = {
  instagram: '#FFE8F4', tiktok: '#F0F0F0', youtube: '#FFE8E8',
  twitter: '#E8F5FF', facebook: '#E8EFFF', other: '#F0EEFF',
};
const PLATFORM_ICONS = {
  instagram: FaInstagram, tiktok: FaTiktok, youtube: FaYoutube,
  twitter: FaXTwitter, facebook: FaFacebook, other: Smartphone,
};

function fmt(n) {
  return '₦' + Number(n || 0).toLocaleString('en-NG');
}

/* ── Inline edit row ── */
function EditRow({ type, onSave, onCancel }) {
  const [reward,    setReward]    = useState(String(type.reward));
  const [label,     setLabel]     = useState(type.label);
  const [isActive,  setIsActive]  = useState(type.is_active);
  const [saving,    setSaving]    = useState(false);
  const [err,       setErr]       = useState('');

  async function save() {
    const r = parseInt(reward);
    if (!r || r < 1) { setErr('Reward must be ≥ 1'); return; }
    if (!label.trim()) { setErr('Label cannot be empty'); return; }
    setSaving(true); setErr('');
    try {
      const updated = await apiPatch(`/admin/task-types/${type.id}`, {
        reward: r, label: label.trim(), is_active: isActive,
      });
      onSave(updated);
    } catch (e) {
      setErr(e.message || 'Save failed');
    } finally { setSaving(false); }
  }

  return (
    <tr style={{ background: '#F5F3FF' }}>
      <td className="px-4 py-3" colSpan={2}>
        <input value={label} onChange={e => setLabel(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
          style={{ border: '1.5px solid #6C5CE7', background: 'white', color: 'var(--text)' }} />
      </td>
      <td className="px-4 py-3">
        <div className="relative w-28">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>₦</span>
          <input type="number" min="1" value={reward} onChange={e => setReward(e.target.value)}
            className="w-full pl-6 pr-2 py-1.5 rounded-lg text-sm outline-none font-mono"
            style={{ border: '1.5px solid #6C5CE7', background: 'white', color: 'var(--text)' }} />
        </div>
      </td>
      <td className="px-4 py-3">
        <button onClick={() => setIsActive(a => !a)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors"
          style={isActive
            ? { background: '#D4F6EE', color: '#00875A' }
            : { background: '#FFE0E0', color: '#C0392B' }}>
          {isActive ? <CheckCircle2 size={11} strokeWidth={2.5} /> : <XCircle size={11} strokeWidth={2.5} />}
          {isActive ? 'Active' : 'Inactive'}
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {err && <span className="text-xs" style={{ color: '#C0392B' }}>{err}</span>}
          <button onClick={save} disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50"
            style={{ background: '#6C5CE7', color: 'white' }}>
            {saving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} strokeWidth={2.5} />}
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminTaskTypesPage() {
  const [types,   setTypes]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId,  setEditId]  = useState(null);
  const [search,  setSearch]  = useState('');
  const [toast,   setToast]   = useState('');

  useEffect(() => {
    apiGet('/admin/task-types')
      .then(d => setTypes(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleSave(updated) {
    setTypes(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditId(null);
    setToast(`"${updated.label}" updated — price is now ₦${Number(updated.reward).toLocaleString('en-NG')}`);
    setTimeout(() => setToast(''), 3500);
  }

  const filtered = search.trim()
    ? types.filter(t => t.label.toLowerCase().includes(search.toLowerCase()) || t.value.includes(search.toLowerCase()))
    : types;

  const activeCount   = types.filter(t => t.is_active).length;
  const inactiveCount = types.filter(t => !t.is_active).length;

  return (
    <DashboardLayout title="Task Types & Pricing" subtitle="Edit prices and availability — changes apply instantly" adminOnly>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold"
          style={{ background: '#D4F6EE', color: '#00875A', border: '1px solid #86EFAC' }}>
          <CheckCircle2 size={15} strokeWidth={2.5} /> {toast}
        </div>
      )}

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Types',    value: types.length,    color: 'var(--primary)', bg: '#EEF2FF' },
          { label: 'Active',         value: activeCount,     color: '#00875A',        bg: '#D4F6EE' },
          { label: 'Inactive',       value: inactiveCount,   color: '#B45309',        bg: '#FFF3D6' },
        ].map(s => (
          <div key={s.label} className="card rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
              <span className="font-black text-base" style={{ color: s.color }}>{s.value}</span>
            </div>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search task types…"
          className="w-full pl-9 pr-4 py-2 rounded-xl text-sm outline-none"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
          onFocus={e => (e.target.style.borderColor = '#6C5CE7')}
          onBlur={e  => (e.target.style.borderColor = 'var(--border)')} />
      </div>

      <div className="card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2" style={{ color: 'var(--text-muted)' }}>
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Platform', 'Task Type', 'Price / user', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => {
                  const Icon = PLATFORM_ICONS[t.platform] ?? Smartphone;
                  if (editId === t.id) {
                    return <EditRow key={t.id} type={t} onSave={handleSave} onCancel={() => setEditId(null)} />;
                  }
                  return (
                    <tr key={t.id}
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : undefined, opacity: t.is_active ? 1 : 0.5 }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td className="px-4 py-3">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: PLATFORM_BG[t.platform] ?? '#F0EEFF', color: PLATFORM_COLORS[t.platform] ?? '#6C5CE7' }}>
                          <Icon size={13} />
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{t.label}</p>
                        <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.value}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-black text-base" style={{ color: '#6C5CE7', letterSpacing: '-0.02em' }}>
                          {fmt(t.reward)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                          style={t.is_active
                            ? { background: '#D4F6EE', color: '#00875A' }
                            : { background: '#FFE0E0', color: '#C0392B' }}>
                          {t.is_active
                            ? <CheckCircle2 size={11} strokeWidth={2.5} />
                            : <XCircle size={11} strokeWidth={2.5} />}
                          {t.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setEditId(t.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors hover:opacity-80"
                          style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
                          <Pencil size={11} strokeWidth={2.5} /> Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="text-center py-10">
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No task types match "{search}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
        Price changes apply immediately to the create-task page. Existing live campaigns are not affected.
      </p>
    </DashboardLayout>
  );
}
