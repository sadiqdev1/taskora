export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/campaigns', '/help'],
        disallow: ['/dashboard', '/admin', '/wallet', '/transactions', '/settings', '/notifications', '/referrals', '/tasks'],
      },
    ],
    sitemap: 'https://taskora.io/sitemap.xml',
  };
}
