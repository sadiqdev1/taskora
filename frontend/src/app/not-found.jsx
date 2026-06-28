import Link from 'next/link';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

export const metadata = {
  title: '404 — Page Not Found | Taskora',
  description: 'The page you are looking for does not exist.',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: 'var(--bg)' }}>
      <Link href="/" className="flex items-center gap-2.5 mb-12">
        <span className="gradient-brand w-10 h-10 rounded-xl text-white font-black text-lg flex items-center justify-center">T</span>
        <span className="font-bold text-xl" style={{ color: 'var(--text)', letterSpacing: '-0.02em' }}>Taskora</span>
      </Link>

      <p className="font-black mb-2" style={{ fontSize: '7rem', lineHeight: 1, letterSpacing: '-0.05em', color: 'var(--border)' }}>404</p>
      <h1 className="font-black text-3xl mb-3" style={{ color: 'var(--text)', letterSpacing: '-0.025em' }}>Page not found</h1>
      <p className="text-base mb-8 max-w-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/"
          className="bg-[#6C5CE7] hover:bg-[#5A4BD1] flex items-center gap-2 px-7 py-3 rounded-xl text-white font-bold text-sm transition-colors">
          <ArrowLeft size={15} strokeWidth={2.5} /> Back to Home
        </Link>
        <Link href="/dashboard"
          className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold border-2 hover:opacity-80 transition-opacity"
          style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'var(--surface)' }}>
          <LayoutDashboard size={15} strokeWidth={2} /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
