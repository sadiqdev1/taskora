import React, { createContext, useContext, useState } from "react";
import { CheckCircle, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};

export const ToastProvider = ({ children }) => {

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {

    const id = crypto.randomUUID();

    const duration =
      type === "error"
        ? 6000
        : 3500;

    const newToast = { id, message, type };

    setToasts(prev => [...prev, newToast].slice(-3));

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
      />

    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {

  const getIcon = (type) => {

    switch (type) {
      case "success":
        return CheckCircle;

      case "error":
        return AlertCircle;

      case "warning":
        return AlertTriangle;

      default:
        return Info;
    }
  };

  const getColor = (type) => {

    switch (type) {
      case "success":
        return "text-green-600";

      case "error":
        return "text-red-600";

      case "warning":
        return "text-yellow-600";

      default:
        return "text-blue-600";
    }
  };

  return (

    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">

      {toasts.map((toast) => {

        const Icon = getIcon(toast.type);
        const color = getColor(toast.type);

        return (

          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-lg border border-black/5 animate-toast-enter transition-all duration-300"
          >

            <Icon size={18} className={color} />

            <span className="text-sm text-gray-700 flex-1">
              {toast.message}
            </span>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={16} />
            </button>

          </div>

        );
      })}

    </div>
  );
};

export default ToastContext;