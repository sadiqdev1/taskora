import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Flag, Send, CheckCircle2, ChevronRight } from 'lucide-react';

const reasons = [
  { id: 'spam', label: 'Spam or misleading', desc: 'Repetitive or deceptive content' },
  { id: 'harassment', label: 'Harassment or bullying', desc: 'Targeting or threatening someone' },
  { id: 'inappropriate', label: 'Inappropriate content', desc: 'Nudity, violence, or disturbing material' },
  { id: 'copyright', label: 'Copyright infringement', desc: 'Stolen or unauthorized content' },
  { id: 'misinformation', label: 'False information', desc: 'Misleading or factually incorrect' },
  { id: 'violence', label: 'Violence or danger', desc: 'Promotes harmful acts' },
];

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef(null);

  const reset = () => { setStep(1); setReason(''); setDetails(''); setSubmitting(false); };

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) handleClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  const handleClose = () => { onClose(); setTimeout(reset, 250); };

  const handleSubmit = async () => {
    setSubmitting(true);
    try { if (onSubmit) await onSubmit({ reason, details }); } catch {}
    setTimeout(() => { setStep(3); setSubmitting(false); }, 600);
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
        role="dialog"
        aria-modal="true"
        onClick={(e) => { if (modalRef.current && !modalRef.current.contains(e.target)) handleClose(); }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" style={{ animation: 'fadeIn .2s ease' }} />

        <div ref={modalRef} className="relative bg-white dark:bg-zinc-900 w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[88vh]" style={{ animation: 'slideUp .32s cubic-bezier(.22,.61,.36,1)' }}>

          {step !== 3 && (
            <>
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                    <Flag size={15} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {step === 1 ? 'Report content' : 'Additional details'}
                    </h3>
                    <p className="text-xs text-gray-400 dark:text-zinc-500">Step {step} of 2</p>
                  </div>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition">
                  <X size={16} className="text-gray-500 dark:text-zinc-400" />
                </button>
              </div>

              <div className="flex gap-1.5 px-5 pt-3">
                {[1, 2].map((s) => (
                  <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step >= s ? 'bg-orange-500' : 'bg-gray-200 dark:bg-zinc-700'}`} />
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {reasons.map((r) => (
                <label key={r.id} className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                  reason === r.id
                    ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10'
                    : 'border-gray-100 dark:border-zinc-800 hover:border-gray-200 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800'
                }`}>
                  <input type="radio" name="reason" value={r.id} checked={reason === r.id} onChange={(e) => setReason(e.target.value)} className="sr-only" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-zinc-200">{r.label}</p>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{r.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    reason === r.id ? 'border-orange-500 bg-orange-500' : 'border-gray-300 dark:border-zinc-600'
                  }`}>
                    {reason === r.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 p-5">
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-3">Tell us more about the issue (optional)</p>
              <textarea
                placeholder="Describe what you saw..."
                rows={5}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:bg-white dark:focus:bg-zinc-700 resize-none transition"
              />
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center text-center p-10 gap-4">
              <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Report submitted</h3>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 max-w-xs">Thanks for helping keep the community safe. Our team will review this.</p>
              </div>
              <button onClick={handleClose} className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition">
                Done
              </button>
            </div>
          )}

          {step !== 3 && (
            <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
              {step === 1 && (
                <button disabled={!reason} onClick={() => setStep(2)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full text-sm font-medium disabled:opacity-40 transition flex items-center justify-center gap-2">
                  Continue <ChevronRight size={15} />
                </button>
              )}
              {step === 2 && (
                <div className="flex gap-2.5">
                  <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 py-3 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition">Back</button>
                  <button onClick={handleSubmit} disabled={submitting}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition">
                    {submitting ? 'Submitting...' : <><Send size={14} /> Submit</>}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:.5}to{transform:translateY(0);opacity:1}}
      `}</style>
    </>,
    document.body
  );
};

export default ReportModal;
