'use client';

import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Tag, ExternalLink, CheckCircle2, XCircle, AlertCircle,
  Mail, CreditCard, Cloud, Gift, DollarSign, ChevronRight,
} from 'lucide-react';

/* ── Reusable row inside a settings card ── */
function SettingRow({ label, value, hint, status, action, last }) {
  return (
    <div className="flex items-start gap-4 py-4"
      style={{ borderBottom: last ? 'none' : '1px solid var(--border-subtle)' }}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{label}</p>
        {value && (
          <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-secondary)' }}>{value}</p>
        )}
        {hint && (
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{hint}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0 mt-0.5">
        {status === 'ok' && (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: '#D4F6EE', color: '#00875A' }}>
            <CheckCircle2 size={11} strokeWidth={2.5} /> Active
          </span>
        )}
        {status === 'warn' && (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: '#FFF3D6', color: '#B45309' }}>
            <AlertCircle size={11} strokeWidth={2.5} /> Needs setup
          </span>
        )}
        {status === 'off' && (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: '#FFE0E0', color: '#C0392B' }}>
            <XCircle size={11} strokeWidth={2.5} /> Not set
          </span>
        )}
        {action}
      </div>
    </div>
  );
}

/* ── Section card matching the app's card system ── */
function SettingCard({ icon: Icon, title, desc, children }) {
  return (
    <div className="card rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
          <Icon size={16} strokeWidth={2} />
        </span>
        <div>
          <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{title}</h2>
          {desc && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>}
        </div>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <DashboardLayout title="Settings" subtitle="Platform configuration and integration status" adminOnly>
      <div className="flex flex-col gap-5">

        {/* ── Task Pricing ── */}
        <SettingCard icon={Tag} title="Task Pricing"
          desc="Prices charged to campaign creators per completed task">
          <SettingRow
            label="Task types catalogue"
            value="43 active types across Instagram, TikTok, YouTube, Twitter, Facebook and more"
            hint="Prices are stored in the database. Changes apply immediately with no redeploy."
            status="ok"
            action={
              <Link href="/admin/task-types"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold no-underline transition-colors"
                style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                Manage <ChevronRight size={13} strokeWidth={2.5} />
              </Link>
            }
            last
          />
        </SettingCard>

        {/* ── Payments ── */}
        <SettingCard icon={CreditCard} title="Payments — Paystack"
          desc="Handles NGN deposits from campaign creators">
          <SettingRow
            label="API key"
            value="sk_test_9d85…4171a4"
            hint="Currently in test mode. Switch to a live key (sk_live_…) in .env before going to production."
            status="warn"
            action={
              <a href="https://dashboard.paystack.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold no-underline"
                style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                Dashboard <ExternalLink size={11} strokeWidth={2.5} />
              </a>
            }
          />
          <SettingRow
            label="Minimum withdrawal"
            value="₦500"
            hint="Enforced in WalletController. Change the min:500 validation rule to adjust."
          />
          <SettingRow
            label="Withdrawal processing"
            value="Manual — admin reviews each request in the Withdrawals tab"
            last
          />
        </SettingCard>

        {/* ── Email ── */}
        <SettingCard icon={Mail} title="Email — Resend"
          desc="Sends verification, welcome, and withdrawal update emails">
          <SettingRow
            label="Resend API key"
            value="re_R6v4PDYe_…KpkK"
            status="ok"
            hint="Key is valid and connected."
          />
          <SettingRow
            label="Sender domain — taskora.io"
            status="warn"
            hint="Domain not yet verified. Emails send from onboarding@resend.dev. Add DNS records at resend.com/domains then set RESEND_DOMAIN_VERIFIED=true in .env."
            action={
              <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold no-underline whitespace-nowrap"
                style={{ background: '#FFF3D6', color: '#B45309' }}>
                Verify <ExternalLink size={11} strokeWidth={2.5} />
              </a>
            }
            last
          />
        </SettingCard>

        {/* ── Media ── */}
        <SettingCard icon={Cloud} title="Media — Cloudinary"
          desc="Stores user avatars and task proof screenshots">
          <SettingRow
            label="Cloud name"
            value="ded2cmpkx"
            hint="Avatar uploads and proof images go to Cloudinary with local storage fallback."
            status="ok"
          />
          <SettingRow
            label="Proof image max size"
            value="5 MB (jpg, jpeg, png, webp, gif)"
            hint="Change max:5120 in CampaignController submit validation to adjust."
            last
          />
        </SettingCard>

        {/* ── Referrals ── */}
        <SettingCard icon={Gift} title="Referral Program">
          <SettingRow
            label="Signup bonus"
            value="₦5 per verified referral"
            hint="Paid when the referred user verifies their email. Hardcoded in AuthController::verifyEmail."
            status="ok"
          />
          <SettingRow
            label="Ongoing bonus"
            value="One-time ₦5 only"
            hint="The landing page mentions '10% of earnings forever' but the backend pays a one-time ₦5. Update the copy or implement percentage-based bonuses in reviewSubmission()."
            status="warn"
            last
          />
        </SettingCard>

        {/* ── Platform limits ── */}
        <SettingCard icon={DollarSign} title="Platform Limits"
          desc="Hardcoded values — change in the corresponding controller or migration">
          <SettingRow label="Max campaign slots"     value="10,000 per campaign"           hint="CampaignController userStore — max:10000" />
          <SettingRow label="Min withdrawal"         value="₦500"                          hint="WalletController withdraw — min:500" />
          <SettingRow label="Max wallet balance"     value="₦99,999,999.99"                hint="users table decimal(10,2)" />
          <SettingRow label="Submission limit"       value="1 per campaign per user"       hint="Unique constraint on (user_id, campaign_id)" />
          <SettingRow label="Avatar max size"        value="2 MB"                          hint="AuthController updateProfile — max:2048" />
          <SettingRow label="Rate limit — login"     value="10 requests / minute"          hint="AppServiceProvider throttle:auth" />
          <SettingRow label="Rate limit — tasks"     value="20 submissions / minute"       hint="AppServiceProvider throttle:task-submit" last />
        </SettingCard>

      </div>
    </DashboardLayout>
  );
}
