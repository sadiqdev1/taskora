'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Search, Plus, Minus, DollarSign, Megaphone, Users, ShieldCheck, Mail } from 'lucide-react';

const FAQ = [
  {
    category: 'Earnings & Payments',
    Icon: DollarSign,
    items: [
      { q: 'How do I earn money on Taskora?',                 a: 'Browse active campaigns, complete the required action (like, follow, comment, etc.), submit your proof, and get paid once approved by our team.' },
      { q: 'When do I get paid after task approval?',         a: 'Earnings are credited to your wallet instantly upon approval. You can withdraw any time once you reach the $10 minimum.' },
      { q: 'What is the minimum withdrawal amount?',          a: 'The minimum withdrawal is $10. You can withdraw via PayPal, bank transfer, or crypto.' },
      { q: 'How long do withdrawals take?',                   a: 'Withdrawals are processed within 24 hours on business days.' },
    ],
  },
  {
    category: 'Tasks & Campaigns',
    Icon: Megaphone,
    items: [
      { q: 'How do I submit proof for a task?',               a: 'After completing the task, go to the campaign page and submit the URL of your action or a screenshot link as proof.' },
      { q: 'Why was my submission rejected?',                  a: 'Submissions may be rejected if the proof does not clearly show completion, or if the action was reversed after submission.' },
      { q: 'Can I redo a rejected task?',                     a: 'Yes — go to My Tasks, find the rejected submission, and click Retry to resubmit with updated proof.' },
      { q: 'How many tasks can I complete per day?',          a: 'There is no daily limit. You can complete as many tasks as are available across all active campaigns.' },
    ],
  },
  {
    category: 'Referrals',
    Icon: Users,
    items: [
      { q: 'How does the referral program work?',             a: 'Share your unique referral link. When someone signs up using it, you both earn a $5 bonus. You also earn 10% of their earnings for life.' },
      { q: 'Where do I find my referral link?',               a: 'Go to the Referrals page in your dashboard. Your unique link and code are displayed at the top.' },
    ],
  },
  {
    category: 'Account & Security',
    Icon: ShieldCheck,
    items: [
      { q: 'How do I verify my account?',                     a: 'Account verification is done by our team after your first successful task. Verified accounts get faster withdrawal processing.' },
      { q: 'Can I have multiple accounts?',                   a: 'No. Each person is allowed one account. Duplicate accounts will be permanently banned.' },
      { q: 'How do I change my password?',                    a: "Go to Settings → Change Password. You'll need your current password to set a new one." },
    ],
  },
];

export default function HelpPage() {
  const [open, setOpen]     = useState({});
  const [search, setSearch] = useState('');

  function toggle(key) { setOpen(p => ({ ...p, [key]: !p[key] })); }

  const filtered = FAQ.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      !search ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0);

  return (
    <DashboardLayout title="Help Center" subtitle="Find answers to common questions">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Search */}
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl"
          style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
          <Search size={17} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search help articles…"
            className="flex-1 bg-transparent outline-none text-sm" style={{ color: 'var(--text)' }} />
        </div>

        {/* Contact banner */}
        <div className="gradient-card rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-sm mb-0.5">Still need help?</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }}>Our support team replies within 2 hours.</p>
          </div>
          <a href="mailto:support@taskora.io"
            className="flex items-center gap-2 flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
            <Mail size={15} strokeWidth={2} />
            Contact Support
          </a>
        </div>

        {/* FAQ categories */}
        {filtered.map(cat => (
          <div key={cat.category} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
                <cat.Icon size={14} strokeWidth={2} />
              </span>
              <h2 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{cat.category}</h2>
            </div>

            {cat.items.map((item, idx) => {
              const key = `${cat.category}-${idx}`;
              const isOpen = open[key];
              return (
                <div key={key} className="card rounded-xl overflow-hidden transition-all">
                  <button className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                    onClick={() => toggle(key)}>
                    <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{item.q}</span>
                    <span className="flex-shrink-0" style={{ color: 'var(--primary)' }}>
                      {isOpen ? <Minus size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                      <p className="text-sm leading-relaxed pt-3" style={{ color: 'var(--text-secondary)' }}>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Search size={40} className="mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
            <p className="font-semibold" style={{ color: 'var(--text)' }}>No results for &ldquo;{search}&rdquo;</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try different keywords or contact support.</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
