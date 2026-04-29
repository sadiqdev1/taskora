import axios from 'axios';
import { Bell, CheckCheck, ChevronLeft, ChevronRight, Flag, MessageSquare, Star, Upload, UserPlus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '../Contexts/ToastContexts';
import VerifiedBadge from '../../../components/VerifiedBadge';

const TYPE_META = {
    report:       { icon: Flag,          bg: 'bg-red-50 dark:bg-red-500/10',         color: 'text-red-500',                          label: 'Report'   },
    new_user:     { icon: UserPlus,      bg: 'bg-orange-50 dark:bg-orange-500/10',   color: 'text-orange-500',                       label: 'New User' },
    meme_pending: { icon: Upload,        bg: 'bg-orange-50 dark:bg-orange-500/10',   color: 'text-orange-500',                       label: 'Meme'     },
    feedback:     { icon: MessageSquare, bg: 'bg-zinc-100 dark:bg-zinc-800',         color: 'text-zinc-500 dark:text-zinc-400',       label: 'Feedback' },
    milestone:    { icon: Star,          bg: 'bg-orange-50 dark:bg-orange-500/10',   color: 'text-orange-500',                       label: 'System'   },
    system:       { icon: Bell,          bg: 'bg-zinc-100 dark:bg-zinc-800',         color: 'text-zinc-500 dark:text-zinc-400',       label: 'System'   },
};
const getMeta = (type) => TYPE_META[type] ?? TYPE_META.system;

const FILTER_TABS = ['All', 'Unread', 'Reports', 'Users', 'Memes', 'Feedback'];

const statusBadge = (status) => {
    if (!status) return null;
    const m = { pending: 'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600', resolved: 'bg-green-50 dark:bg-green-500/10 text-green-600', dismissed: 'bg-gray-100 dark:bg-zinc-700 text-gray-500' };
    return <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full capitalize ${m[status] || 'bg-gray-100 text-gray-500'}`}>{status}</span>;
};

export default function NotificationsView() {
    const [notifications, setNotifications] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [page, setPage] = useState(1);
    const toast = useToast();

    const load = useCallback(async (pg = 1) => {
        setLoading(true);
        try {
            const res = await axios.get('/admin/notifications', { params: { filter, page: pg } });
            setNotifications(res.data.data);
            setMeta({ total: res.data.total, last_page: res.data.last_page, unread: res.data.unread_count });
            setPage(pg);
        } catch {}
        setLoading(false);
    }, [filter]);

    useEffect(() => { load(1); }, [load]);

    const markRead = async (id) => {
        // For system events (string IDs like "report-1"), just mark locally
        setNotifications((p) => p.map((n) => n.id === id ? { ...n, is_read: true } : n));
        if (typeof id === 'number') {
            try { await axios.post(`/admin/notifications/${id}/read`); } catch {}
        }
    };

    const markAllRead = async () => {
        try {
            await axios.post('/admin/notifications/read-all');
            setNotifications((p) => p.map((n) => ({ ...n, is_read: true })));
            setMeta((m) => m ? { ...m, unread: 0 } : m);
            toast.addToast('All marked as read', 'success');
        } catch {}
    };

    const unreadCount = meta?.unread ?? notifications.filter((n) => !n.is_read).length;

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                            <Bell size={17} className="text-orange-500" />
                        </div>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">System Activity</h2>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead}
                        className="flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 px-3 py-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-500/10 transition">
                        <CheckCheck size={13} /> Mark all read
                    </button>
                )}
            </div>

            {/* Filter tabs */}
            <div className="flex overflow-x-auto scrollbar-hide bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl mb-lg">
                {FILTER_TABS.map((tab) => (
                    <button key={tab} onClick={() => setFilter(tab)}
                        className={`flex-shrink-0 px-3 sm:px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 min-w-0 ${
                            filter === tab
                                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200'
                        }`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-2">
                {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4 animate-pulse">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-1/2 rounded-full bg-gray-100 dark:bg-zinc-800" />
                                    <div className="h-2.5 w-1/3 rounded-full bg-gray-100 dark:bg-zinc-800" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : notifications.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-10 text-center">
                        <Bell size={24} className="text-gray-200 dark:text-zinc-700 mx-auto mb-2" />
                        <p className="text-sm text-gray-400 dark:text-zinc-500">No activity found.</p>
                    </div>
                ) : notifications.map((n) => {
                    const meta = getMeta(n.type);
                    const Icon = meta.icon;
                    const avatarSrc = n.actor?.avatar_url ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(n.actor?.name ?? 'S')}&background=f97316&color=fff&size=36`;

                    return (
                        <div key={n.id}
                            className={`bg-white dark:bg-zinc-900 rounded-xl border shadow-sm p-4 flex items-start gap-3 transition-colors ${
                                !n.is_read
                                    ? 'border-orange-100 dark:border-orange-500/20 bg-orange-50/30 dark:bg-orange-500/5'
                                    : 'border-gray-100 dark:border-zinc-800'
                            }`}>

                            {/* Avatar + type badge */}
                            <div className="relative flex-shrink-0">
                                <img src={avatarSrc} alt={n.actor?.name ?? 'System'}
                                    className="w-9 h-9 rounded-full object-cover" />
                                <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 ${meta.bg} rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900`}>
                                    <Icon size={10} className={meta.color} />
                                </div>
                                {n.actor?.is_verified && (
                                    <div className="absolute -top-0.5 -left-0.5">
                                        <VerifiedBadge size={12} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm text-gray-800 dark:text-zinc-200 leading-snug">{n.message}</p>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                        {n.meta?.status && statusBadge(n.meta.status)}
                                        {!n.is_read && (
                                            <button onClick={() => markRead(n.id)} title="Mark read"
                                                className="p-1 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10 text-green-500 transition">
                                                <CheckCheck size={13} />
                                            </button>
                                        )}
                                        {!n.is_read && <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${meta.bg} ${meta.color}`}>
                                        {meta.label}
                                    </span>
                                    <span className="text-[11px] text-gray-400 dark:text-zinc-500">{n.created_at}</span>
                                </div>

                                {/* Meme preview */}
                                {n.meme?.title && (
                                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 truncate italic">
                                        "{n.meme.title}"
                                    </p>
                                )}
                            </div>

                            {/* Meme thumbnail */}
                            {n.meme?.image_url && (
                                <img src={n.meme.image_url} alt=""
                                    className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-zinc-400">Page {page} of {meta.last_page}</p>
                    <div className="flex items-center gap-1">
                        <button onClick={() => load(page - 1)} disabled={page === 1}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition">
                            <ChevronLeft size={14} />
                        </button>
                        <button onClick={() => load(page + 1)} disabled={page === meta.last_page}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition">
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
