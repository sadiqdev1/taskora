'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, Bell, ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function TopBar({ onMenuClick, onToggleCollapse, collapsed, title, subtitle }) {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header
      className="flex items-center gap-3 px-4 sticky top-0 z-20 shrink-0"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        height: 60,
      }}
    >
      {/* ── Left ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg)]"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Open menu"
        >
          <Menu size={19} strokeWidth={2} />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-9 h-9 items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg)]"
          style={{ color: 'var(--text-secondary)' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed
            ? <PanelLeftOpen  size={18} strokeWidth={1.8} />
            : <PanelLeftClose size={18} strokeWidth={1.8} />
          }
        </button>

        {/* Page title */}
        {title && (
          <div className="hidden sm:block ml-1">
            <h1 className="font-bold text-[0.95rem] leading-tight" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* ── Right ── */}
      <div
        className="flex items-center ml-auto shrink-0"
        style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: 12, gap: 4 }}
      >
        {/* Notifications */}
        <Link
          href="/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg)]"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Notifications"
        >
          <Bell size={17} strokeWidth={2} />
          <span
            className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full border-2 border-white"
            style={{ background: '#6C5CE7' }}
          />
        </Link>

        {/* Avatar */}
        <button className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl transition-colors hover:bg-[var(--bg)]">
          <span className="w-7 h-7 rounded-lg bg-[#6C5CE7] flex items-center justify-center text-white text-[0.65rem] font-black shrink-0">
            {initials}
          </span>
          <span className="hidden sm:block text-sm font-semibold max-w-[96px] truncate" style={{ color: 'var(--text)' }}>
            {user?.name?.split(' ')[0] ?? 'Account'}
          </span>
          <ChevronDown size={12} strokeWidth={2.5} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </header>
  );
}
