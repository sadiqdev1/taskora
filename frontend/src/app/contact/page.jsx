import Link from 'next/link';
import { Mail, MessageCircle, ArrowRight } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';

export const metadata = {
  title: 'Contact Taskora',
  description: 'Get in touch with the Taskora team for support, business inquiries, or feedback.',
};

const CHANNELS = [
  {
    Icon: Mail,
    title: 'Email Support',
    desc: 'For account issues, payment questions, and general help.',
    value: 'support@taskora.io',
    href: 'mailto:support@taskora.io',
    cta: 'Send email',
    bg: '#EEF2FF', color: '#6C5CE7',
  },
  {
    Icon: MessageCircle,
    title: 'WhatsApp Community',
    desc: 'Join our earners community for tips, updates and help from other users.',
    value: 'WhatsApp Group',
    href: '#',
    cta: 'Join group',
    bg: '#D4F6EE', color: '#00875A',
  },
  {
    Icon: FaXTwitter,
    title: 'Twitter / X',
    desc: 'Follow us for platform updates, new campaign announcements and news.',
    value: '@taskoraio',
    href: 'https://twitter.com/taskoraio',
    cta: 'Follow us',
    bg: '#E8F5FF', color: '#1DA1F2',
  },
];

const FAQS = [
  { q: 'My task was rejected unfairly — what do I do?', a: 'Email support@taskora.io with your task ID and proof screenshot. We review all disputed rejections within 48 hours.' },
  { q: 'My withdrawal hasn\'t arrived after 24 hours.', a: 'Check your bank details are correct in Wallet settings. If correct, email us with your withdrawal reference number.' },
  { q: 'I want to run a campaign for my brand.', a: 'Create an account, deposit funds to your wallet, and post your first campaign directly from the Tasks page.' },
  { q: 'How do I report a suspicious campaign?', a: 'Use the report button on the campaign page or email us with the campaign URL.' },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFBFF', color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>

      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span className="gradient-brand w-8 h-8 rounded-[10px] flex items-center justify-center text-white text-sm font-black">T</span>
          <span className="font-black text-base tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.025em' }}>Taskora</span>
        </Link>
        <Link href="/register" className="bg-[#6C5CE7] hover:bg-[#5A4BD1] flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-bold no-underline transition-colors">
          Start Earning <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-5 py-24 flex flex-col items-center text-center gap-5">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(108,92,231,0.09) 0%, transparent 70%)' }} />
          <div className="relative z-10 max-w-xl flex flex-col items-center gap-4">
            <span className="text-[0.7rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border"
              style={{ color: 'var(--primary)', borderColor: '#DDD6FE', background: 'var(--primary-muted)' }}>Contact Us</span>
            <h1 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: 'var(--text)' }}>
              We&apos;re here to help.
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Have a question, issue, or idea? Reach us through any of the channels below. We typically respond within 24 hours.
            </p>
          </div>
        </section>

        {/* Contact channels */}
        <section className="px-5 pb-20">
          <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-5">
            {CHANNELS.map(c => (
              <div key={c.title} className="bg-white rounded-2xl p-6 flex flex-col gap-4 border"
                style={{ borderColor: 'var(--border-subtle)', boxShadow: '0 4px 24px rgba(108,92,231,0.06)' }}>
                <span className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: c.bg, color: c.color }}>
                  <c.Icon size={20} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-black text-base tracking-tight" style={{ color: 'var(--text)' }}>{c.title}</h3>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.desc}</p>
                </div>
                <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-bold no-underline transition-colors hover:opacity-80 mt-auto"
                  style={{ color: c.color }}>
                  {c.cta} <ArrowRight size={13} strokeWidth={2.5} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 pb-24" style={{ background: '#F8F9FE' }}>
          <div className="max-w-2xl mx-auto py-20 flex flex-col gap-10">
            <div className="flex flex-col items-center text-center gap-2.5">
              <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Quick Answers</span>
              <h2 className="font-black tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', color: 'var(--text)' }}>Common Issues</h2>
            </div>
            <div className="flex flex-col gap-3">
              {FAQS.map((f, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 flex flex-col gap-2 border"
                  style={{ borderColor: 'var(--border-subtle)' }}>
                  <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{f.q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.a}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              Still need help?{' '}
              <a href="mailto:support@taskora.io" className="font-bold" style={{ color: 'var(--primary)' }}>
                Email us directly →
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="px-6 py-6 text-center text-xs" style={{ background: 'var(--dark-2)', color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        © {new Date().getFullYear()} Taskora ·{' '}
        <Link href="/privacy" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy</Link>
        {' · '}
        <Link href="/terms" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms</Link>
      </footer>
    </div>
  );
}
