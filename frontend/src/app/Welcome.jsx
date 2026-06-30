'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';
import { motion } from 'framer-motion';
import {
  Megaphone, Zap, Banknote, Target, Users, ShieldCheck,
  ArrowRight, Check, Star, TrendingUp, Plus,
} from 'lucide-react';
import { FaInstagram, FaYoutube, FaXTwitter, FaFacebook, FaTiktok } from 'react-icons/fa6';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

/* ── JSON-LD ── */
const JSONLD = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Taskora', url: 'https://taskora.io' };
const FAQ_LD = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [
  { '@type': 'Question', name: 'How do I earn money on Taskora?', acceptedAnswer: { '@type': 'Answer', text: 'Browse campaigns, complete the social media action, submit proof, and get paid once approved.' } },
  { '@type': 'Question', name: 'What is the minimum withdrawal?', acceptedAnswer: { '@type': 'Answer', text: 'The minimum withdrawal is $10 via PayPal, bank transfer, or crypto within 24 hours.' } },
  { '@type': 'Question', name: 'Is Taskora free to join?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, completely free. No credit card required.' } },
]};

/* ── Data ── */
const FEATURES = [
  { Icon: Megaphone,   title: 'Social Media Campaigns',  desc: 'Like, follow, comment and share on Instagram, TikTok, YouTube, Twitter and more — get paid per action.' },
  { Icon: Zap,         title: 'Instant Earnings',        desc: 'Every approved task credits your wallet immediately. No waiting weeks to see your money.' },
  { Icon: Banknote,    title: 'Fast Withdrawals',        desc: 'Withdraw via PayPal, bank transfer or crypto. Minimum $10, processed within 24 hours.' },
  { Icon: Target,      title: 'Tasks for Every Level',   desc: 'Easy, medium and hard tasks with matching rewards. Start simple and level up your earnings.' },
  { Icon: Users,       title: 'Refer & Earn',            desc: "Invite friends and earn 10% of their earnings — for life. No cap on referral earnings." },
  { Icon: ShieldCheck, title: 'Safe & Secure',           desc: 'Token-based auth, encrypted payments, and verified campaigns only. Your data stays protected.' },
];
const PLATFORMS = [
  { Icon: FaInstagram, label: 'Instagram', color: '#C13584', bg: '#FFF0F8' },
  { Icon: FaTiktok,    label: 'TikTok',    color: '#111',    bg: '#F2F2F2' },
  { Icon: FaYoutube,   label: 'YouTube',   color: '#FF0000', bg: '#FFF0F0' },
  { Icon: FaXTwitter,  label: 'Twitter',   color: '#1DA1F2', bg: '#EFF8FF' },
  { Icon: FaFacebook,  label: 'Facebook',  color: '#1877F2', bg: '#EEF3FF' },
];
const STATS = [
  { value: '50K+',  label: 'Active Earners'  },
  { value: '$2.1M', label: 'Total Paid Out'  },
  { value: '98.5%', label: 'Success Rate'    },
  { value: '500+',  label: 'Live Campaigns'  },
];
const HOW_IT_WORKS = [
  { Icon: Users,    title: 'Create your free account', desc: 'Sign up in 30 seconds. No credit card. Just your email and name.' },
  { Icon: Target,   title: 'Browse & pick campaigns',  desc: 'Choose from hundreds of active campaigns across all major platforms.' },
  { Icon: Banknote, title: 'Complete & earn cash',     desc: 'Submit proof, get approved, and withdraw anytime from $10.' },
];
const TESTIMONIALS = [
  { name: 'Sarah K.',  role: 'Freelance Designer', earnings: '$1,240', quote: "I make an extra $300–400 a month just doing tasks in my free time. The withdrawal process is super fast." },
  { name: 'Marcus L.', role: 'Student',             earnings: '$890',  quote: "Best side hustle I've found. Tasks take 2–5 minutes and the pay adds up fast." },
  { name: 'Priya M.',  role: 'Stay-at-home Mom',    earnings: '$2,150',quote: "Taskora replaced my part-time job income. I do it while the kids are napping." },
];
const FAQ = [
  { q: 'How do I get paid?', a: 'Complete a task, submit your proof screenshot, and once approved your wallet is credited instantly. Withdraw anytime from $10 via bank transfer.' },
  { q: 'Is Taskora really free to join?', a: 'Yes — 100% free. No subscription, no credit card required. You only earn, never pay.' },
  { q: 'What countries are supported?', a: 'Taskora supports earners worldwide. Withdrawals are available via bank transfer to Nigeria, Ghana, Kenya, South Africa, and 6 other African countries.' },
  { q: 'How quickly are tasks approved?', a: 'Most tasks are reviewed within 24 hours. Once approved, your wallet balance updates instantly.' },
  { q: 'Can I post my own campaigns?', a: 'Yes — create a campaign, set your reward per task, and thousands of earners will complete it for you.' },
  { q: 'Is my payment information safe?', a: 'Yes. We use bank-grade encryption. Your account details are never stored on our servers.' },
];

export default function Welcome() {
  const { user, loading } = useAuth();
  const [faqOpen, setFaqOpen] = useState(null);

  if (loading) return <Loader fullscreen />;

  const dashHref = user ? (user.role === 'admin' ? '/admin' : '/dashboard') : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFBFF', color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }} />

      {/* ── Nav ── */}
      <div className="sticky top-0 z-40 flex justify-center px-4 pt-3.5 pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-4xl flex items-center justify-between px-4 py-2.5 rounded-2xl border"
          style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderColor: 'rgba(235,235,245,0.9)', boxShadow: '0 2px 20px rgba(108,92,231,0.08)' }}>
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <span className="gradient-brand w-8 h-8 rounded-[10px] flex items-center justify-center text-white text-sm font-black shrink-0">T</span>
            <span className="font-black text-base tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.025em' }}>Taskora</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {[['How it Works', '#how-it-works'], ['Platforms', '#platforms'], ['Earnings', '#earnings'], ['Reviews', '#reviews']].map(([l, h]) => (
              <a key={l} href={h} className="text-sm font-semibold no-underline transition-colors hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link href={dashHref ?? '/login'} className="px-3.5 py-1.5 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
              {dashHref ? 'Dashboard' : 'Log in'}
            </Link>
            <Link href={dashHref ?? '/register'} className="bg-[#6C5CE7] hover:bg-[#5A4BD1] flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-bold no-underline transition-colors active:scale-[.98]" style={{ boxShadow: '0 2px 12px rgba(108,92,231,0.28)' }}>
              Start Earning <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center px-5 pt-20 pb-16 relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(108,92,231,0.09) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col items-center text-center gap-5 max-w-2xl hero-in">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold"
            style={{ background: 'var(--primary-muted)', borderColor: '#DDD6FE', color: 'var(--primary)' }}>
            <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--primary)' }} />
            $2.1M+ paid to our earners so far
          </div>

          <h1 className="font-black leading-[1.06] tracking-tighter" style={{ fontSize: 'clamp(2.6rem,7vw,4.8rem)', color: 'var(--text)' }}>
            Get paid for what you<br />
            <span className="gradient-text">already do online.</span>
          </h1>

          <p className="leading-relaxed max-w-lg" style={{ fontSize: 'clamp(1rem,2.2vw,1.15rem)', color: 'var(--text-secondary)' }}>
            Taskora connects you with brands who pay cash for social media actions.
            Like, follow, comment — earn in minutes, not months.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
            <Link href={dashHref ?? '/register'} className="bg-[#6C5CE7] hover:bg-[#5A4BD1] flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold no-underline transition-all hover:-translate-y-0.5 active:scale-[.98]"
              style={{ fontSize: '1rem', boxShadow: '0 8px 28px rgba(108,92,231,0.32)' }}>
              {dashHref ? 'Go to Dashboard' : <>Start Earning — It&apos;s Free <ArrowRight size={16} strokeWidth={2.5} /></>}
            </Link>
            <Link href={dashHref ?? '/login'} className="flex items-center px-7 py-3.5 rounded-2xl border-2 bg-white font-semibold no-underline transition-all hover:opacity-80"
              style={{ fontSize: '1rem', borderColor: 'var(--border)', color: 'var(--text)' }}>
              {dashHref ? 'Dashboard' : 'Sign In'}
            </Link>
          </div>

          <p className="flex flex-wrap items-center justify-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            {['No credit card required', 'Withdraw from $10', '500+ active campaigns'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={12} strokeWidth={2.5} style={{ color: 'var(--primary)' }} /> {t}
              </span>
            ))}
          </p>
        </div>

        {/* ── Dashboard Mockup ── */}
        <div className="relative z-10 w-full max-w-4xl mt-14 rounded-[18px] overflow-hidden border" style={{ borderColor: 'var(--border)', boxShadow: '0 24px 80px rgba(108,92,231,0.14), 0 4px 16px rgba(0,0,0,0.06)' }}>
          {/* Browser bar */}
          <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b" style={{ background: '#F5F4FF', borderColor: 'var(--border)' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FC6058]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEC02F]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#2ACA42]" />
            <div className="flex-1 mx-4 px-3 py-1 rounded-lg bg-white border text-center text-[0.68rem]" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              app.taskora.io/dashboard
            </div>
          </div>
          {/* App body */}
          <div className="flex min-h-[290px]" style={{ background: '#FAFBFF' }}>
            {/* Sidebar */}
            <div className="hidden sm:flex flex-col gap-1 w-40 shrink-0 p-3 bg-white border-r" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-2 mb-4 px-1">
                <div className="w-6 h-6 rounded-lg gradient-brand shrink-0" />
                <div className="h-2 w-12 rounded bg-[var(--border)]" />
              </div>
              {['Dashboard', 'Tasks', 'My Tasks', 'Wallet', 'Transactions'].map((l, i) => (
                <div key={l} className={`flex items-center gap-2 px-2.5 py-2 rounded-xl ${i === 0 ? 'bg-[var(--primary-muted)]' : ''}`}>
                  <div className={`w-3 h-3 rounded-sm shrink-0 ${i === 0 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`} />
                  <div className={`h-1.5 flex-1 rounded ${i === 0 ? 'bg-[#C7C0F7]' : 'bg-[var(--border-subtle)]'}`} />
                </div>
              ))}
            </div>
            {/* Content */}
            <div className="flex-1 p-4 flex flex-col gap-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[{ val: '$1,250', accent: true }, { val: '$3,560' }, { val: '128' }, { val: '98.5%' }].map((s, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${s.accent ? 'gradient-card border-transparent' : 'bg-white'}`} style={{ borderColor: s.accent ? 'transparent' : 'var(--border-subtle)' }}>
                    <div className={`h-1.5 w-11 rounded mb-2 ${s.accent ? 'bg-white/25' : 'bg-[var(--border)]'}`} />
                    <div className={`text-[0.7rem] font-black tracking-tight ${s.accent ? 'text-white' : ''}`} style={{ color: s.accent ? undefined : 'var(--primary)' }}>{s.val}</div>
                  </div>
                ))}
              </div>
              <div className="flex-1 rounded-xl bg-white border p-3" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="h-2 w-24 rounded bg-[var(--border)] mb-3" />
                {['Instagram Post', 'TikTok Video', 'YouTube Boost'].map((item, i) => (
                  <div key={item} className="flex items-center gap-2.5 py-1.5 border-b last:border-0" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="w-6 h-6 rounded-lg shrink-0" style={{ background: ['#FFE8F4','#F0F0F0','#FFE8E8'][i] }} />
                    <div className="flex-1 h-1.5 rounded bg-[var(--border-subtle)]" />
                    <div className="w-16 h-1 rounded-full bg-[var(--border)] overflow-hidden">
                      <div className="h-full gradient-brand rounded-full" style={{ width: `${[55,38,70][i]}%` }} />
                    </div>
                    <span className="text-[0.6rem] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#EEF2FF', color: 'var(--primary)' }}>Live</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y bg-white py-10 px-5" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1 text-center">
              <span className="font-black leading-none tracking-tighter" style={{ fontSize: 'clamp(1.9rem,4.5vw,2.8rem)', color: 'var(--primary)' }}>{s.value}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platforms ── */}
      <motion.section id="platforms" className="py-20 px-5" style={{ background: '#FAFBFF' }}
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-2.5">
            <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Supported Platforms</span>
            <h2 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', color: 'var(--text)' }}>
              Earn from every platform<br />you already use
            </h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {PLATFORMS.map(p => (
              <div key={p.label} className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: p.bg, color: p.color }}>
                <p.Icon size={17} />
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── How it works — card style ── */}
      <motion.section id="how-it-works" className="py-20 px-5" style={{ background: '#F8F9FE' }}
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-3">
            <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>How it works</span>
            <h2 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', color: 'var(--text)' }}>
              Three simple steps
            </h2>
            <p className="text-sm max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              Start earning from social media tasks in minutes. No complex setup, no experience needed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                step: 1,
                Icon: Users,
                title: 'Create your account',
                desc: 'Sign up free in 30 seconds. No credit card needed.',
                img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80&fit=crop',
              },
              {
                step: 2,
                Icon: Target,
                title: 'Browse & pick tasks',
                desc: 'Choose from hundreds of active tasks across all major platforms.',
                img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fit=crop',
              },
              {
                step: 3,
                Icon: Banknote,
                title: 'Complete & get paid',
                desc: 'Submit proof, get approved, and withdraw from $10 anytime.',
                img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80&fit=crop',
              },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl overflow-hidden border flex flex-col" style={{ borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                {/* Top row: step badge + icon */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                  <span className="w-8 h-8 rounded-full bg-[#6C5CE7] text-white text-sm font-black flex items-center justify-center">
                    {s.step}
                  </span>
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary-muted)', color: '#6C5CE7' }}>
                    <s.Icon size={18} strokeWidth={1.8} />
                  </span>
                </div>
                {/* Screenshot */}
                <div className="mx-4 rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border-subtle)' }}>
                  <img src={s.img} alt={s.title} className="w-full object-cover" style={{ height: 150 }} />
                </div>
                {/* Text */}
                <div className="px-5 py-4 flex flex-col gap-1">
                  <h3 className="font-black text-[0.95rem] tracking-tight" style={{ color: 'var(--text)' }}>{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Features ── */}
      <motion.section id="earnings" className="py-20 px-5" style={{ background: '#FAFBFF' }}
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-2.5">
            <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Why Taskora</span>
            <h2 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', color: 'var(--text)' }}>
              Everything you need<br />to maximize earnings.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {/* Hero feature — spans 2 cols on lg */}
            {(() => { const HeroIcon = FEATURES[0].Icon; return (
            <div className="lg:col-span-2 p-6 rounded-[18px] border flex flex-col sm:flex-row gap-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)', borderColor: '#DDD6FE' }}>
              <span className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: '#6C5CE7', color: 'white' }}>
                <HeroIcon size={22} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="font-black text-[1.05rem] tracking-tight mb-1" style={{ color: 'var(--text)' }}>{FEATURES[0].title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{FEATURES[0].desc}</p>
              </div>
            </div>
            ); })()}
            {/* Remaining 5 features */}
            {FEATURES.slice(1).map((f, i) => (
              <div key={i} className="p-6 rounded-[18px] border bg-white flex flex-col gap-2.5 transition-all hover:shadow-lg hover:-translate-y-0.5" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                  <f.Icon size={19} strokeWidth={1.8} />
                </span>
                <h3 className="font-black text-[0.95rem] tracking-tight" style={{ color: 'var(--text)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Who it's for — Earners vs Advertisers ── */}
      <motion.section className="py-20 px-5 bg-white"
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-2.5">
            <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Built for everyone</span>
            <h2 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', color: 'var(--text)' }}>
              Whether you earn or grow
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Earners */}
            <div className="rounded-2xl p-7 flex flex-col gap-5 border border-[#DDD6FE]" style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #EEF2FF 100%)' }}>
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-[#6C5CE7] flex items-center justify-center text-white shrink-0">
                  <Users size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-black text-lg tracking-tight" style={{ color: 'var(--text)' }}>For Earners</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Make money completing tasks</p>
                </div>
              </div>
              <ul className="flex flex-col gap-2.5">
                {[
                  'Browse 500+ active tasks daily',
                  'Earn $2–$10 per completed task',
                  'Get paid via bank transfer',
                  'Work from anywhere, anytime',
                  'No experience or skills required',
                ].map(t => (
                  <li key={t} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Check size={14} strokeWidth={2.5} style={{ color: '#6C5CE7', flexShrink: 0 }} />
                    {t}
                  </li>
                ))}
              </ul>
              <Link href={dashHref ?? '/register'}
                className="bg-[#6C5CE7] hover:bg-[#5A4BD1] flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold no-underline transition-colors mt-auto">
                Start Earning <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>

            {/* Advertisers */}
            <div className="rounded-2xl p-7 flex flex-col gap-5 border" style={{ background: '#FAFBFF', borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--primary-muted)', color: '#6C5CE7' }}>
                  <Megaphone size={22} strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-black text-lg tracking-tight" style={{ color: 'var(--text)' }}>For Advertisers</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Grow your social presence</p>
                </div>
              </div>
              <ul className="flex flex-col gap-2.5">
                {[
                  'Real engagement from real people',
                  'Set your own reward per task',
                  'Full control over task requirements',
                  'Pay only for verified completions',
                  'Scale from 10 to 10,000 tasks',
                ].map(t => (
                  <li key={t} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <Check size={14} strokeWidth={2.5} style={{ color: '#6C5CE7', flexShrink: 0 }} />
                    {t}
                  </li>
                ))}
              </ul>
              <Link href={dashHref ?? '/register'}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold no-underline transition-colors border-2 mt-auto"
                style={{ borderColor: '#6C5CE7', color: '#6C5CE7' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                Create a Campaign <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Testimonials — user quotes ── */}
      <motion.section id="reviews" className="py-20 px-5" style={{ background: '#F8F9FE' }}
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
        <div className="max-w-4xl mx-auto flex flex-col gap-12">
          <div className="flex flex-col items-center text-center gap-2.5">
            <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Real Earners</span>
            <h2 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', color: 'var(--text)' }}>
              What our earners say
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="p-6 rounded-2xl border bg-white flex flex-col gap-4" style={{ borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#FDCB6E" stroke="none" />)}
                </div>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="w-9 h-9 rounded-full bg-[#6C5CE7] flex items-center justify-center text-white text-sm font-black shrink-0">{t.name[0]}</span>
                  <div>
                    <p className="text-sm font-bold leading-tight" style={{ color: 'var(--text)' }}>{t.name}</p>
                    <p className="text-xs flex items-center gap-1.5 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {t.role}
                      <span className="font-bold" style={{ color: '#00875A' }}>· Earned {t.earnings}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── FAQ ── */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-3xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col items-center text-center gap-2.5">
            <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>FAQ</span>
            <h2 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.75rem)', color: 'var(--text)' }}>
              Common questions
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {FAQ.map((item, i) => (
              <div key={i} className="border rounded-2xl overflow-hidden transition-all" style={{ borderColor: faqOpen === i ? '#DDD6FE' : 'var(--border-subtle)' }}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[var(--bg)]"
                >
                  <span className="font-bold text-sm pr-4" style={{ color: 'var(--text)' }}>{item.q}</span>
                  <span className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-transform"
                    style={{ background: faqOpen === i ? '#EEF2FF' : 'var(--border-subtle)', color: '#6C5CE7', transform: faqOpen === i ? 'rotate(45deg)' : 'none' }}>
                    <Plus size={14} strokeWidth={2.5} />
                  </span>
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
                    <p className="pt-3">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-5 relative overflow-hidden" style={{ background: 'var(--dark)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(108,92,231,0.25) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto text-center flex flex-col items-center gap-5">
          <h2 className="text-white font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(2rem,5vw,3.2rem)' }}>
            Ready to start earning today?
          </h2>
          <p className="leading-relaxed max-w-md" style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.55)' }}>
            Free to join. No experience needed. Hundreds of campaigns waiting for you right now.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-1">
            <Link href={dashHref ?? '/register'}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white font-black no-underline transition-all hover:opacity-95 hover:-translate-y-0.5 active:scale-[.98]"
              style={{ color: '#6C5CE7', fontSize: '0.95rem', boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
              {dashHref ? 'Go to Dashboard' : <>Create Free Account <ArrowRight size={16} strokeWidth={2.5} /></>}
            </Link>
            {!dashHref && (
              <Link href="/login"
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold no-underline transition-all hover:bg-white/10"
                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', border: '1.5px solid rgba(255,255,255,0.18)' }}>
                Sign In
              </Link>
            )}
          </div>
          <p className="text-xs tracking-wide" style={{ color: 'rgba(255,255,255,0.3)' }}>No credit card · Withdraw from $10 · Cancel anytime</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-5 border-t" style={{ background: 'var(--dark-2)', borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {/* Top row */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            <div className="flex flex-col gap-3">
              <Link href="/" className="flex items-center gap-2.5 no-underline">
                <span className="gradient-brand w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black">T</span>
                <span className="font-black text-sm tracking-tight" style={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.025em' }}>Taskora</span>
              </Link>
              <p className="text-xs max-w-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                The #1 platform for earning real cash by completing social media tasks. Free to join, fast to withdraw.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-3 text-xs">
              {[
                { label: 'Product', links: [['How it Works', '#how-it-works'], ['Platforms', '#platforms'], ['Earnings', '#earnings']] },
                { label: 'Company', links: [['About', '/about'], ['Contact', '/contact'], ['Careers', '/careers']] },
                { label: 'Legal', links: [['Privacy', '/privacy'], ['Terms', '/terms'], ['FAQ', '/help']] },
              ].map(col => (
                <div key={col.label} className="flex flex-col gap-2">
                  <p className="font-bold uppercase tracking-widest text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.35)' }}>{col.label}</p>
                  {col.links.map(([label, href]) => (
                    <Link key={label} href={href} className="no-underline transition-opacity hover:opacity-80" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>© {new Date().getFullYear()} Taskora. All rights reserved.</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>Made with ♥ for earners worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
