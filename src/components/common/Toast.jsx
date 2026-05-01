import { motion } from 'framer-motion';
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle, IoWarning, IoClose } from 'react-icons/io5';

const Toast = ({ type, message, onClose }) => {
  const icons = {
    success: <IoCheckmarkCircle className="w-5 h-5" />,
    error: <IoCloseCircle className="w-5 h-5" />,
    info: <IoInformationCircle className="w-5 h-5" />,
    warning: <IoWarning className="w-5 h-5" />,
  };

  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-800 dark:text-green-200',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-800 dark:text-red-200',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-800 dark:text-blue-200',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      icon: 'text-amber-600 dark:text-amber-400',
      text: 'text-amber-800 dark:text-amber-200',
    },
  };

  const style = styles[type] || styles.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${style.bg} ${style.border} min-w-[300px] max-w-md backdrop-blur-sm`}
    >
      <div className={`flex-shrink-0 ${style.icon}`}>{icons[type]}</div>
      <p className={`flex-1 text-sm font-medium ${style.text}`}>{message}</p>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ${style.text} hover:opacity-70 transition-opacity`}
        aria-label="Close notification"
      >
        <IoClose className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default Toast;
