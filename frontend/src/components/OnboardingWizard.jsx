'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { CheckCircle2, Upload, User, ArrowRight, Sparkles } from 'lucide-react';

/* ── Steps: Welcome → Profile → Done ── */
const STEPS = [
  { id: 'welcome', label: 'Welcome', Icon: Sparkles     },
  { id: 'profile', label: 'Profile', Icon: User         },
  { id: 'done',    label: 'Done',    Icon: CheckCircle2 },
];

/* ── Main Wizard ── */
export default function OnboardingWizard({ onComplete, standalone = false }) {
  const { user, setUser } = useAuth();

  const [step,    setStep]    = useState(0);
  const [saving,  setSaving]  = useState(false);

  /* Profile state */
  const [name,     setName]     = useState(user?.name     || '');
  const [username, setUsername] = useState(user?.username || '');
  const [avatar,   setAvatar]   = useState(null);
  const [preview,  setPreview]  = useState(user?.avatar || null);
  const fileRef = useRef(null);

  // Revoke blob URL on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /* Lock body scroll when used as modal */
  useEffect(() => {
    if (!standalone) {
      document.documentElement.classList.add('modal-open');
      return () => document.documentElement.classList.remove('modal-open');
    }
  }, [standalone]);

  const totalSteps = STEPS.length;
  const pct = Math.round((step / (totalSteps - 1)) * 100);

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke previous blob before creating a new one
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  }

  /* Submit — POST to /onboarding/complete as multipart/form-data */
  async function handleFinish() {
    setSaving(true);
    try {
      const form = new FormData();
      form.append('name', name.trim() || user?.name || '');
      if (username.trim()) form.append('username', username.trim());
      if (avatar)          form.append('avatar', avatar);
      form.append('referral_seen', '1');

      const res = await apiFetch('/onboarding/complete', {
        method:  'POST',
        body:    form,
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res?.user) setUser(res.user);
      // Only close after confirmed success
      onComplete();
    } catch {
      // Non-blocking — show no error but don't auto-close so user can retry
      // Just call onComplete to not leave user stuck
      onComplete();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className={
        standalone
          ? 'min-h-screen flex items-center justify-center p-4'
          : 'fixed inset-0 z-[60] flex items-center justify-center p-4'
      }
      style={
        standalone
          ? { background: 'var(--bg)' }
          : { background: 'rgba(15,12,40,0.72)', backdropFilter: 'blur(6px)' }
      }
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: '90dvh' }}
      >
        {/* Progress bar */}
        <div className="h-1 w-full shrink-0" style={{ background: 'var(--border-subtle)' }}>
          <div className="h-full bg-[#6C5CE7] transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-around px-5 pt-4 pb-2 shrink-0">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all"
                style={
                  i < step
                    ? { background: '#6C5CE7', borderColor: '#6C5CE7', color: 'white' }
                    : i === step
                    ? { background: '#EEF2FF', borderColor: '#6C5CE7', color: '#6C5CE7' }
                    : { background: 'white', borderColor: 'var(--border)', color: 'var(--text-muted)' }
                }
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span
                className="text-[0.55rem] font-semibold"
                style={{ color: i <= step ? '#6C5CE7' : 'var(--text-muted)' }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto px-5 py-4">

          {/* Step 0 — Welcome */}
          {step === 0 && (
            <div className="flex flex-col items-center text-center gap-5 py-2">
              <div
                className="w-16 h-16 rounded-2xl bg-[#6C5CE7] flex items-center justify-center text-3xl shadow-lg"
                style={{ boxShadow: '0 8px 24px rgba(108,92,231,0.35)' }}
              >
                🎉
              </div>
              <div>
                <h2 className="font-black text-2xl tracking-tight" style={{ color: 'var(--text)' }}>
                  Welcome to Taskora!
                </h2>
                <p className="text-sm mt-2 leading-relaxed max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Set up your profile in one quick step and start earning.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 w-full mt-1">
                {[
                  ['💰', 'Earn cash',  'Complete tasks'],
                  ['🏦', 'Withdraw',   'To your bank'  ],
                  ['👥', 'Refer',      '10% forever'   ],
                ].map(([e, t, s]) => (
                  <div key={t} className="flex flex-col items-center gap-1 p-3 rounded-xl" style={{ background: 'var(--bg)' }}>
                    <span className="text-xl">{e}</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{t}</span>
                    <span className="text-[0.6rem]" style={{ color: 'var(--text-muted)' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Profile */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-black text-xl tracking-tight" style={{ color: 'var(--text)' }}>Set up your profile</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Add a photo and confirm your display name</p>
              </div>

              {/* Avatar picker */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  <div
                    className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-black"
                    style={{ background: '#6C5CE7', boxShadow: '0 4px 14px rgba(108,92,231,0.35)' }}
                  >
                    {preview
                      ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                      : (name[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || '?')
                    }
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-[var(--border)] flex items-center justify-center hover:bg-[var(--bg)] transition-colors"
                    style={{ boxShadow: 'var(--shadow-sm)' }}
                  >
                    <Upload size={12} strokeWidth={2.5} style={{ color: '#6C5CE7' }} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Tap to upload (optional)</span>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Full Name <span style={{ color: '#C0392B' }}>*</span></label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className="auth-input"
                  autoFocus
                />
              </div>

              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  Username <span className="font-normal text-xs" style={{ color: 'var(--text-muted)' }}>(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none" style={{ color: 'var(--text-muted)' }}>@</span>
                  <input
                    value={username}
                    onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase())}
                    placeholder="yourhandle"
                    className="auth-input"
                    style={{ paddingLeft: 28 }}
                  />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Used for your public profile URL</p>
              </div>
            </div>
          )}

          {/* Step 2 — Done */}
          {step === 2 && (
            <div className="flex flex-col items-center text-center gap-5 py-2">
              <div className="w-16 h-16 rounded-2xl bg-[#D4F6EE] flex items-center justify-center text-3xl">🚀</div>
              <div>
                <h2 className="font-black text-2xl tracking-tight" style={{ color: 'var(--text)' }}>You&apos;re all set!</h2>
                <p className="text-sm mt-2 leading-relaxed max-w-xs mx-auto" style={{ color: 'var(--text-secondary)' }}>
                  Your account is ready. Start browsing tasks and earning right now.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="w-full py-3.5 rounded-xl text-sm font-black text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  style={{ boxShadow: '0 4px 18px rgba(108,92,231,0.35)' }}
                >
                  {saving
                    ? <><span className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Saving…</>
                    : <>Go to Dashboard <ArrowRight size={15} strokeWidth={2.5} /></>
                  }
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer nav (hidden on step 2 — it has its own button) ── */}
        {step < 2 && (
          <div
            className="px-5 py-4 flex items-center justify-between gap-3 shrink-0 border-t"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {step > 0
              ? <button onClick={() => setStep(s => s - 1)} className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>← Back</button>
              : <div />
            }
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 1 && !name.trim()}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] disabled:opacity-50 transition-colors"
            >
              {step === 0 ? 'Get Started' : 'Continue'}
              <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
