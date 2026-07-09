import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — Taskora',
  description: 'How Taskora collects, uses, and protects your personal data.',
};

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `When you register, we collect your name, email address, and password. When you add a bank account for withdrawals, we store your bank name, account number, and account holder name. When you submit task proof, we store the screenshot you upload. We may also collect your IP address and device type for security purposes.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `We use your information to operate the platform: verify your identity, process task submissions, credit your wallet, and send withdrawal payments to your bank account. We send transactional emails (verification, welcome, withdrawal updates) via Resend. We do not sell your personal data to third parties.`,
  },
  {
    title: '3. Payment Data',
    body: `Deposits are processed through Paystack. We do not store your card details — these are handled entirely by Paystack on their PCI-DSS compliant infrastructure. Bank account details for withdrawals are stored in encrypted form in our database and used solely for processing withdrawals you initiate.`,
  },
  {
    title: '4. Image Storage',
    body: `Proof screenshots and avatars are uploaded to Cloudinary, a third-party cloud storage provider. Images are stored securely and are not publicly indexed. You can request deletion of your images at any time by contacting support.`,
  },
  {
    title: '5. Data Retention',
    body: `We retain your account data for as long as your account is active. If you delete your account, your personal information is removed from our systems within 30 days. Transaction records may be retained for up to 7 years for financial compliance purposes.`,
  },
  {
    title: '6. Your Rights',
    body: `You have the right to access, correct, or delete your personal data at any time. You can update your name and avatar in Settings. To request a full data export or account deletion, email privacy@taskora.io.`,
  },
  {
    title: '7. Cookies',
    body: `We use only essential session cookies required for authentication. We do not use advertising or tracking cookies. You can disable cookies in your browser settings but this will prevent you from logging in.`,
  },
  {
    title: '8. Security',
    body: `All data is transmitted over HTTPS. Passwords are hashed using bcrypt. Sanctum API tokens are stored securely and expire after 30 days. We conduct security reviews regularly and respond to vulnerabilities responsibly.`,
  },
  {
    title: '9. Changes to This Policy',
    body: `We may update this policy periodically. Material changes will be notified via email. Continued use of the platform after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: '10. Contact',
    body: `For privacy-related questions or data requests, email privacy@taskora.io. We aim to respond within 5 business days.`,
  },
];

export default function PrivacyPage() {
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
            <h1 className="font-black leading-tight tracking-tighter" style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: 'var(--text)' }}>Privacy Policy</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: July 2026</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              This policy explains how Taskora ("we", "us", "our") collects, uses, and protects your personal information when you use our platform.
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
            <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Questions about your data?</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Email <a href="mailto:privacy@taskora.io" style={{ color: 'var(--primary)', fontWeight: 700 }}>privacy@taskora.io</a> and we&apos;ll get back to you within 5 business days.</p>
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 text-center text-xs" style={{ background: 'var(--dark-2)', color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        © {new Date().getFullYear()} Taskora ·{' '}
        <Link href="/terms" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms</Link>
        {' · '}
        <Link href="/contact" className="hover:opacity-80 no-underline" style={{ color: 'rgba(255,255,255,0.4)' }}>Contact</Link>
      </footer>
    </div>
  );
}
