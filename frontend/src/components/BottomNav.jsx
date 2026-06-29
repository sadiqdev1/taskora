'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Wallet, Menu } from 'lucide-react';

const TABS = [
  { label: 'Dashboard', href: '/dashboard', Icon: LayoutDashboard },
  { label: 'Tasks',     href: '/campaigns', Icon: CheckSquare     },
  { label: 'Wallet',    href: '/wallet',     Icon: Wallet          },
];

export default function BottomNav({ onMenuClick }) {
  const pathname = usePathname();

  const isActive = href => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 flex items-stretch"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        boxShadow: '0 -4px 24px rgba(108,92,231,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ label, href, Icon }) => {
        const active = isActive(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all active:scale-95"
            style={{ color: active ? '#6C5CE7' : 'var(--text-muted)' }}
          >
            <span
              className="w-10 h-8 rounded-xl flex items-center justify-center transition-all duration-150"
              style={{ background: active ? '#EEF2FF' : 'transparent' }}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            </span>
            <span className="text-[0.6rem] font-bold tracking-wide" style={{ color: active ? '#6C5CE7' : 'var(--text-muted)' }}>
              {label}
            </span>
          </Link>
        );
      })}

      {/* More button — opens sidebar drawer */}
      <button
        onClick={onMenuClick}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all active:scale-95"
        style={{ color: 'var(--text-muted)' }}
      >
        <span className="w-10 h-8 rounded-xl flex items-center justify-center">
          <Menu size={20} strokeWidth={1.8} />
        </span>
        <span className="text-[0.6rem] font-bold tracking-wide" style={{ color: 'var(--text-muted)' }}>
          More
        </span>
      </button>
    </nav>
  );
}
