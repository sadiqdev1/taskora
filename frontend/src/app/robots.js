export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/tasks', '/help'],
        disallow: ['/dashboard', '/admin', '/wallet', '/transactions', '/settings', '/notifications', '/referrals', '/my-tasks'],
      },
    ],
    sitemap: 'https://taskora.io/sitemap.xml',
  };
}
