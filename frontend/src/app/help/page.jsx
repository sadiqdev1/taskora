import Link from 'next/link';
import { ArrowRight, CheckCircle2, DollarSign, ShieldCheck, Smartphone, Users, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'Help Center — Taskora',
  description: 'Answers to common questions about earning, withdrawals, and using Taskora.',
};

const CATEGORIES = [
  {
    Icon: CheckCircle2, color: '#00875A', bg: '#D4F6EE',
    title: 'Getting Started',
    faqs: [
      { q: 'How do I start earning?', a: 'Create a free account, browse the Tasks page, pick a campaign that interests you, complete the action (follow, like, comment etc.), take a screenshot proof, and submit it. Once approved your wallet is credited instantly.' },
      { q: 'Is Taskora really free?', a: 'Yes, 100% free. No subscription, no credit card required to earn. You only pay when you create campaigns as an advertiser.' },
      { q: 'How long does task approval take?', a: 'Most tasks are reviewed within 24 hours. You\'ll receive a notification as soon as your submission is approved or rejected.' },
      { q: 'How do I verify my email?', a: 'Check your inbox for an email from Taskora after registration. Click the verification link. If you don\'t see it, go to Settings and click Resend Verification.' },
    ],
  },
  {
    Icon: DollarSign, color: '#6C5CE7', bg: '#EEF2FF',
    title: 'Payments & Withdrawals',
    faqs: [
      { q: 'What is the minimum withdrawal?', a: 'You need at least ₦500 in your wallet to withdraw. There is no maximum.' },
      { q: 'How do I add my bank account?', a: 'Go to Wallet → Bank Account → Add Bank. Select your bank, enter your 10-digit account number, and we\'ll automatically verify your account name via Paystack.' },
      { q: 'How long do withdrawals take?', a: 'Withdrawals are processed manually by our team within 24 hours on business days.' },
      { q: 'My withdrawal was rejected — why?', a: 'Rejections usually happen due to unverified bank details or suspected fraudulent activity. Check the rejection reason in your Transactions page and contact support if you believe it\'s an error.' },
      { q: 'How do I deposit funds to create campaigns?', a: 'Go to Wallet → Deposit. We use Paystack for secure NGN deposits. Minimum deposit is ₦100.' },
    ],
  },
  {
    Icon: Smartphone, color: '#B45309', bg: '#FFF3D6',
    title: 'Tasks & Campaigns',
    faqs: [
      { q: 'What counts as valid proof?', a: 'A clear screenshot showing you completed the action — your username must be visible. For follow tasks, show that you\'re following the account. For comment tasks, show your comment on the post.' },
      { q: 'Why was my submission rejected?', a: 'Common reasons: blurry screenshot, username not visible, wrong account, or the action wasn\'t completed as instructed. Re-read the task instructions carefully before resubmitting.' },
      { q: 'Can I do the same task twice?', a: 'No, each campaign allows one submission per user.' },
      { q: 'How do I create my own campaign?', a: 'Go to Tasks → Create Task. Select a task type, enter your target link, set the number of participants, and your budget is automatically calculated and deducted from your wallet.' },
      { q: 'Can I pause or cancel a campaign?', a: 'Campaigns can be paused from the admin area. Contact support to cancel a campaign — note that budgets for already-completed slots are not refundable.' },
    ],
  },
  {
    Icon: Users, color: '#0369A1', bg: '#E0F0FF',
    title: 'Referrals',
    faqs: [
      { q: 'How does the referral program work?', a: 'Share your referral link from the Referrals page. When someone signs up using your link and verifies their email, you earn a ₦5 bonus.' },
      { q: 'Where do I find my referral link?', a: 'Go to Referrals in the sidebar. Your unique link is displayed there — copy it and share anywhere.' },
      { q: 'Is there a limit on referral earnings?', a: 'No limit. Refer as many friends as you want.' },
    ],
  },
  {
    Icon: ShieldCheck, color: '#C0392B', bg: '#FFE0E0',
    title: 'Account & Security',
    faqs: [
      { q: 'How do I change my password?', a: 'Go to Settings → Change Password. Enter your current password, then your new password twice.' },
      { q: 'I forgot my password — what do I do?', a: 'Click "Forgot password" on the login page. We\'ll send a reset link to your registered email address.' },
      { q: 'Can I delete my account?', a: 'Yes, go to Settings → Danger Zone → Delete Account. This is permanent and cannot be undone. Any remaining wallet balance must be withdrawn first.' },
      { q: 'Why is my account suspended?', a: 'Accounts are suspended for violations of our Terms of Service — typically fraud, fake submissions, or bot usage. Email support@taskora.io with your account details to appeal.' },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFBFF', color: 'var(--text)', fontFamily: 'var(--font-jakarta)' }}>

      <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40 }}>
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <span className="gradient-brand w-8 h-8 rounded-[10px] flex items-center justify-center text-white text-sm font-black">T</span>
          <span className="font-black text-base tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.025em' }}>Taskora</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/contact" className="px-3.5 py-1.5 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-80" style={{ color: 'var(--text-secondary)' }}>
            Contact
          </Link>
          <Link href="/register" className="bg-[#6C5CE7] hover:bg-[#5A4BD1] flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-bold no-underline transition-colors">
            Start Earning <ArrowRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </nav>

      <main className="flex-1">

        {/* Hero */}
        <section className="relative overflow-hidden px-5 py-20 flex flex-col items-center text-center gap-5">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(108,92,231,0.09) 0%, transparent 70%)' }} />
          <div className="relative z-10 max-w-xl flex flex-col items-center gap-4">
            <span className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
              <HelpCircle size={28} strokeWidth={1.5} />
            </span>
            <h1 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', color: 'var(--text)' }}>
              Help Center
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Find answers to common questions about earning, withdrawals, and managing your account.
            </p>
          </div>
        </section>

        {/* FAQ sections */}
        <section className="px-5 pb-24">
          <div className="max-w-3xl mx-auto flex flex-col gap-12">
            {CATEGORIES.map(cat => (
              <div key={cat.title} className="flex flex-col gap-5">
                {/* Category header */}
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: cat.bg, color: cat.color }}>
                    <cat.Icon size={17} strokeWidth={2} />
                  </span>
                  <h2 className="font-black text-lg tracking-tight" style={{ color: 'var(--text)' }}>{cat.title}</h2>
                </div>

                {/* FAQs */}
                <div className="flex flex-col gap-3">
                  {cat.faqs.map((f, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 flex flex-col gap-2 border"
                      style={{ borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
                      <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{f.q}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Still stuck CTA */}
        <section className="px-5 pb-24" style={{ background: '#F8F9FE' }}>
          <div className="max-w-2xl mx-auto py-16 flex flex-col items-center gap-5 text-center">
            <h2 className="font-black tracking-tighter" style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', color: 'var(--text)' }}>
              Still can&apos;t find your answer?
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Our support team is available via email and usually responds within 24 hours.
            </p>
            <Link href="/contact"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold no-underline transition-all bg-[#6C5CE7] hover:bg-[#5A4BD1] hover:-translate-y-0.5"
              style={{ boxShadow: '0 8px 24px rgba(108,92,231,0.28)' }}>
              Contact Support <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="px-6 py-6 text-center text-xs" style={{ background: 'var(--dark-2)', color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        © {new Date().getFullYear()} Taskora ·{' '}
        <Link href="/privacy" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy</Link>
        {' · '}
        <Link href="/terms" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms</Link>
        {' · '}
        <Link href="/contact" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Contact</Link>
      </footer>
    </div>
  );
}
