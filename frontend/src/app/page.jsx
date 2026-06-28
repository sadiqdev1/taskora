import Welcome from '@/app/Welcome';

export const metadata = {
  title: 'Taskora — Earn Money Completing Tasks & Social Media Campaigns',
  description:
    'Taskora is the #1 micro-task earning platform. Complete Instagram, TikTok, YouTube and social media campaigns for real cash. Join 50,000+ earners. Free to start — withdraw from $10.',
  keywords: [
    'earn money online', 'micro tasks', 'paid social media tasks', 'get paid to like posts',
    'earn from Instagram', 'TikTok tasks for money', 'YouTube tasks earn cash',
    'online earning platform 2026', 'task completion rewards', 'make money from home',
    'earn cash online free', 'paid micro jobs', 'social media campaign rewards',
    'taskora', 'earn money completing tasks', 'work from home online jobs',
    'get paid to follow', 'get paid to comment', 'social media earning app',
  ],
  openGraph: {
    title: 'Taskora — Earn Money Completing Tasks',
    description: 'Complete social media tasks and earn real cash. 500+ active campaigns. Withdraw from $10. Join free today.',
    url: 'https://taskora.io',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taskora — Earn Money Completing Tasks',
    description: 'Join 50,000+ earners. Complete social media tasks, earn cash. Free to start.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: 'https://taskora.io' },
};

export default function Page() {
  return <Welcome />;
}
