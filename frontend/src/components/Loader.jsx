/**
 * Loader — inline spinner or fullscreen overlay.
 * size: 'sm' | 'md' | 'lg'
 */
export default function Loader({ fullscreen = false, size = 'md' }) {
  const dims  = { sm: 'w-4 h-4',  md: 'w-6 h-6',  lg: 'w-10 h-10' }[size];
  const thick = { sm: 'border-2', md: 'border-[3px]', lg: 'border-4' }[size];

  const spinner = (
    <span
      className={`${dims} ${thick} rounded-full animate-spin inline-block`}
      style={{ borderColor: 'var(--primary-muted)', borderTopColor: 'var(--primary)' }}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(248,249,254,0.9)', backdropFilter: 'blur(6px)' }}
      >
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Loading…
          </span>
        </div>
      </div>
    );
  }

  return spinner;
}