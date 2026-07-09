'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { apiGet, apiPatch } from '@/lib/api';
import {
  CheckCircle2, Megaphone, ArrowUpRight, Users, Bell,
  ShieldCheck, DollarSign, Clock, RefreshCw,
} from 'lucide-react';

const TYPE_META = {
  earning:        { Icon: CheckCircle2, bg: '#D4F6EE', color: '#00875A' },
  campaign:       { Icon: Megaphone,    bg: '#EEF2FF', color: '#6C5CE7' },
  withdrawal:     { Icon: ArrowUpRight, bg: '#E0F0FF', color: '#0369A1' },
  referral_bonus: { Icon: Users,        bg: '#FFF3D6', color: '#B45309' },
  bonus:          { Icon: DollarSign,   bg: '#FFF3D6', color: '#B45309' },
  system:         { Icon: ShieldCheck,  bg: '#F0EEFF', color: '#6C5CE7' },
  default:        { Icon: Bell,         bg: '#F5F5F5', color: '#666'    },
};

function relativeTime(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationsPage() {
  const [notifs,       setNotifs]       = useState([]);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [page,         setPage]         = useState(1);
  const [hasMore,      setHasMore]      = useState(false);
  const [loadingMore,  setLoadingMore]  = useState(false);
  const [markingAll,   setMarkingAll]   = useState(false);

  const load = useCallback(async (pageNum = 1, append = false) => {
    try {
      const data = await apiGet(`/notifications?page=${pageNum}`);
      const items = data?.data || [];
      setNotifs(prev => append ? [...prev, ...items] : items);
      setUnreadCount(data?.unread_count ?? 0);
      setHasMore(data?.current_page < data?.last_page);
      setPage(pageNum);
    } catch { /* silent */ }
    finally { setLoading(false); setLoadingMore(false); }
  }, []);

  useEffect(() => { load(1); }, [load]);

  async function markRead(id) {
    await apiPatch(`/notifications/${id}/read`, {}).catch(() => {});
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    setUnreadCount(c => Math.max(0, c - 1));
  }

  async function markAllRead() {
    setMarkingAll(true);
    await apiPatch('/notifications/read-all', {}).catch(() => {});
    setNotifs(prev => prev.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
    setUnreadCount(0);
    setMarkingAll(false);
  }

  function loadMore() {
    setLoadingMore(true);
    load(page + 1, true);
  }

  return (
    <DashboardLayout title="Notifications" subtitle={`${unreadCount} unread`}>
      <div className="max-w-2xl mx-auto flex flex-col gap-3">

        {/* Header actions */}
        <div className="flex items-center justify-between mb-1">
          <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'var(--primary-muted)', color: 'var(--primary)' }}>
            <Bell size={11} strokeWidth={2.5} /> {unreadCount} unread
          </span>
          {unreadCount > 0 && (
            <button onClick={markAllRead} disabled={markingAll}
              className="flex items-center gap-1.5 text-xs font-semibold hover:opacity-70 transition-opacity disabled:opacity-40"
              style={{ color: 'var(--primary)' }}>
              {markingAll ? <span className="btn-spinner" style={{ borderTopColor: '#6C5CE7', width: 12, height: 12 }} /> : <RefreshCw size={11} strokeWidth={2.5} />}
              Mark all as read
            </button>
          )}
        </div>

        {/* Loading */}
        {loading ? Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card rounded-2xl p-4 flex items-start gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl shrink-0" style={{ background: 'var(--border-subtle)' }} />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-3.5 rounded-lg w-40" style={{ background: 'var(--border-subtle)' }} />
              <div className="h-3 rounded-lg w-64" style={{ background: 'var(--border-subtle)' }} />
            </div>
          </div>
        )) : notifs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
              <Bell size={28} strokeWidth={1.5} style={{ color: '#6C5CE7' }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>No notifications yet</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Task approvals, withdrawals and referral bonuses will appear here
            </p>
          </div>
        ) : (
          <>
            {notifs.map(n => {
              const m    = TYPE_META[n.type] || TYPE_META.default;
              const read = !!n.read_at;
              return (
                <div key={n.id}
                  onClick={() => !read && markRead(n.id)}
                  className="card rounded-2xl p-4 flex items-start gap-4 transition-all cursor-pointer hover:shadow-md"
                  style={!read ? { borderLeft: '3px solid var(--primary)', background: 'var(--primary-muted)' } : {}}>
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: m.bg, color: m.color }}>
                    <m.Icon size={18} strokeWidth={1.9} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{n.title}</p>
                      <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                        {relativeTime(n.created_at)}
                      </span>
                    </div>
                    {n.body && (
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{n.body}</p>
                    )}
                  </div>
                  {!read && (
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: 'var(--primary)' }} />
                  )}
                </div>
              );
            })}

            {/* Infinite scroll trigger */}
            {hasMore && (
              <button onClick={loadMore} disabled={loadingMore}
                className="w-full py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-[var(--primary-muted)] disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                {loadingMore ? <span className="btn-spinner" style={{ borderTopColor: '#6C5CE7', width: 14, height: 14 }} /> : null}
                {loadingMore ? 'Loading…' : 'Load more'}
              </button>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
