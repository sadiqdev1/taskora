/**
 * PlatformIcon — SVG brand icons for social platforms.
 * Used everywhere instead of non-existent Lucide brand icons.
 */
export default function PlatformIcon({ platform, size = 18 }) {
  const s = { width: size, height: size, flexShrink: 0 };

  switch (platform) {
    case 'instagram':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="url(#ig)" />
          <defs>
            <radialGradient id="ig" cx="30%" cy="107%" r="130%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="25%" stopColor="#fd5949" />
              <stop offset="60%" stopColor="#d6249f" />
              <stop offset="100%" stopColor="#285AEB" />
            </radialGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="1.8" fill="none" />
          <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
        </svg>
      );

    case 'tiktok':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#010101" />
          <path d="M17 8.5a4.5 4.5 0 01-4.5-4.5v9.25a2.75 2.75 0 11-2.75-2.75c.15 0 .3.01.45.04V7.97a5.75 5.75 0 105.75 5.78V8.5H17z" fill="white" />
        </svg>
      );

    case 'youtube':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#FF0000" />
          <path d="M20.5 8.2s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C15.3 5 12 5 12 5s-3.3 0-5.7.3c-.4.1-1.2.1-2 .9-.6.6-.8 2-.8 2S3 9.8 3 11.4v1.5c0 1.5.2 3.1.2 3.1s.2 1.4.8 2c.8.8 1.8.8 2.3.9 1.6.2 7 .2 7 .2s3.3 0 5.7-.3c.4-.1 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.5.2-3.1v-1.5C20.7 9.8 20.5 8.2 20.5 8.2z" fill="white" fillOpacity=".15" />
          <polygon points="10,8.5 10,15.5 16,12" fill="white" />
        </svg>
      );

    case 'twitter':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#000000" />
          <path d="M17.5 4h2.5l-5.5 6.3L21 20h-5l-3.9-5-4.5 5H5l5.8-6.7L3.5 4h5.1l3.5 4.6L17.5 4zM16.7 18.5h1.4L7.4 5.5H5.9l10.8 13z" fill="white" />
        </svg>
      );

    case 'facebook':
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#1877F2" />
          <path d="M16 8h-2a1 1 0 00-1 1v2h3l-.5 3H13v7h-3v-7H8v-3h2V9a4 4 0 014-4h2v3z" fill="white" />
        </svg>
      );

    default:
      return (
        <svg style={s} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="6" fill="#6C5CE7" />
          <rect x="5" y="11" width="14" height="2" rx="1" fill="white" />
          <rect x="11" y="5" width="2" height="14" rx="1" fill="white" />
        </svg>
      );
  }
}
