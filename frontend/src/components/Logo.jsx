import Link from 'next/link';

/**
 * Logo — brand mark + wordmark.
 * size: 'sm' | 'md' | 'lg'
 * theme: 'dark' (white text) | 'light' (default, dark text)
 */
export default function Logo({ size = 'md', href = '/', theme = 'light' }) {
  const mark = {
    sm: 'w-7 h-7 rounded-[8px]  text-xs',
    md: 'w-8 h-8 rounded-[10px] text-sm',
    lg: 'w-10 h-10 rounded-xl   text-base',
  }[size];

  const word = {
    sm: 'text-sm',
    md: 'text-[1rem]',
    lg: 'text-xl',
  }[size];

  return (
    <Link href={href} className="flex items-center gap-2.5 select-none">
      <span
        className={`gradient-brand ${mark} flex items-center justify-center text-white font-black shrink-0`}
        style={{ boxShadow: '0 2px 10px rgba(108,92,231,0.35)' }}
      >
        T
      </span>
      <span
        className={`font-black ${word} tracking-[-0.025em]`}
        style={{ color: theme === 'dark' ? 'white' : 'var(--text)' }}
      >
        Taskora
      </span>
    </Link>
  );
}