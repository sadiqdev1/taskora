'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { apiPost } from '@/lib/api';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function fmtNGN(n) {
  return '₦' + parseFloat(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 });
}

/* ── Inner component uses useSearchParams — must be inside Suspense ── */
function CallbackHandler() {
  const searchParams = useSearchParams();
  const [status,  setStatus]  = useState('verifying');
  const [amount,  setAmount]  = useState(null);
  const [ref,     setRef]     = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (!reference) {
      setStatus('failed');
      setMessage('No payment reference found.');
      return;
    }
    setRef(reference);
    apiPost('/deposit/verify', { reference })
      .then((data) => { setAmount(data.amount_credited); setStatus('success'); })
      .catch((err) => {
        setStatus('failed');
        setMessage(err?.message || 'Payment verification failed. Contact support with ref: ' + reference);
      });
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto flex flex-col items-center justify-center gap-6 py-16">

      {status === 'verifying' && (
        <>
          <Loader2 size={48} className="animate-spin" style={{ color: '#6C5CE7' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Verifying your payment…
          </p>
        </>
      )}

      {status === 'success' && (
        <div className="card rounded-2xl p-8 flex flex-col items-center gap-4 text-center w-full">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#D4F6EE' }}>
            <CheckCircle2 size={32} strokeWidth={1.8} style={{ color: '#00875A' }} />
          </div>
          <h2 className="font-black text-xl" style={{ color: 'var(--text)' }}>Deposit Successful!</h2>
          {amount && (
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {fmtNGN(amount)} has been added to your wallet.
            </p>
          )}
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Ref: {ref}</p>
          <div className="flex gap-3 mt-2 w-full">
            <Link href="/wallet/deposit"
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-[var(--bg)] text-center no-underline"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              Deposit More
            </Link>
            <Link href="/wallet"
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] transition-colors text-center no-underline">
              View Wallet
            </Link>
          </div>
        </div>
      )}

      {status === 'failed' && (
        <div className="card rounded-2xl p-8 flex flex-col items-center gap-4 text-center w-full">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#FFF0F0' }}>
            <XCircle size={32} strokeWidth={1.8} style={{ color: '#C0392B' }} />
          </div>
          <h2 className="font-black text-xl" style={{ color: 'var(--text)' }}>Payment Failed</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{message}</p>
          {ref && <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Ref: {ref}</p>}
          <Link href="/wallet/deposit"
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-[#6C5CE7] hover:bg-[#5A4BD1] transition-colors text-center no-underline mt-2">
            Try Again
          </Link>
        </div>
      )}
    </div>
  );
}

/* ── Page wraps CallbackHandler in Suspense — required by Next.js ── */
export default function DepositCallbackPage() {
  return (
    <DashboardLayout title="Payment Status" subtitle="Verifying your deposit">
      <Suspense fallback={
        <div className="max-w-md mx-auto flex flex-col items-center justify-center gap-4 py-16">
          <Loader2 size={48} className="animate-spin" style={{ color: '#6C5CE7' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Loading…</p>
        </div>
      }>
        <CallbackHandler />
      </Suspense>
    </DashboardLayout>
  );
}
