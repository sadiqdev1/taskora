'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, CheckSquare, Wallet, Menu, Megaphone, ClipboardList } from 'lucide-react';

const USER_TABS = [
  { label: 'Dashboard', href: '/dashboard', Icon: LayoutDashboard },
  { label: 'Tasks',     href: '/tasks',     Icon: CheckSquare     },
  { label: 'Wallet',    href: '/wallet',    Icon: Wallet          },
];

const ADMIN_TABS = [
  { label: 'Overview',     href: '/admin',              Icon: LayoutDashboard },
  { label: 'Campaigns',    href: '/admin/campaigns',    Icon: Megaphone       },
  { label: 'Submissions',  href: '/admin/submissions',  Icon: ClipboardList   },
];

export default function BottomNav({ onMenuClick }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const TABS    = isAdmin ? ADMIN_TABS : USER_TABS;

  const isActive = href => {
    if (href === '/dashboard' || href === '/admin') return pathname === href;
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
