/**
 * UserAvatar — shows a user's avatar image if available, otherwise their initial.
 *
 * Props:
 *   user     — object with { name, avatar }
 *   size     — number (pixels, default 36)
 *   rounded  — 'full' | 'xl' | 'lg' (default 'full')
 *   className — extra classes
 */
export default function UserAvatar({ user, size = 36, rounded = 'full', className = '' }) {
  const initial   = user?.name?.[0]?.toUpperCase() ?? '?';
  const radiusMap = { full: '9999px', xl: '12px', lg: '8px' };
  const radius    = radiusMap[rounded] ?? '9999px';
  const fontSize  = Math.max(10, Math.round(size * 0.38));

  return (
    <div
      className={`flex items-center justify-center shrink-0 overflow-hidden font-black text-white ${className}`}
      style={{ width: size, height: size, borderRadius: radius, background: '#6C5CE7', fontSize }}
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user?.name ?? 'User avatar'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => {
            // If the image URL is broken, hide it — the parent div shows the initial
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        initial
      )}
    </div>
  );
}
