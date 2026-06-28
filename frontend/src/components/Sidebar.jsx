'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, CheckSquare, Megaphone, Wallet, ArrowLeftRight,
  Bell, Settings, HelpCircle, LogOut, BarChart2, Gift,
  ClipboardList, UserCheck, CreditCard, UserPlus, ChevronsUpDown, X,
} from 'lucide-react';

const USER_NAV = [
  { label: 'Dashboard',     href: '/dashboard',    Icon: LayoutDashboard },
  { label: 'Tasks',         href: '/campaigns',     Icon: CheckSquare     },
  { label: 'My Tasks',      href: '/tasks',         Icon: ClipboardList   },
  { label: 'Wallet',        href: '/wallet',        Icon: Wallet          },
  { label: 'Transactions',  href: '/transactions',  Icon: ArrowLeftRight  },
  { label: 'Referrals',     href: '/referrals',     Icon: UserPlus        },
  { label: 'Notifications', href: '/notifications', Icon: Bell, badge: 3  },
  { label: 'Settings',      href: '/settings',      Icon: Settings        },
  { label: 'Help Center',   href: '/help',          Icon: HelpCircle      },
];

const ADMIN_NAV = [
  { label: 'Overview',    href: '/admin',             Icon: BarChart2     },
  { label: 'Campaigns',   href: '/admin/campaigns',   Icon: Megaphone     },
  { label: 'Submissions', href: '/admin/submissions', Icon: ClipboardList },
  { label: 'Users',       href: '/admin/users',       Icon: UserCheck     },
  { label: 'Withdrawals', href: '/admin/withdrawals', Icon: CreditCard    },
];

export default function Sidebar({ collapsed, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  const isAdmin = user?.role === 'admin';
  const nav     = isAdmin ? ADMIN_NAV : USER_NAV;
  const [dismissed,    setDismissed]    = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = href => {
    if (href === '/dashboard' || href === '/admin') return pathname === href;
    return pathname.startsWith(href);
  };

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  const W = collapsed ? 64 : 260;

  return (
    <>
      {/* Mobile backdrop — fades in/out */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden animate-[fade-in_200ms_ease-out]"
          style={{ background: 'rgba(15,12,40,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={onMobileClose}
        />
      )}

      <aside
        className="fixed lg:static inset-y-0 left-0 z-40 h-full flex flex-col"
        style={{
          width: W,
          minWidth: W,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          transition:
            'width 220ms cubic-bezier(0.4,0,0.2,1), ' +
            'min-width 220ms cubic-bezier(0.4,0,0.2,1), ' +
            'transform 300ms cubic-bezier(0.4,0,0.2,1)',
        }}
        /* data-open drives the CSS transform — avoids Tailwind class conflict */
        data-open={mobileOpen ? 'true' : undefined}
      >
        {/* ── Logo ── */}
        <div
          className="flex items-center h-[60px] shrink-0 px-4 gap-3"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="w-8 h-8 rounded-xl bg-[#6C5CE7] flex items-center justify-center text-white text-sm font-black shrink-0 shadow-sm">
            T
          </div>
          <span
            className="font-black whitespace-nowrap transition-all duration-200"
            style={{
              color: 'var(--text)',
              fontSize: '1.05rem',
              letterSpacing: '-0.025em',
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : 'auto',
              overflow: 'hidden',
            }}
          >
            Taskora
          </span>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 flex flex-col gap-px px-3 py-3 overflow-hidden">
          {isAdmin && !collapsed && (
            <p className="px-3 pt-1 pb-2 text-[0.68rem] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Admin
            </p>
          )}
          {nav.map(({ href, label, Icon, badge }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                onClick={() => onMobileClose?.()}
                data-active={active ? 'true' : undefined}
                className="sidebar-link group relative flex items-center rounded-lg transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]"
                style={{
                  padding: collapsed ? '10px 0' : '9px 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: collapsed ? 0 : 11,
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.2 : 1.8}
                  className="shrink-0 transition-transform duration-150 group-hover:scale-110"
                />
                {!collapsed && (
                  <span className="flex-1 truncate" style={{ fontSize: '0.9rem' }}>{label}</span>
                )}
                {!collapsed && badge && (
                  <span className="text-[0.65rem] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center bg-[#6C5CE7] text-white leading-none">
                    {badge}
                  </span>
                )}
                {collapsed && badge && (
                  <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#6C5CE7] ring-2 ring-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Invite card (expanded only, dismissible) ── */}
        {!isAdmin && !collapsed && !dismissed && (
          <div className="mx-2 mb-2 p-4 rounded-xl shrink-0 bg-[#6C5CE7] relative">
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/20 transition-all"
              title="Dismiss"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
            <div className="flex items-center gap-2 mb-0.5 pr-5">
              <Gift size={12} className="text-white/80" />
              <p className="text-white font-bold text-xs">Invite &amp; Earn</p>
            </div>
            <p className="text-[0.7rem] mb-3 text-white/60 leading-relaxed">
              Earn 10% of your friends&apos; earnings, forever.
            </p>
            <Link
              href="/referrals"
              className="block w-full py-1.5 rounded-lg text-center text-xs font-semibold text-white hover:opacity-80 transition-opacity"
              style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.25)' }}
            >
              Invite Now
            </Link>
          </div>
        )}

        {/* ── User footer — click to open popover ── */}
        <div
          className="shrink-0 p-2"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          {!collapsed ? (
            <div className="relative">
              {/* Popover — appears above the row on click */}
              {userMenuOpen && (
                <>
                  {/* backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div
                    className="absolute bottom-full left-0 right-0 mb-1.5 z-50 rounded-xl overflow-hidden py-1"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
                  >
                    <Link
                      href="/settings"
                      onClick={() => { setUserMenuOpen(false); onMobileClose?.(); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors"
                      style={{ color: 'var(--text)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F4F3FF')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <Settings size={15} strokeWidth={1.8} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      Settings
                    </Link>
                    <div style={{ height: 1, background: 'var(--border-subtle)', margin: '2px 0' }} />
                    <button
                      onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#FFF0F0'; e.currentTarget.style.color = '#C0392B'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                      <LogOut size={15} strokeWidth={1.8} className="shrink-0" />
                      Log out
                    </button>
                  </div>
                </>
              )}

              {/* Clickable user row */}
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg transition-colors duration-150 hover:bg-[var(--bg)]"
                style={{ background: userMenuOpen ? 'var(--bg)' : undefined }}
              >
                <div className="w-8 h-8 rounded-full bg-[#6C5CE7] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-[0.875rem] font-semibold leading-snug truncate" style={{ color: 'var(--text)' }}>
                    {user?.name}
                  </p>
                  <p className="text-[0.73rem] truncate" style={{ color: 'var(--text-muted)' }}>
                    {user?.email}
                  </p>
                </div>
                <ChevronsUpDown
                  size={13} strokeWidth={1.8}
                  className={`transition-transform duration-150 ${userMenuOpen ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                />
              </button>
            </div>
          ) : (
            /* Collapsed: avatar + logout stacked */
            <div className="flex flex-col items-center gap-1">
              <Link
                href="/settings"
                onClick={() => onMobileClose?.()}
                className="w-9 h-9 rounded-full bg-[#6C5CE7] flex items-center justify-center text-white text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
                title={user?.name}
              >
                {user?.name?.[0]?.toUpperCase()}
              </Link>
              <button
                onClick={handleLogout}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 hover:bg-red-50 hover:text-red-600"
                style={{ color: 'var(--text-muted)' }}
                title="Log out"
              >
                <LogOut size={13} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
