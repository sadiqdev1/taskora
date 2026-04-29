import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const modalRef = useRef(null);

  /* ESC key close */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  /* Body scroll lock */
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen]);

  /* Focus trap */
  useEffect(() => {
    if (!isOpen) return;

    const focusable = modalRef.current?.querySelectorAll(
      "button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])"
    );

    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];

    const trapFocus = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", trapFocus);

    if (first) first.focus();

    return () => document.removeEventListener("keydown", trapFocus);
  }, [isOpen]);

  /* Click outside close */
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return ReactDOM.createPortal(
    <>
      {/* Animations */}
      <style>{`
        @keyframes modalFadeIn {
          from { opacity:0 }
          to { opacity:1 }
        }

        @keyframes modalScaleIn {
          from {
            transform: scale(.95) translateY(10px);
            opacity:0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity:1;
          }
        }

        .animate-modalFadeIn{
          animation: modalFadeIn .2s ease-out;
        }

        .animate-modalScaleIn{
          animation: modalScaleIn .25s cubic-bezier(.16,1,.3,1);
          will-change: transform, opacity;
        }
      `}</style>

      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-modalFadeIn"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal */}
        <div
          ref={modalRef}
          className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col border border-gray-100 animate-modalScaleIn`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-800">
              {title}
            </h3>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
              aria-label="Close modal"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default Modal;