'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ConfirmModal from '@/components/ConfirmModal';
import { apiGet, apiPatch } from '@/lib/api';
import { Search, Users, CheckCircle2, Clock, DollarSign, ShieldCheck, Pencil, X, Loader2, AlertCircle } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';

function fmt(n) {
  return '₦' + parseFloat(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ── Inline styled helpers ── */
function ModalInput({ label, type = 'text', value, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
        style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)', opacity: disabled ? 0.6 : 1 }}
        onFocus={e => { if (!disabled) { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 3px var(--primary-glow)'; } }}
        onBlur={e =>  { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}

/* ── Edit User Modal ── */
function EditUserModal({ user, onClose, onSaved }) {
  const [form,    setForm]    = useState({
    name:           user.name           ?? '',
    email:          user.email          ?? '',
    role:           user.role           ?? 'user',
    wallet_balance: String(user.wallet_balance ?? ''),
    is_verified:    Boolean(user.is_verified),
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  function f(key) {
    return { value: form[key], onChange: e => setForm(p => ({ ...p, [key]: e.target.value })) };
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name || !form.email) { setError('Name and email are required.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name:           form.name.trim(),
        email:          form.email.trim(),
        role:           form.role,
        wallet_balance: parseFloat(form.wallet_balance) || 0,
        is_verified:    form.is_verified,
      };
      await apiPatch(`/admin/users/${user.id}`, payload);
      onSaved({ ...user, ...payload });
    } catch (err) {
      setError(err.message || 'Failed to update user.');
      setSaving(false);
    }
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(15,12,40,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={saving ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-user-title"
        className="rounded-2xl p-6 max-w-md w-full mx-4 flex flex-col gap-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.22)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 id="edit-user-title" className="text-base font-bold" style={{ color: 'var(--text)' }}>
            Edit User
          </h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg)] disabled:opacity-50"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm"
            style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <ModalInput label="Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} disabled={saving} />
          <ModalInput label="Email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} disabled={saving} />

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Role</label>
            <select
              value={form.role}
              onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              disabled={saving}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)', opacity: saving ? 0.6 : 1 }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Wallet Balance */}
          <ModalInput
            label="Wallet Balance (₦)"
            type="number"
            value={form.wallet_balance}
            onChange={e => setForm(p => ({ ...p, wallet_balance: e.target.value }))}
            disabled={saving}
          />

          {/* Is Verified toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Verified</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Mark this user as identity-verified</p>
            </div>
            <button
              type="button"
              onClick={() => setForm(p => ({ ...p, is_verified: !p.is_verified }))}
              disabled={saving}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50"
              style={{ background: form.is_verified ? '#6C5CE7' : 'var(--border)' }}
              aria-checked={form.is_verified}
              role="switch"
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
                style={{ transform: form.is_verified ? 'translateX(22px)' : 'translateX(3px)' }}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#6C5CE7] hover:bg-[#5A4BD1] py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function AdminUsersPage() {
  const [users,      setUsers]      = useState([]);
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [editTarget, setEditTarget] = useState(null); // user object to edit

  // Verify/unverify confirm modal
  const [verifyModal, setVerifyModal] = useState(null); // { user, newVal }
  const [verifying,   setVerifying]   = useState(false);

  useEffect(() => {
    apiGet('/admin/users')
      .then(d => setUsers(d?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Toggle verified — goes via ConfirmModal */
  function requestToggleVerify(u) {
    setVerifyModal({ user: u, newVal: !u.is_verified });
  }

  async function confirmToggleVerify() {
    if (!verifyModal) return;
    const { user: u, newVal } = verifyModal;
    setVerifying(true);
    try {
      await apiPatch(`/admin/users/${u.id}`, { is_verified: newVal });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, is_verified: newVal } : x));
    } catch {}
    finally {
      setVerifying(false);
      setVerifyModal(null);
    }
  }

  /* Save edits from EditUserModal */
  function handleUserSaved(updated) {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    setEditTarget(null);
  }

  const filtered = search
    ? users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const totalEarnings = users.reduce((a, u) => a + parseFloat(u.total_earnings || 0), 0);

  return (
    <DashboardLayout title="Manage Users" subtitle="View and manage all platform users" adminOnly>

      {/* Edit modal */}
      {editTarget && (
        <EditUserModal
          user={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleUserSaved}
        />
      )}

      {/* Verify/Unverify confirm modal */}
      <ConfirmModal
        open={!!verifyModal}
        title={verifyModal?.newVal ? 'Verify this user?' : 'Unverify this user?'}
        message={
          verifyModal?.newVal
            ? `${verifyModal.user.name} will be marked as verified and gain access to verified-only tasks.`
            : `${verifyModal?.user.name} will lose their verified status.`
        }
        confirmLabel={verifyModal?.newVal ? 'Verify' : 'Unverify'}
        confirmColor={verifyModal?.newVal ? '#00875A' : '#B45309'}
        loading={verifying}
        onConfirm={confirmToggleVerify}
        onCancel={() => !verifying && setVerifyModal(null)}
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Users',    value: users.length,                              Icon: Users,       bg: '#EEF2FF', color: 'var(--primary)' },
          { label: 'Verified',       value: users.filter(u => u.is_verified).length,   Icon: ShieldCheck, bg: '#D4F6EE', color: '#00875A'        },
          { label: 'Unverified',     value: users.filter(u => !u.is_verified).length,  Icon: Clock,       bg: '#FFF3D6', color: '#B45309'        },
          { label: 'Total Earnings', value: fmt(totalEarnings),                         Icon: DollarSign,  bg: '#EEF2FF', color: 'var(--primary)' },
        ].map(s => (
          <div key={s.label} className="card rounded-2xl p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>
              <s.Icon size={18} strokeWidth={2} />
            </span>
            <div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              <p className="font-black text-xl" style={{ color: s.color, letterSpacing: '-0.02em' }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 max-w-sm"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: 'var(--text)' }}
        />
      </div>

      {/* Table / Cards */}
      <div className="card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-7 h-7 rounded-full border-[3px] animate-spin"
              style={{ borderColor: 'var(--border-subtle)', borderTopColor: '#6C5CE7' }} />
          </div>
        ) : (
          <>
            {/* ── Desktop table — hidden on mobile ── */}
            <div className="admin-table-wrap">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {['User', 'Wallet', 'Total Earned', 'Tasks', 'Joined', 'Verified', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr key={u.id}
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : undefined }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>

                      {/* User */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={u} size={36} />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{u.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 font-bold text-sm" style={{ color: 'var(--primary)' }}>{fmt(u.wallet_balance)}</td>
                      <td className="px-5 py-3.5 font-semibold text-sm" style={{ color: 'var(--text)' }}>{fmt(u.total_earnings)}</td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--text-secondary)' }}>{u.task_submissions_count}</td>
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                        {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Verified badge */}
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                          style={u.is_verified ? { background: '#D4F6EE', color: '#00875A' } : { background: '#FFF3D6', color: '#B45309' }}>
                          {u.is_verified
                            ? <><CheckCircle2 size={11} strokeWidth={2.2} /> Verified</>
                            : <><Clock size={11} strokeWidth={2.2} /> Pending</>}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditTarget(u)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-80"
                            style={{ background: '#EEF2FF', color: 'var(--primary)' }}
                          >
                            <Pencil size={12} strokeWidth={2.5} /> Edit
                          </button>
                          <button
                            onClick={() => requestToggleVerify(u)}
                            disabled={verifying}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-80 disabled:opacity-50 transition-opacity"
                            style={u.is_verified
                              ? { background: '#FFF3D6', color: '#B45309' }
                              : { background: '#D4F6EE', color: '#00875A' }}
                          >
                            {verifying ? '…' : u.is_verified ? 'Unverify' : 'Verify'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile card list — shown only on mobile ── */}
            <div className="admin-cards-wrap divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {filtered.map(u => (
                <div key={u.id} className="p-4 flex flex-col gap-3">
                  {/* Row 1: Avatar + name + email */}
                  <div className="flex items-center gap-3">
                    <UserAvatar user={u} size={40} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text)' }}>{u.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
                    </div>
                  </div>

                  {/* Row 2: Wallet balance + total earned */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Wallet</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{fmt(u.wallet_balance)}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total Earned</p>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{fmt(u.total_earnings)}</p>
                    </div>
                  </div>

                  {/* Row 3: Tasks + join date + verified badge */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span className="font-semibold" style={{ color: 'var(--text)' }}>{u.task_submissions_count}</span> tasks
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Joined {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={u.is_verified ? { background: '#D4F6EE', color: '#00875A' } : { background: '#FFF3D6', color: '#B45309' }}>
                      {u.is_verified
                        ? <><CheckCircle2 size={10} strokeWidth={2.2} /> Verified</>
                        : <><Clock size={10} strokeWidth={2.2} /> Pending</>}
                    </span>
                  </div>

                  {/* Row 4: Edit + Verify/Unverify buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditTarget(u)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-opacity hover:opacity-80"
                      style={{ background: '#EEF2FF', color: 'var(--primary)' }}
                    >
                      <Pencil size={12} strokeWidth={2.5} /> Edit
                    </button>
                    <button
                      onClick={() => requestToggleVerify(u)}
                      disabled={verifying}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-bold hover:opacity-80 disabled:opacity-50 transition-opacity"
                      style={u.is_verified
                        ? { background: '#FFF3D6', color: '#B45309' }
                        : { background: '#D4F6EE', color: '#00875A' }}
                    >
                      {verifying ? '…' : u.is_verified ? 'Unverify' : 'Verify'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <Search size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {search ? `No users found for "${search}"` : 'No users yet.'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
