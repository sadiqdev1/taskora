const Badge = ({ variant = 'default', children, size = 'md', className = '' }) => {
  const baseClasses = 'inline-flex items-center font-semibold rounded-full';

  const variantClasses = {
    success: 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
    warning: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20',
    info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20',
    default: 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return <span className={classes}>{children}</span>;
};

export default Badge;
