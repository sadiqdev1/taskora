import Link from 'next/link';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

export const metadata = {
  title: '404 — Page Not Found | Taskora',
  description: 'The page you are looking for does not exist.',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden"
      style={{ background: '#0a0a1a' }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/404-bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          opacity: 0.4,
        }}
      />

      {/* Gradient overlay — darkens bottom for readability */}
      <div className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(to bottom, rgba(10,10,26,0.3) 0%, rgba(10,10,26,0.75) 60%, rgba(10,10,26,0.95) 100%)' }} />

      {/* Content — fully centered */}
      <div className="relative z-10 flex flex-col items-center gap-5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-2 no-underline">
          <span className="w-9 h-9 rounded-xl bg-[#6C5CE7] text-white font-black text-base flex items-center justify-center"
            style={{ boxShadow: '0 4px 20px rgba(108,92,231,0.5)' }}>T</span>
          <span className="font-black text-lg text-white" style={{ letterSpacing: '-0.02em' }}>Taskora</span>
        </Link>

        {/* Ghost 404 — fully visible, centered */}
        <p className="font-black pointer-events-none select-none w-full text-center"
          style={{
            fontSize: 'clamp(7rem,22vw,14rem)',
            lineHeight: 1,
            letterSpacing: '-0.04em',
            color: 'rgba(255,255,255,0.07)',
            margin: '0 auto',
          }}>
          404
        </p>

        {/* Text block — overlaps the ghost number slightly */}
        <div className="-mt-6 flex flex-col items-center gap-2">
          <h1 className="font-black text-3xl text-white tracking-tight">Page not found</h1>
          <p className="text-base max-w-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          <Link href="/"
            className="bg-[#6C5CE7] hover:bg-[#5A4BD1] flex items-center gap-2 px-7 py-3 rounded-xl text-white font-bold text-sm transition-colors"
            style={{ boxShadow: '0 4px 20px rgba(108,92,231,0.4)' }}>
            <ArrowLeft size={15} strokeWidth={2.5} /> Back to Home
          </Link>
          <Link href="/dashboard"
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}>
            <LayoutDashboard size={15} strokeWidth={2} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
