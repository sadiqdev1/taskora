import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { Calendar, Filter, Heart, MessageCircle, Search as SearchIcon, UserCheck, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Avatar } from '@/components/comment-item';
import VerifiedBadge from '@/components/VerifiedBadge';
import AuthPromptModal from '@/components/auth-prompt-modal';

const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n ?? 0);

// ── Skeletons ─────────────────────────────────────────────────────────────────
const MemeSkeleton = () => (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-pulse">
        <div className="aspect-square bg-gray-100 dark:bg-zinc-800" />
        <div className="p-3 space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-gray-100 dark:bg-zinc-800" />
            <div className="h-2.5 w-1/2 rounded-full bg-gray-100 dark:bg-zinc-800" />
        </div>
    </div>
);

const UserSkeleton = () => (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-3 animate-pulse">
        <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 rounded-full bg-gray-100 dark:bg-zinc-800" />
            <div className="h-2.5 w-1/2 rounded-full bg-gray-100 dark:bg-zinc-800" />
        </div>
        <div className="h-8 w-20 rounded-full bg-gray-100 dark:bg-zinc-800" />
    </div>
);

// ── User card ─────────────────────────────────────────────────────────────────
function UserCard({ user: u, currentUserId }) {
    const { auth } = usePage().props;
    const [following, setFollowing] = useState(u.is_following ?? false);
    const [loading, setLoading] = useState(false);
    const [authPromptOpen, setAuthPromptOpen] = useState(false);
    const isOwn = currentUserId === u.id;

    const handleFollow = async (e) => {
        e.preventDefault();
        if (!auth?.user) { setAuthPromptOpen(true); return; }
        if (loading || isOwn) return;
        setLoading(true);
        const prev = following;
        setFollowing(!prev);
        try { await axios.post(`/u/${u.id}/follow`); }
        catch { setFollowing(prev); }
        setLoading(false);
    };

    const username = u.username ?? u.name?.toLowerCase().replace(/\s+/g, '');

    return (
        <>
        <Link href={`/u/${username}`}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-3 hover:shadow-md dark:hover:shadow-zinc-900 transition-all group">
            <Avatar user={u} size="w-11 h-11" className="flex-shrink-0 group-hover:ring-2 group-hover:ring-orange-300 transition-all" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-orange-500 transition-colors">{u.name}</p>
                    {u.is_verified && <VerifiedBadge size={14} />}
                </div>
                <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">
                    @{username}
                    {u.followers_count > 0 && <span className="ml-2">{fmt(u.followers_count)} followers</span>}
                </p>
                {u.bio && <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 truncate">{u.bio}</p>}
            </div>
            {!isOwn && (
                <button onClick={handleFollow} disabled={loading} type="button"
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        following
                            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                    }`}>
                    {following ? <><UserCheck size={12} /> Following</> : <><Users size={12} /> Follow</>}
                </button>
            )}
        </Link>
        <AuthPromptModal open={authPromptOpen} onClose={() => setAuthPromptOpen(false)} action="follow" />
        </>
    );
}

// ── Meme card ─────────────────────────────────────────────────────────────────
function MemeCard({ meme }) {
    return (
        <Link href={`/p/${meme.slug}`}
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-md dark:hover:shadow-zinc-900 transition-all group">
            <div className="aspect-square bg-gray-100 dark:bg-zinc-800 overflow-hidden relative">
                <img src={meme.image_url} alt={meme.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                    <div className="flex items-center gap-3 text-white text-xs">
                        <span className="flex items-center gap-1"><Heart size={11} className="fill-white" />{fmt(meme.likes_count)}</span>
                        <span className="flex items-center gap-1"><MessageCircle size={11} />{fmt(meme.comments_count)}</span>
                    </div>
                </div>
            </div>
            <div className="p-3">
                <p className="text-xs font-semibold text-gray-800 dark:text-zinc-200 truncate">{meme.title}</p>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5 truncate">
                    @{meme.user?.username ?? meme.user?.name}
                </p>
            </div>
        </Link>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Search() {
    const { memes: serverMemes, users: serverUsers, query: serverQuery } = usePage().props;
    const { auth } = usePage().props;
    const currentUserId = auth?.user?.id;

    const [query, setQuery] = useState(serverQuery ?? '');
    const [memes, setMemes] = useState(serverMemes ?? null);
    const [users, setUsers] = useState(serverUsers ?? null);
    const [loading, setLoading] = useState(false);

    // Track whether the current query was typed by the user (not synced from props)
    const userTypedRef = useRef(false);

    // Sync memes/users from props after router.visit — but never sync query back
    // (syncing query would re-trigger the search useEffect → infinite loop)
    useEffect(() => {
        setMemes(serverMemes ?? null);
        setUsers(serverUsers ?? null);
        // Mark that we just received server results — next keystroke is user-typed
        userTypedRef.current = false;
    }, [serverMemes, serverUsers]);
    const [activeTab, setActiveTab] = useState('all');
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        dateRange: '',
    });
    const debounceRef = useRef(null);
    const inputRef = useRef(null);
    const filterRef = useRef(null);

    // Auto-focus on mount
    useEffect(() => { inputRef.current?.focus(); }, []);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const h = (e) => { if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false); };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    // Debounced live search — only fires when user actually types
    useEffect(() => {
        if (!userTypedRef.current) return; // skip prop-sync triggers
        if (!query.trim()) { setMemes(null); setUsers(null); return; }
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(query), 400);
        return () => clearTimeout(debounceRef.current);
    }, [query, filters]);

    const doSearch = async (q) => {
        setLoading(true);
        try {
            // Use router.visit — no partial reload headers, no 409 version conflicts
            // Results come back via usePage().props on the next render
            router.visit('/search', {
                method: 'get',
                data: {
                    q,
                    category: filters.category,
                    date_range: filters.dateRange,
                },
                preserveScroll: true,
                preserveState: false, // must be false so props update with new results
                replace: true,        // don't pollute browser history on every keystroke
                onSuccess: () => setLoading(false),
                onError: () => setLoading(false),
            });
        } catch {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        doSearch(query);
    };

    const clearSearch = () => { setQuery(''); setMemes(null); setUsers(null); inputRef.current?.focus(); };

    const clearFilters = () => {
        setFilters({ category: '', dateRange: '' });
        setFilterOpen(false);
    };

    const hasActiveFilters = filters.category || filters.dateRange;

    const hasResults = (memes?.data?.length > 0) || (users?.length > 0);
    const searched = query.trim().length > 0;
    const memeResults = memes?.data ?? [];
    const userResults = users ?? [];
    const totalMemes = memes?.total ?? 0;
    const totalUsers = userResults.length;

    const TABS = [
        { id: 'all',   label: 'All',    count: totalMemes + totalUsers },
        { id: 'memes', label: 'Memes',  count: totalMemes },
        { id: 'users', label: 'People', count: totalUsers },
    ];

    return (
        <AppLayout>
            <Head title={query ? `"${query}" — Search · Chortle` : 'Search · Chortle'}>
                <meta name="description" content={query ? `Search results for "${query}" on Chortle.` : 'Search for memes and creators on Chortle.'} />
                <meta name="robots" content="noindex, follow" />
            </Head>

            <div className="max-w-2xl mx-auto space-y-5">

                {/* Search input with filters */}
                <div className="space-y-3">
                    <div className="relative">
                        <SearchIcon size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                        <form onSubmit={handleSubmit}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => { userTypedRef.current = true; setQuery(e.target.value); }}
                                placeholder="Search memes, creators..."
                                className="w-full pl-11 pr-24 py-3 rounded-2xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition shadow-sm"
                            />
                        </form>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            {query && (
                                <button onClick={clearSearch} type="button"
                                    className="p-1 rounded-full text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                                    <X size={15} />
                                </button>
                            )}
                            <div className="relative" ref={filterRef}>
                                <button onClick={() => setFilterOpen(!filterOpen)} type="button"
                                    className={`p-1.5 rounded-full transition ${hasActiveFilters ? 'bg-orange-500 text-white' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800'}`}>
                                    <Filter size={15} />
                                </button>
                                {filterOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl p-4 z-20" style={{ animation: "menuIn .15s ease" }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h4>
                                            {hasActiveFilters && (
                                                <button onClick={clearFilters} type="button" className="text-xs text-orange-500 hover:text-orange-600 font-medium">Clear all</button>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1.5 block">Category</label>
                                                <select
                                                    value={filters.category}
                                                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400/40">
                                                    <option value="">All categories</option>
                                                    <option value="Funny">😂 Funny</option>
                                                    <option value="Dark Humor">💀 Dark Humor</option>
                                                    <option value="Wholesome">🥹 Wholesome</option>
                                                    <option value="Trending">🔥 Trending</option>
                                                    <option value="School">🎓 School</option>
                                                    <option value="Tech">💻 Tech</option>
                                                    <option value="Gaming">🎮 Gaming</option>
                                                    <option value="Relationship">❤️ Relationship</option>
                                                    <option value="Other">📦 Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 dark:text-zinc-400 mb-1.5 block">Date Range</label>
                                                <select
                                                    value={filters.dateRange}
                                                    onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400/40">
                                                    <option value="">All time</option>
                                                    <option value="today">Today</option>
                                                    <option value="week">This week</option>
                                                    <option value="month">This month</option>
                                                    <option value="year">This year</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Active filters display */}
                    {hasActiveFilters && (
                        <div className="flex items-center gap-2 flex-wrap">
                            {filters.category && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-xs font-medium text-orange-600">
                                    {filters.category}
                                    <button onClick={() => setFilters({ ...filters, category: '' })} type="button" className="hover:text-orange-700">
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                            {filters.dateRange && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 text-xs font-medium text-orange-600">
                                    <Calendar size={12} />
                                    {filters.dateRange === 'today' ? 'Today' : filters.dateRange === 'week' ? 'This week' : filters.dateRange === 'month' ? 'This month' : 'This year'}
                                    <button onClick={() => setFilters({ ...filters, dateRange: '' })} type="button" className="hover:text-orange-700">
                                        <X size={12} />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Tabs — only show when there are results */}
                {searched && !loading && hasResults && (
                    <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-1.5 shadow-sm">
                        {TABS.map(({ id, label, count }) => (
                            <button key={id} onClick={() => setActiveTab(id)} type="button"
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                                    activeTab === id
                                        ? 'bg-orange-500 text-white shadow-sm'
                                        : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                }`}>
                                {label}
                                {count > 0 && (
                                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === id ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400'}`}>
                                        {count > 99 ? '99+' : count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Loading skeletons */}
                {loading && (
                    <div className="space-y-5">
                        <div className="space-y-3">
                            <UserSkeleton /><UserSkeleton />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {Array.from({ length: 6 }).map((_, i) => <MemeSkeleton key={i} />)}
                        </div>
                    </div>
                )}

                {/* Results */}
                {!loading && searched && hasResults && (
                    <div className="space-y-6">
                        {/* People */}
                        {(activeTab === 'all' || activeTab === 'users') && userResults.length > 0 && (
                            <div className="space-y-2">
                                {activeTab === 'all' && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">People</p>
                                        {totalUsers > 3 && (
                                            <button onClick={() => setActiveTab('users')} className="text-xs text-orange-500 hover:text-orange-600 font-medium">See all</button>
                                        )}
                                    </div>
                                )}
                                {(activeTab === 'all' ? userResults.slice(0, 3) : userResults).map((u) => (
                                    <UserCard key={u.id} user={u} currentUserId={currentUserId} />
                                ))}
                            </div>
                        )}

                        {/* Memes */}
                        {(activeTab === 'all' || activeTab === 'memes') && memeResults.length > 0 && (
                            <div className="space-y-3">
                                {activeTab === 'all' && (
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wide">Memes</p>
                                        <p className="text-xs text-gray-400 dark:text-zinc-500">{fmt(totalMemes)} result{totalMemes !== 1 ? 's' : ''}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {memeResults.map((meme) => <MemeCard key={meme.id} meme={meme} />)}
                                </div>
                                {memes?.next_page_url && (
                                    <button onClick={() => router.visit(`/search?q=${encodeURIComponent(query)}&page=${(memes.current_page ?? 1) + 1}`, { preserveState: true })}
                                        className="w-full py-3 rounded-2xl border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                                        Load more memes
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* No results */}
                {!loading && searched && !hasResults && (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-16 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                            <SearchIcon size={24} className="text-gray-300 dark:text-zinc-600" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">No results for "{query}"</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Try different keywords or check the spelling.</p>
                    </div>
                )}

                {/* Empty state */}
                {!searched && !loading && (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-16 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                            <SearchIcon size={24} className="text-orange-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200">Find memes & creators</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">Search by title, tag, or username.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

