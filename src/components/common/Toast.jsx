import { motion } from 'framer-motion';
import { IoCheckmarkCircle, IoCloseCircle, IoInformationCircle, IoWarning, IoClose } from 'react-icons/io5';

const Toast = ({ type, message, onClose }) => {
  const icons = {
    success: <IoCheckmarkCircle className="w-6 h-6" />,
    error: <IoCloseCircle className="w-6 h-6" />,
    info: <IoInformationCircle className="w-6 h-6" />,
    warning: <IoWarning className="w-6 h-6" />,
  };

  const colors = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    info: 'bg-primary text-white',
    warning: 'bg-warning text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${colors[type]} min-w-[300px] max-w-md`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-80 transition-opacity"
        aria-label="Close notification"
      >
        <IoClose className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

export default Toast;
