'use client';

import { useEffect } from 'react';

/**
 * ConfirmModal — a reusable accessible confirmation dialog.
 *
 * Props:
 *   open         {boolean}  — whether the modal is visible
 *   title        {string}   — dialog heading
 *   message      {string}   — body text / explanation
 *   confirmLabel {string}   — label for the confirm button (default "Confirm")
 *   confirmColor {string}   — CSS background color of the confirm button (default "#C0392B")
 *   onConfirm    {function} — called when user clicks the confirm button
 *   onCancel     {function} — called when user clicks Cancel or the backdrop or presses Escape
 *   loading      {boolean}  — shows a spinner / disables buttons while in-flight
 */
export default function ConfirmModal({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  confirmColor = '#C0392B',
  onConfirm,
  onCancel,
  loading = false,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function handler(e) {
      if (e.key === 'Escape' && !loading) onCancel?.();
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(15,12,40,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={loading ? undefined : onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby={message ? 'confirm-modal-message' : undefined}
        className="rounded-2xl p-6 max-w-md w-full mx-4 flex flex-col gap-4"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="text-base font-bold" style={{ color: 'var(--text)' }}>
          {title}
        </h2>

        {message && (
          <p id="confirm-modal-message" className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {message}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-opacity hover:opacity-80"
            style={{ background: 'var(--bg)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-opacity hover:opacity-90 flex items-center gap-2"
            style={{ background: confirmColor }}
          >
            {loading && (
              <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
