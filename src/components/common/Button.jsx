import { motion } from 'framer-motion';

const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  children,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden active:scale-95';

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500/50 shadow-sm hover:shadow-md',
    success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500/50 shadow-sm hover:shadow-md',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50 shadow-sm hover:shadow-md',
    warning: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500/50 shadow-sm hover:shadow-md',
    purple: 'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-500/50 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 hover:bg-gray-200 dark:hover:bg-zinc-700 focus:ring-gray-400/50 shadow-sm',
    outline: 'border-2 border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 focus:ring-gray-400/50',
    ghost: 'text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 focus:ring-gray-400/50',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
