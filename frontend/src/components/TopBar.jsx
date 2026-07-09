'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/lib/api';
import { Menu, Bell, ChevronDown, PanelLeftClose, PanelLeftOpen, Settings, LogOut } from 'lucide-react';

export default function TopBar({ onMenuClick, onToggleCollapse, collapsed, title, subtitle }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  // Fetch real unread count so the dot is only shown when there are actual unread notifications
  useEffect(() => {
    if (!user) return;
    apiGet('/notifications/unread-count')
      .then(d => setUnreadCount(d?.count ?? 0))
      .catch(() => {});
  }, [user]);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  async function handleLogout() {
    setAvatarMenuOpen(false);
    await logout();
    router.replace('/login');
  }

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
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg)]"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Open menu"
        >
          <Menu size={19} strokeWidth={2} />
        </button>

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
        {/* Notifications — dot only shown when unreadCount > 0 */}
        <Link
          href="/notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors hover:bg-[var(--bg)]"
          style={{ color: 'var(--text-secondary)' }}
          aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : 'Notifications'}
        >
          <Bell size={17} strokeWidth={2} />
          {unreadCount > 0 && (
            <span
              className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full border-2 border-white"
              style={{ background: '#6C5CE7' }}
            />
          )}
        </Link>

        {/* Avatar — opens a small dropdown */}
        <div className="relative">
          <button
            onClick={() => setAvatarMenuOpen(o => !o)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-xl transition-colors hover:bg-[var(--bg)]"
            aria-label="Account menu"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center text-white text-[0.65rem] font-black shrink-0"
              style={{ background: '#6C5CE7' }}>
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : initials
              }
            </div>
            <span className="hidden sm:block text-sm font-semibold max-w-[96px] truncate" style={{ color: 'var(--text)' }}>
              {user?.name?.split(' ')[0] ?? 'Account'}
            </span>
            <ChevronDown size={12} strokeWidth={2.5}
              className={`transition-transform duration-150 ${avatarMenuOpen ? 'rotate-180' : ''}`}
              style={{ color: 'var(--text-muted)' }} />
          </button>

          {avatarMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setAvatarMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden py-1 min-w-[160px]"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
                <Link href="/settings"
                  onClick={() => setAvatarMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors no-underline"
                  style={{ color: 'var(--text)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <Settings size={14} strokeWidth={1.8} style={{ color: 'var(--text-muted)' }} />
                  Settings
                </Link>
                <div style={{ height: 1, background: 'var(--border-subtle)', margin: '2px 0' }} />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FFF0F0'; e.currentTarget.style.color = '#C0392B'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  <LogOut size={14} strokeWidth={1.8} className="shrink-0" />
                  Log out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
