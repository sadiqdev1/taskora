import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen, onClose, onConfirm,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const confirmClass = variant === 'danger'
    ? 'bg-red-500 hover:bg-red-600 text-white'
    : 'bg-orange-500 hover:bg-orange-600 text-white';

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'dialogIn .2s cubic-bezier(.16,1,.3,1)' }}
      >
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${variant === 'danger' ? 'bg-red-50' : 'bg-orange-50'}`}>
            <AlertTriangle size={18} className={variant === 'danger' ? 'text-red-500' : 'text-orange-500'} />
          </div>
          <div>
            <h3 id="confirm-title" className="text-base font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-2.5 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`px-4 py-2 text-sm font-medium rounded-full transition ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`@keyframes dialogIn{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
