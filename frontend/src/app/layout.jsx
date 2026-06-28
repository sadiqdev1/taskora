import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import NavigationProgress from '@/components/NavigationProgress';

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://taskora.io'),
  title: {
    default: 'Taskora — Earn Money Completing Tasks & Campaigns',
    template: '%s | Taskora',
  },
  description:
    'Taskora is the #1 micro-task earning platform. Complete social media campaigns, earn real cash rewards, and withdraw instantly. Join 50,000+ earners today — free to start.',
  keywords: [
    'earn money online',
    'micro tasks',
    'get paid to complete tasks',
    'online earning platform',
    'social media campaigns',
    'earn from home',
    'paid tasks',
    'make money online',
    'task completion rewards',
    'earn cash online',
    'taskora',
    'campaign rewards',
    'referral earnings',
    'online jobs',
    'freelance micro tasks',
  ],
  authors: [{ name: 'Taskora', url: 'https://taskora.io' }],
  creator: 'Taskora',
  publisher: 'Taskora',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://taskora.io',
    siteName: 'Taskora',
    title: 'Taskora — Earn Money Completing Tasks & Campaigns',
    description:
      'Complete social media tasks, earn real rewards, and cash out instantly. Join Taskora — the simplest way to earn money online.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Taskora — Earn from Tasks' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taskora — Earn Money Completing Tasks',
    description: 'Join 50,000+ earners. Complete tasks, earn cash. Free to start.',
    images: ['/og-image.png'],
    creator: '@taskora',
  },
  alternates: { canonical: 'https://taskora.io' },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col antialiased">
        <NavigationProgress />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}