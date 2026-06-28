/**
 * Button — primary/secondary/ghost/danger variants, sm/md/lg sizes.
 * Uses the Taskora brand CSS variables.
 */
import Loader from './Loader';

export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  const variants = {
    primary:   'bg-[#6C5CE7] text-white hover:bg-[#5A4BD1] active:scale-[.98]',
    secondary: 'bg-white text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bg)] active:scale-[.98]',
    ghost:     'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--bg)] active:scale-[.98]',
    danger:    'bg-red-500 text-white hover:bg-red-600 active:scale-[.98]',
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && <Loader size="sm" />}
      {children}
    </button>
  );
}
