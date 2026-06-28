'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import Link from 'next/link';
import { Copy, CheckCircle2, ArrowLeft, Building2 } from 'lucide-react';

const ACCOUNT = {
  bank:   'Taskora Payments Ltd',
  number: '0123456789',
  name:   'Taskora User Wallet',
};

export default function DepositPage() {
  const [copied, setCopied] = useState(false);

  function copyAccountNumber() {
    navigator.clipboard.writeText(ACCOUNT.number).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <DashboardLayout title="Deposit Funds">
      <div className="max-w-lg mx-auto flex flex-col gap-5">

        {/* Instructions card */}
        <div className="card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: '#EEF2FF', color: '#6C5CE7' }}>
              <Building2 size={20} strokeWidth={1.8} />
            </span>
            <div>
              <h2 className="font-bold text-base" style={{ color: 'var(--text)' }}>Bank Transfer</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Instant wallet top-up</p>
            </div>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Transfer to the account below to top up your wallet. Your balance updates automatically within minutes.
          </p>
        </div>

        {/* Account details card */}
        <div className="card rounded-2xl p-6">
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--text)' }}>Bank Account Details</h3>

          <div className="flex flex-col gap-4"
            style={{ background: 'var(--bg)', borderRadius: 14, padding: '20px', border: '1.5px solid var(--border)' }}>

            {/* Bank */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Bank</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{ACCOUNT.bank}</span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--border-subtle)' }} />

            {/* Account Number */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Account Number</span>
                <span className="text-lg font-black tracking-wider" style={{ color: 'var(--text)', letterSpacing: '0.06em' }}>
                  {ACCOUNT.number}
                </span>
              </div>
              <button
                onClick={copyAccountNumber}
                title="Copy account number"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0"
                style={copied
                  ? { background: '#D4F6EE', color: '#00875A', border: '1.5px solid #A8E8D8' }
                  : { background: '#EEF2FF', color: '#6C5CE7', border: '1.5px solid #C7D2FE' }}>
                {copied
                  ? <><CheckCircle2 size={13} strokeWidth={2.5} /> Copied!</>
                  : <><Copy size={13} strokeWidth={2} /> Copy</>
                }
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'var(--border-subtle)' }} />

            {/* Account Name */}
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Account Name</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{ACCOUNT.name}</span>
            </div>
          </div>
        </div>

        {/* Reference note */}
        <div className="flex items-start gap-3 px-5 py-4 rounded-2xl text-sm"
          style={{ background: '#FFF8E6', color: '#92400E', border: '1px solid #FDE68A' }}>
          <span className="text-base leading-none mt-0.5">💡</span>
          <span>
            <strong>Important:</strong> Use your registered email as payment reference to ensure your wallet is credited automatically.
          </span>
        </div>

        {/* Back link */}
        <div className="flex justify-start">
          <Link href="/wallet"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1.5px solid var(--border)' }}>
            <ArrowLeft size={14} strokeWidth={2} />
            View Wallet
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}
