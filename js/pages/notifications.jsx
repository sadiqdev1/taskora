import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    AtSign, Bell, BellOff, CheckCheck,
    Heart, MessageCircle, Sparkles, Star,
    Trophy, UserPlus,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';

// ── type → icon/color — 3-color system: orange (primary), zinc (secondary), red (accent/danger)
const TYPE_META = {
    like:      { icon: Heart,         iconCls: 'text-red-500',    bgCls: 'bg-red-50 dark:bg-red-500/10'         },
    comment:   { icon: MessageCircle, iconCls: 'text-orange-500', bgCls: 'bg-orange-50 dark:bg-orange-500/10'   },
    reply:     { icon: MessageCircle, iconCls: 'text-orange-500', bgCls: 'bg-orange-50 dark:bg-orange-500/10'   },
    follow:    { icon: UserPlus,      iconCls: 'text-orange-500', bgCls: 'bg-orange-50 dark:bg-orange-500/10'   },
    mention:   { icon: AtSign,        iconCls: 'text-orange-500', bgCls: 'bg-orange-50 dark:bg-orange-500/10'   },
    milestone: { icon: Trophy,        iconCls: 'text-orange-500', bgCls: 'bg-orange-50 dark:bg-orange-500/10'   },
    featured:  { icon: Star,          iconCls: 'text-orange-500', bgCls: 'bg-orange-50 dark:bg-orange-500/10'   },
    system:    { icon: Sparkles,      iconCls: 'text-zinc-500 dark:text-zinc-400', bgCls: 'bg-zinc-100 dark:bg-zinc-800' },
};
const getMeta = (type) => TYPE_META[type] ?? TYPE_META.system;

// ── tabs config ───────────────────────────────────────────────────────────────
const TABS = [
    { id: 'all',      label: 'All',      icon: Bell          },
    { id: 'likes',    label: 'Likes',    icon: Heart         },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
    { id: 'follows',  label: 'Follows',  icon: UserPlus      },
    { id: 'mentions', label: 'Mentions', icon: AtSign        },
    { id: 'system',   label: 'System',   icon: Sparkles      },
];

// ── group by relative date ────────────────────────────────────────────────────
function groupNotifications(list) {
    const groups = {};
    list.forEach((n) => {
        const t = n.created_at ?? '';
        let group = 'Earlier';
        if (t.includes('second') || t.includes('minute') || t.includes('hour') || t === 'just now') group = 'Today';
        else if (t.includes('day') && parseInt(t) <= 7) group = 'This Week';
        (groups[group] = groups[group] || []).push(n);
    });
    return groups;
}
const GROUP_ORDER = ['Today', 'This Week', 'Earlier'];

// ── skeleton ──────────────────────────────────────────────────────────────────
const Skeleton = () => (
    <div className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
        <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/4 rounded-full bg-gray-100 dark:bg-zinc-800" />
            <div className="h-2.5 w-1/3 rounded-full bg-gray-100 dark:bg-zinc-800" />
        </div>
        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />
    </div>
);

// ── notification row ──────────────────────────────────────────────────────────
function NotifRow({ notif, onRead }) {
    const meta = getMeta(notif.type);
    const Icon = meta.icon;
    const avatarSrc = notif.actor?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(notif.actor?.name ?? 'S')}&background=f97316&color=fff&size=40`;
    
    // Determine the correct link based on notification type
    let href = '/';
    if (notif.meme?.slug) {
        // For likes, comments, replies - go to the meme
        href = `/p/${notif.meme.slug}`;
    } else if (notif.type === 'follow' && notif.actor?.username) {
        // For follows - go to the follower's profile
        href = `/u/${notif.actor.username.replace('@', '')}`;
    } else if (notif.actor?.username) {
        // For other actor-based notifications - go to actor's profile
        href = `/u/${notif.actor.username.replace('@', '')}`;
    }

    return (
        <Link href={href} onClick={() => { if (!notif.is_read) onRead(notif.id); }}
            className={`flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-zinc-800/60 transition-colors ${
                !notif.is_read ? 'bg-orange-50/50 dark:bg-orange-500/5' : ''
            }`}>

            {/* Avatar + type badge */}
            <div className="relative flex-shrink-0 mt-0.5">
                <img src={avatarSrc} alt={notif.actor?.name ?? 'System'}
                    className="w-11 h-11 rounded-full object-cover" loading="lazy" />
                <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 ${meta.bgCls} rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900`}>
                    <Icon size={10} className={meta.iconCls} />
                </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 dark:text-zinc-200 leading-snug">
                    {notif.actor && (
                        <span className="font-semibold text-gray-900 dark:text-white">{notif.actor.name} </span>
                    )}
                    {notif.message.replace(notif.actor?.name ?? '', '').trim()}
                </p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{notif.created_at}</p>
                {notif.meme?.title && (
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 truncate italic">"{notif.meme.title}"</p>
                )}
            </div>

            {/* Thumbnail + unread dot */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {notif.meme?.image_url && (
                    <img src={notif.meme.image_url} alt=""
                        className="w-10 h-10 rounded-xl object-cover bg-gray-100 dark:bg-zinc-800" loading="lazy" />
                )}
                {!notif.is_read && <div className="w-2 h-2 rounded-full bg-orange-500 mt-1" />}
            </div>
        </Link>
    );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function Notifications() {
    const {
        notifications: serverData,
        unread_count:  serverUnread,
        tab_counts:    serverTabCounts,
        active_type:   serverType,
    } = usePage().props;

    const [items, setItems]           = useState(serverData?.data ?? []);
    const [nextPageUrl, setNextUrl]   = useState(serverData?.next_page_url ?? null);
    const [unreadCount, setUnread]    = useState(serverUnread ?? 0);
    const [tabCounts, setTabCounts]   = useState(serverTabCounts ?? {});
    const [activeType, setActiveType] = useState(serverType ?? 'all');
    const [loading, setLoading]       = useState(false);
    const [markingAll, setMarkingAll] = useState(false);
    const sentinelRef = useRef(null);

    // switch tab → Inertia visit with ?type=
    const switchTab = (type) => {
        if (type === activeType) return;
        router.get('/notifications', { type }, {
            preserveScroll: false,
            preserveState: false,
        });
    };

    // sync when server props change (after tab switch)
    useEffect(() => {
        setItems(serverData?.data ?? []);
        setNextUrl(serverData?.next_page_url ?? null);
        setUnread(serverUnread ?? 0);
        setTabCounts(serverTabCounts ?? {});
        setActiveType(serverType ?? 'all');
    }, [serverData, serverUnread, serverTabCounts, serverType]);

    // infinite scroll
    const loadMore = useCallback(async () => {
        if (!nextPageUrl || loading) return;
        setLoading(true);
        try {
            const res = await axios.get(nextPageUrl, {
                headers: {
                    'X-Inertia': true,
                    'X-Inertia-Partial-Data': 'notifications',
                    'X-Inertia-Partial-Component': 'notifications',
                },
            });
            const data = res.data?.props?.notifications;
            if (data) {
                setItems((p) => [...p, ...data.data]);
                setNextUrl(data.next_page_url);
            }
        } catch {}
        setLoading(false);
    }, [nextPageUrl, loading]);

    useEffect(() => {
        if (!sentinelRef.current || !nextPageUrl) return;
        const obs = new IntersectionObserver((e) => { if (e[0].isIntersecting) loadMore(); }, { threshold: 0.1 });
        obs.observe(sentinelRef.current);
        return () => obs.disconnect();
    }, [nextPageUrl, loadMore]);

    // mark single read
    const markRead = async (id) => {
        setItems((p) => p.map((n) => n.id === id ? { ...n, is_read: true } : n));
        setUnread((c) => Math.max(0, c - 1));
        setTabCounts((p) => ({ ...p, all: Math.max(0, (p.all ?? 1) - 1) }));
        try { await axios.post(`/notifications/${id}/read`); } catch {}
    };

    // mark all read
    const markAllRead = async () => {
        setMarkingAll(true);
        try {
            await axios.post('/notifications/read-all');
            setItems((p) => p.map((n) => ({ ...n, is_read: true })));
            setUnread(0);
            setTabCounts((p) => Object.fromEntries(Object.keys(p).map((k) => [k, 0])));
        } catch {}
        setMarkingAll(false);
    };

    const grouped = groupNotifications(items);

    return (
        <AppLayout>
            <Head title="Notifications" />
            <div className="max-w-2xl mx-auto space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between" style={{ animation: 'fadeUp .4s ease both' }}>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                                <Bell size={18} className="text-orange-500" />
                            </div>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h1>
                            <p className="text-xs text-gray-400 dark:text-zinc-500">
                                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                            </p>
                        </div>
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} disabled={markingAll}
                            className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors px-3 py-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-500/10 disabled:opacity-50">
                            <CheckCheck size={13} />
                            {markingAll ? 'Marking...' : 'Mark all read'}
                        </button>
                    )}
                </div>

                {/* Type tabs */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden"
                    style={{ animation: 'fadeUp .4s .05s ease both' }}>
                    <div className="flex overflow-x-auto scrollbar-hide -mb-px">
                        {TABS.map(({ id, label, icon: Icon }) => {
                            const count = tabCounts[id] ?? 0;
                            const isActive = activeType === id;
                            return (
                                <button key={id} onClick={() => switchTab(id)}
                                    className={`relative flex items-center justify-center gap-1.5 px-3 sm:px-4 py-3.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 border-b-2 min-w-0 ${
                                        isActive
                                            ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-500/5'
                                            : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                    }`}>
                                    <Icon size={14} className="flex-shrink-0" />
                                    <span className="hidden xs:inline">{label}</span>
                                    {count > 0 && (
                                        <span className={`flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none flex-shrink-0 ${
                                            isActive ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'
                                        }`}>
                                            {count > 99 ? '99+' : count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Notifications list */}
                <div className="space-y-5" style={{ animation: 'fadeUp .4s .1s ease both' }}>

                    {/* Grouped */}
                    {GROUP_ORDER.map((group) => {
                        const groupItems = grouped[group];
                        if (!groupItems?.length) return null;
                        return (
                            <div key={group}>
                                <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-2 px-1">
                                    {group}
                                </p>
                                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-zinc-800">
                                    {groupItems.map((notif) => (
                                        <NotifRow key={notif.id} notif={notif} onRead={markRead} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Load more skeleton */}
                    {loading && (
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-zinc-800">
                            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} />)}
                        </div>
                    )}

                    {nextPageUrl && !loading && <div ref={sentinelRef} className="h-4" />}

                    {/* Empty state */}
                    {!loading && items.length === 0 && (
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-14 text-center">
                            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                                <BellOff size={22} className="text-gray-400 dark:text-zinc-500" />
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">
                                {activeType === 'all' ? 'No notifications yet' : `No ${activeType} notifications`}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                                {activeType === 'all'
                                    ? 'When someone likes, comments, or follows you, it\'ll show up here.'
                                    : 'Switch to "All" to see everything.'}
                            </p>
                            {activeType === 'all' && (
                                <Link href="/" className="inline-block mt-5 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-md">
                                    Explore memes
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </AppLayout>
    );
}
