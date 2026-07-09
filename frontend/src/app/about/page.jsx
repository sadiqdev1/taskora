import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck, Users, TrendingUp, Heart, Globe } from 'lucide-react';

export const metadata = {
  title: 'About Taskora',
  description: 'Learn how Taskora connects brands with earners across Africa through social media micro-tasks.',
};

const TEAM = [
  { name: 'Abubakar Ibrahim',  role: 'Founder & Lead Engineer · SadiqDev', avatar: '/sadiqdev_logo.jpeg', bio: 'Building Taskora from the ground up — from backend API to pixel-perfect UI. Available for freelance work.', link: 'https://sadiqdev-portfolio.vercel.app/' },
];

const VALUES = [
  { Icon: Zap,         title: 'Speed',       desc: 'Every approved task credits your wallet immediately. No waiting, no delays.' },
  { Icon: ShieldCheck, title: 'Trust',        desc: 'Verified campaigns, secure payments, and transparent rules for every earner.' },
  { Icon: Users,       title: 'Community',   desc: 'We grow when our earners grow. Every withdrawal is a win for the whole platform.' },
  { Icon: TrendingUp,  title: 'Opportunity', desc: 'Anyone with a phone can earn. No degree, no experience, no barriers.' },
  { Icon: Heart,       title: 'Fairness',    desc: 'Fixed prices per task, no bidding, no undercutting. Everyone earns the same rate.' },
  { Icon: Globe,       title: 'Pan-African', desc: 'Built for Nigeria, expanding across Africa. Your earnings, your currency, your bank.' },
];

const MILESTONES = [
  { year: '2025', label: 'Founded', desc: 'Taskora launched with the mission to make earning from social media simple and instant.' },
  { year: '2025', label: '10K Users', desc: 'First 10,000 earners joined within the first few months of launch.' },
  { year: '2026', label: '₦2B+ Paid', desc: 'Over two billion naira paid out to earners across the platform.' },
  { year: '2026', label: '500+ Campaigns', desc: 'Hundreds of active campaigns live at any time across all major platforms.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFBFF', color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span className="gradient-brand w-8 h-8 rounded-[10px] flex items-center justify-center text-white text-sm font-black">T</span>
          <span className="font-black text-base tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.025em' }}>Taskora</span>
        </Link>
        <Link href="/register"
          className="bg-[#6C5CE7] hover:bg-[#5A4BD1] flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-bold no-underline transition-colors">
          Start Earning <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </nav>

      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative overflow-hidden px-5 py-24 flex flex-col items-center text-center gap-6">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,92,231,0.1) 0%, transparent 70%)' }} />
          <div className="relative z-10 max-w-2xl flex flex-col items-center gap-5">
            <span className="text-[0.7rem] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border"
              style={{ color: 'var(--primary)', borderColor: '#DDD6FE', background: 'var(--primary-muted)' }}>
              Our Story
            </span>
            <h1 className="font-black leading-tight tracking-tighter"
              style={{ fontSize: 'clamp(2.4rem,6vw,4rem)', color: 'var(--text)' }}>
              Earn from what you<br />
              <span className="gradient-text">already do every day.</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Taskora was built on a simple belief: if you're already scrolling social media, you should get paid for it. We connect brands who need real engagement with people who can deliver it — instantly, fairly, and at scale.
            </p>
          </div>
        </section>

        {/* ── Mission ── */}
        <section className="px-5 py-20 bg-white">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-5">
              <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Our Mission</span>
              <h2 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--text)' }}>
                Financial freedom through the internet you already use.
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Millions of Africans spend hours on social media every day but earn nothing from it. Taskora changes that — turning everyday online activity into real income deposited directly to your Nigerian bank account.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                For brands, we provide authentic engagement from real people — not bots, not fake accounts. Every task completed is by a verified human who actually used the platform.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(108,92,231,0.15)' }}>
              <img src="/social_media_advert_.jpeg" alt="Taskora earner" className="w-full object-cover" style={{ maxHeight: 400 }} />
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="px-5 py-20" style={{ background: '#F8F9FE' }}>
          <div className="max-w-4xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col items-center text-center gap-2.5">
              <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>What We Stand For</span>
              <h2 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', color: 'var(--text)' }}>Our Values</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {VALUES.map(v => (
                <div key={v.title} className="bg-white rounded-2xl p-6 flex flex-col gap-3 border"
                  style={{ borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                    <v.Icon size={18} strokeWidth={1.8} />
                  </span>
                  <h3 className="font-black text-base tracking-tight" style={{ color: 'var(--text)' }}>{v.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline ── */}
        <section className="px-5 py-20 bg-white">
          <div className="max-w-3xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col items-center text-center gap-2.5">
              <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Our Journey</span>
              <h2 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', color: 'var(--text)' }}>Milestones</h2>
            </div>
            <div className="flex flex-col gap-0">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex gap-6 pb-8">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm"
                      style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>{m.year}</div>
                    {i < MILESTONES.length - 1 && (
                      <div className="w-px flex-1 mt-2" style={{ background: 'var(--border-subtle)', minHeight: 32 }} />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 pt-2">
                    <p className="font-black text-base tracking-tight" style={{ color: 'var(--text)' }}>{m.label}</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Team ── */}
        <section className="px-5 py-20" style={{ background: '#F8F9FE' }}>
          <div className="max-w-4xl mx-auto flex flex-col gap-12">
            <div className="flex flex-col items-center text-center gap-2.5">
              <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>The Team</span>
              <h2 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', color: 'var(--text)' }}>Built by one person, for millions.</h2>
            </div>
            <div className="flex justify-center">
              {TEAM.map(t => (
                <div key={t.name} className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4 max-w-xs w-full border"
                  style={{ borderColor: 'var(--border-subtle)', boxShadow: '0 4px 24px rgba(108,92,231,0.08)' }}>
                  <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-2xl object-cover" style={{ boxShadow: '0 4px 16px rgba(108,92,231,0.2)' }} />
                  <div className="text-center">
                    <p className="font-black text-lg tracking-tight" style={{ color: 'var(--text)' }}>{t.name}</p>
                    <p className="text-xs mt-0.5 font-semibold" style={{ color: 'var(--primary)' }}>{t.role}</p>
                  </div>
                  <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{t.bio}</p>
                  {t.link && (
                    <a href={t.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold no-underline transition-colors hover:opacity-80"
                      style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                      View Portfolio →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-5 py-24 relative overflow-hidden flex flex-col items-center gap-6 text-center"
          style={{ background: 'var(--dark)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(108,92,231,0.25) 0%, transparent 70%)' }} />
          <h2 className="relative text-white font-black tracking-tighter" style={{ fontSize: 'clamp(2rem,5vw,3rem)' }}>
            Ready to start earning?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 400, fontSize: '1.05rem' }}>
            Free to join, no experience needed. Hundreds of tasks waiting right now.
          </p>
          <Link href="/register"
            className="relative flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white font-black no-underline transition-all hover:-translate-y-0.5"
            style={{ color: '#6C5CE7', fontSize: '0.95rem', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
            Create Free Account <ArrowRight size={16} strokeWidth={2.5} />
          </Link>
        </section>
      </main>

      <footer className="px-6 py-6 text-center text-xs" style={{ background: 'var(--dark-2)', color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        © {new Date().getFullYear()} Taskora. All rights reserved. ·{' '}
        <Link href="/privacy" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy</Link>
        {' · '}
        <Link href="/terms" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms</Link>
      </footer>
    </div>
  );
}
