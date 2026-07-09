import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — Taskora',
  description: 'The rules and conditions for using the Taskora platform.',
};

const SECTIONS = [
  { title: '1. Acceptance of Terms', body: 'By creating an account or using Taskora, you agree to these Terms of Service. If you do not agree, do not use the platform. We may update these terms periodically — continued use after changes constitutes acceptance.' },
  { title: '2. Eligibility', body: 'You must be at least 18 years old to use Taskora. By registering, you confirm that you are 18 or older and that the information you provide is accurate.' },
  { title: '3. Account Responsibility', body: 'You are responsible for maintaining the security of your account credentials. Do not share your password. You are responsible for all activity under your account. Notify us immediately at support@taskora.io if you suspect unauthorized access.' },
  { title: '4. Earner Rules', body: 'As an earner, you agree to: submit genuine proof of task completion; not use bots, scripts, or automated tools; not create multiple accounts; complete tasks honestly and as described. Violations may result in submission rejection, wallet holds, or permanent account suspension without refund.' },
  { title: '5. Campaign Creator Rules', body: 'As a campaign creator, you agree to: only post campaigns for legitimate purposes; not request illegal, harmful, or misleading actions from earners; ensure your campaigns comply with the terms of service of the target platform (Instagram, TikTok, etc.). Campaign budgets are deducted from your wallet upfront. Taskora does not refund unused campaign budgets for completed campaigns.' },
  { title: '6. Payments and Withdrawals', body: 'Wallet balances represent earned rewards held on your behalf. Withdrawals are processed manually and typically within 24 hours. The minimum withdrawal is ₦500. Taskora reserves the right to hold withdrawals pending verification for fraud prevention. Fraudulently obtained earnings will be reversed.' },
  { title: '7. Prohibited Content', body: 'You may not use Taskora to promote: illegal products or services; violence, hate speech, or discrimination; adult content; spam or phishing. Campaigns violating this will be removed without notice and associated balances may be forfeited.' },
  { title: '8. Intellectual Property', body: 'Taskora and its content are owned by Taskora and its licensors. You may not copy, reproduce, or distribute any part of the platform without written permission. Your submitted content (proof images, etc.) remains yours, but you grant Taskora a license to store and use it to operate the service.' },
  { title: '9. Limitation of Liability', body: 'Taskora is provided "as is". We do not guarantee uninterrupted service or that all submissions will be approved. We are not liable for indirect, incidental, or consequential damages arising from your use of the platform. Our total liability to you shall not exceed the amount you have withdrawn from the platform in the 90 days prior to any claim.' },
  { title: '10. Termination', body: 'We may suspend or terminate your account at any time for violation of these terms. You may close your account at any time from Settings. On termination, pending balances from fraudulent activity are forfeited. Legitimate earned balances will be paid out.' },
  { title: '11. Governing Law', body: 'These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in Nigerian courts.' },
  { title: '12. Contact', body: 'For legal questions or concerns, email legal@taskora.io.' },
];

export default function TermsPage() {
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

      <main className="flex-1 px-5 py-16">
        <div className="max-w-2xl mx-auto flex flex-col gap-10">

          <div className="flex flex-col gap-3">
            <span className="text-[0.7rem] font-black uppercase tracking-widest" style={{ color: 'var(--primary)' }}>Legal</span>
            <h1 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: 'var(--text)' }}>Terms of Service</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: July 2026</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Please read these terms carefully before using the Taskora platform. By registering or using Taskora, you agree to be bound by these terms.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {SECTIONS.map(s => (
              <div key={s.title} className="flex flex-col gap-2">
                <h2 className="font-black text-base tracking-tight" style={{ color: 'var(--text)' }}>{s.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.body}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-6 flex flex-col gap-2 border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--primary-muted)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Legal questions?</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email <a href="mailto:legal@taskora.io" style={{ color: 'var(--primary)', fontWeight: 700 }}>legal@taskora.io</a> and we&apos;ll get back to you promptly.</p>
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-xs" style={{ background: 'var(--dark-2)', color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        © {new Date().getFullYear()} Taskora ·{' '}
        <Link href="/privacy" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy</Link>
        {' · '}
        <Link href="/contact" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Contact</Link>
      </footer>
    </div>
  );
}
