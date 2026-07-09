'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { apiFetch, apiPost } from '@/lib/api';
import { User, Lock, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';

function Section({ Icon, title, children }) {
  return (
    <div className="card rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
          <Icon size={16} strokeWidth={2} />
        </span>
        <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-4 last:mb-0">
      <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</label>
      {children}
      {hint && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{hint}</p>}
    </div>
  );
}

function StyledInput({ value, onChange, type = 'text', placeholder, disabled, readOnly }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder} disabled={disabled} readOnly={readOnly}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
      style={{
        background: (disabled || readOnly) ? 'var(--border-subtle)' : 'var(--bg)',
        border: `1.5px solid ${focused && !readOnly ? '#6C5CE7' : 'var(--border)'}`,
        color: 'var(--text)',
        cursor: readOnly ? 'default' : undefined,
        boxShadow: focused && !readOnly ? '0 0 0 3px rgba(108,92,231,0.12)' : undefined,
      }}
    />
  );
}

function Alert({ msg }) {
  if (!msg) return null;
  const ok = msg.startsWith('✅');
  return (
    <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl text-sm"
      style={ok ? { background: '#D4F6EE', color: '#00875A' } : { background: '#FFF0F0', color: '#C0392B' }}>
      {ok ? <CheckCircle2 size={15} strokeWidth={2.2} /> : <AlertCircle size={15} strokeWidth={2.2} />}
      {msg.slice(2)}
    </div>
  );
}

/* ── Delete confirmation modal ── */
function DeleteModal({ onConfirm, onCancel, loading }) {
  const [confirm, setConfirm] = useState('');
  const ready = confirm === 'DELETE';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,12,40,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-[page-enter_200ms_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FFE0E0', color: '#C0392B' }}>
              <Trash2 size={15} strokeWidth={2} />
            </span>
            <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>Delete Account</h2>
          </div>
          <button onClick={onCancel} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[var(--bg)] transition-colors" style={{ color: 'var(--text-muted)' }}>
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="px-4 py-3 rounded-xl text-sm" style={{ background: '#FFF0F0', color: '#C0392B', border: '1px solid #FFD0D0' }}>
            ⚠️ This will permanently delete your account, wallet balance, earnings history, and all data. <strong>This cannot be undone.</strong>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Type <span className="font-black tracking-wider" style={{ color: '#C0392B' }}>DELETE</span> to confirm
            </label>
            <input
              value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all font-mono tracking-wider"
              style={{
                background: 'var(--bg)',
                border: `1.5px solid ${ready ? '#C0392B' : 'var(--border)'}`,
                color: 'var(--text)',
                boxShadow: ready ? '0 0 0 3px rgba(192,57,43,0.1)' : undefined,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={onConfirm}
            disabled={!ready || loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-40"
            style={{ background: ready ? '#C0392B' : '#e89c96' }}
          >
            {loading ? 'Deleting…' : 'Permanently Delete Account'}
          </button>
          <button onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--border)] hover:bg-[var(--bg)] transition-colors"
            style={{ color: 'var(--text-secondary)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile]   = useState({ name: user?.name || '', email: user?.email || '' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const [saving, setSaving]     = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [msg, setMsg]           = useState('');
  const [pwMsg, setPwMsg]       = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true); setMsg('');
    try {
      const form = new FormData();
      form.append('name', profile.name);
      const updated = await apiFetch('/profile', { method: 'POST', body: form });
      if (updated) setUser(updated);
      setMsg('✅ Profile updated successfully!');
    } catch (err) {
      setMsg('❌ ' + (err.message || 'Failed to update profile.'));
    } finally { setSaving(false); }
  }

  async function savePassword(e) {
    e.preventDefault();
    if (!password.current)             { setPwMsg('❌ Please enter your current password.'); return; }
    if (password.new !== password.confirm) { setPwMsg('❌ Passwords do not match.'); return; }
    if (password.new.length < 8)           { setPwMsg('❌ Password must be at least 8 characters.'); return; }
    setPwSaving(true); setPwMsg('');
    try {
      await apiPost('/change-password', {
        current_password:      password.current,
        password:              password.new,
        password_confirmation: password.confirm,
      });
      setPwMsg('✅ Password changed successfully!');
      setPassword({ current: '', new: '', confirm: '' });
    } catch (err) {
      setPwMsg('❌ ' + (err.message || 'Failed to change password.'));
    } finally { setPwSaving(false); }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await apiFetch('/account', { method: 'DELETE' });
    } catch { /* proceed anyway */ }
    await logout();
    router.replace('/');
  }

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account preferences">
      {showDelete && (
        <DeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleting}
        />
      )}

      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {/* Profile */}
        <Section Icon={User} title="Profile Information">
          <Alert msg={msg} />
          <form onSubmit={saveProfile}>
            <Field label="Full Name">
              <StyledInput
                value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                placeholder="Your full name"
              />
            </Field>
            <Field label="Email Address" hint="Email cannot be changed. Contact support if you need to update it.">
              <StyledInput
                type="email"
                value={profile.email}
                readOnly
              />
            </Field>
            <Field label="Account Role">
              <StyledInput value={user?.role === 'admin' ? 'Administrator' : 'Earner'} disabled />
            </Field>
            <button type="submit" disabled={saving}
              className="bg-[#6C5CE7] hover:bg-[#5A4BD1] px-6 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 transition-colors flex items-center gap-2">
              {saving && <span className="btn-spinner" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </Section>

        {/* Password */}
        <Section Icon={Lock} title="Change Password">
          <Alert msg={pwMsg} />
          <form onSubmit={savePassword}>
            <Field label="Current Password">
              <StyledInput type="password" value={password.current} onChange={e => setPassword(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" />
            </Field>
            <Field label="New Password" hint="Minimum 8 characters.">
              <StyledInput type="password" value={password.new} onChange={e => setPassword(p => ({ ...p, new: e.target.value }))} placeholder="••••••••" />
            </Field>
            <Field label="Confirm New Password">
              <StyledInput type="password" value={password.confirm} onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" />
            </Field>
            <button type="submit" disabled={pwSaving}
              className="bg-[#6C5CE7] hover:bg-[#5A4BD1] px-6 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60 transition-colors flex items-center gap-2">
              {pwSaving && <span className="btn-spinner" />}
              {pwSaving ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </Section>

        {/* Danger zone */}
        <Section Icon={Trash2} title="Danger Zone">
          <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all hover:bg-red-50"
            style={{ borderColor: '#D63031', color: '#D63031' }}>
            <Trash2 size={15} strokeWidth={2} />
            Delete Account
          </button>
        </Section>

      </div>
    </DashboardLayout>
  );
}
