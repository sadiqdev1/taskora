import Link from 'next/link';
import { ArrowRight, Briefcase, Globe, Heart, Zap, Mail } from 'lucide-react';

export const metadata = {
  title: 'Careers at Taskora',
  description: 'Help us build the future of earning in Africa. See open roles at Taskora.',
};

const PERKS = [
  { Icon: Globe,  title: 'Fully Remote',     desc: 'Work from anywhere in Africa. We care about output, not location.' },
  { Icon: Zap,    title: 'Fast-moving',       desc: 'Ship real features used by tens of thousands of earners every week.' },
  { Icon: Heart,  title: 'Mission-driven',    desc: 'Every line of code you write puts money in someone\'s pocket.' },
  { Icon: Briefcase, title: 'Equity',         desc: 'Early team members get meaningful equity as Taskora grows.' },
];

export default function CareersPage() {
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
        <section className="relative overflow-hidden px-5 py-24 flex flex-col items-center text-center gap-6">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,92,231,0.09) 0%, transparent 70%)' }} />
          <div className="relative z-10 max-w-2xl flex flex-col items-center gap-5">
            <span className="text-[0.7rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border" style={{ color: 'var(--primary)', borderColor: '#DDD6FE', background: 'var(--primary-muted)' }}>Careers</span>
            <h1 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(2.4rem,6vw,4rem)', color: 'var(--text)' }}>
              Build the future of<br />
              <span className="gradient-text">earning in Africa.</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Taskora is a small, scrappy team building something that genuinely changes lives. If you want your work to matter, we want to talk.
            </p>
          </div>
        </section>

        {/* Perks */}
        <section className="px-5 pb-20 bg-white">
          <div className="max-w-4xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col items-center text-center gap-2">
              <h2 className="font-black tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', color: 'var(--text)' }}>Why Taskora</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PERKS.map(p => (
                <div key={p.title} className="rounded-2xl p-6 flex flex-col gap-3 border" style={{ borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                    <p.Icon size={18} strokeWidth={1.8} />
                  </span>
                  <h3 className="font-black text-sm tracking-tight" style={{ color: 'var(--text)' }}>{p.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section className="px-5 py-20" style={{ background: '#F8F9FE' }}>
          <div className="max-w-2xl mx-auto flex flex-col gap-10">
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Open Roles</span>
              <h2 className="font-black tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', color: 'var(--text)' }}>No open roles right now.</h2>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--text-secondary)' }}>
                We don&apos;t have any open positions at the moment, but we&apos;re always interested in exceptional people. Send us a message and tell us what you&apos;d bring to the team.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 border text-center" style={{ borderColor: 'var(--border-subtle)', boxShadow: '0 4px 24px rgba(108,92,231,0.08)' }}>
              <span className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                <Mail size={24} strokeWidth={1.5} />
              </span>
              <h3 className="font-black text-lg tracking-tight" style={{ color: 'var(--text)' }}>Send a speculative application</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Email us at <strong>careers@taskora.io</strong> with your background, what role you&apos;d fill, and why you care about the mission.
              </p>
              <a href="mailto:careers@taskora.io"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold no-underline transition-colors bg-[#6C5CE7] hover:bg-[#5A4BD1]">
                Email us <ArrowRight size={14} strokeWidth={2.5} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-6 text-center text-xs" style={{ background: 'var(--dark-2)', color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        © {new Date().getFullYear()} Taskora ·{' '}
        <Link href="/about" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>About</Link>
        {' · '}
        <Link href="/contact" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Contact</Link>
      </footer>
    </div>
  );
}
