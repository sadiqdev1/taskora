import { Link, router, usePage } from '@inertiajs/react';
import { Bell, ChevronUp, Flame, HelpCircle, Home, LayoutGrid, LogOut, MoreHorizontal, PlusCircle, Search, Settings, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { logout } from '@/routes';
import chortleLogo from '@/src/assets/chortle-logo.svg';
import SuspendedModal from '@/components/suspended-modal';

// Nav items shown to authenticated users
const authNavItems = [
    { path: '/',                label: 'Home',     icon: Home       },
    { path: '/trending',        label: 'Trending', icon: Flame      },
    { path: '/upload',          label: 'Upload',   icon: PlusCircle },
    { path: '/profile',         label: 'Profile',  icon: User       },
    { path: '/settings/profile',label: 'Settings', icon: Settings   },
    { path: '/help',            label: 'Help',     icon: HelpCircle },
];

// Nav items shown to guests (no auth-required items)
const guestNavItems = [
    { path: '/',        label: 'Home',     icon: Home       },
    { path: '/trending',label: 'Trending', icon: Flame      },
    { path: '/search',  label: 'Search',   icon: Search     },
    { path: '/help',    label: 'Help',     icon: HelpCircle },
];
// Legacy alias kept for MobileMoreButton (authenticated path)
const navItems = authNavItems;

// Mobile shows first 4 + a "More" button that reveals the rest (authenticated)
const mobileMainItems = authNavItems.slice(0, 4);

function NavItem({ path, label, icon: Icon, currentUrl }) {
    const isActive = path === '/'
        ? currentUrl === '/'
        : currentUrl === path || currentUrl.startsWith(path + '/') || currentUrl.startsWith(path + '?');
    return (
        <Link href={path}
            className={[
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                    ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-r-full before:bg-orange-500'
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white',
            ].join(' ')}>
            <Icon size={17} className={`flex-shrink-0 transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300'}`} />
            <span>{label}</span>
        </Link>
    );
}

function MobileNavItem({ path, label, icon: Icon, currentUrl }) {
    const isActive = path === '/'
        ? currentUrl === '/'
        : currentUrl === path || currentUrl.startsWith(path + '/') || currentUrl.startsWith(path + '?');
    return (
        <Link href={path}
            className={['group flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-all active:scale-95',
                isActive ? 'text-orange-500' : 'text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300'].join(' ')}>
            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-orange-50 dark:bg-orange-500/10' : ''}`}>
                <Icon size={19} className={`transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400 dark:text-zinc-500'}`} />
            </div>
            <span className="mt-0.5 text-[10px]">{label}</span>
        </Link>
    );
}

function MobileMoreButton({ navItems, currentUrl, user }) {
    const [open, setOpen] = useState(false);
    
    // Add admin link if user is admin or moderator
    const allItems = user && (user.role === 'admin' || user.role === 'moderator')
        ? [{ path: '/dashboard', label: 'Admin', icon: LayoutGrid }, ...navItems]
        : navItems;
    
    const hasActive = allItems.some((item) =>
        item.path === '/' ? currentUrl === '/' : currentUrl.startsWith(item.path)
    );

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className={`group flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-all active:scale-95 ${hasActive ? 'text-orange-500' : 'text-gray-400 dark:text-zinc-500'}`}>
                <div className={`p-1.5 rounded-xl transition-all ${hasActive ? 'bg-orange-50 dark:bg-orange-500/10' : ''}`}>
                    <MoreHorizontal size={19} className={hasActive ? 'text-orange-500' : 'text-gray-400 dark:text-zinc-500'} />
                </div>
                <span className="mt-0.5 text-[10px]">More</span>
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-end" onClick={() => setOpen(false)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative w-full bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl border-t border-gray-100 dark:border-zinc-800 pb-[env(safe-area-inset-bottom)]"
                        style={{ animation: 'slideUp .25s cubic-bezier(.22,.61,.36,1)' }}
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-zinc-700" />
                        </div>
                        <div className="px-4 py-3 space-y-1">
                            {allItems.map((item) => {
                                const isActive = item.path === '/' ? currentUrl === '/' : currentUrl.startsWith(item.path);
                                const Icon = item.icon;
                                return (
                                    <Link key={item.path} href={item.path} onClick={() => setOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600' : 'text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}>
                                        <Icon size={18} className={isActive ? 'text-orange-500' : 'text-gray-400 dark:text-zinc-500'} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="px-4 pb-4">
                            <button onClick={() => setOpen(false)}
                                className="w-full py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-2">
                                <X size={15} /> Close
                            </button>
                        </div>
                    </div>
                    <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
                </div>
            )}
        </>
    );
}

export default function AppLayout({ children }) {
    const { auth, ziggy, unread_count } = usePage().props;
    const currentUrl = usePage().url?.split('?')[0] ?? '/';
    const user = auth?.user;
    const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

    const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [liveUnread, setLiveUnread] = useState(unread_count ?? 0);

    // ── Real-time listeners ──────────────────────────────────────────────────
    useEffect(() => {
        if (!user || !window.Echo) return;

        // Listen for new notifications on private user channel
        const channel = window.Echo.private(`user.${user.id}`)
            .listen('.notification.sent', () => {
                setLiveUnread(n => n + 1);
            });

        return () => {
            window.Echo.leave(`user.${user.id}`);
        };
    }, [user?.id]);

    // Sync liveUnread when page props update (e.g. after visiting /notifications)
    useEffect(() => {
        setLiveUnread(unread_count ?? 0);
    }, [unread_count]);

    // Sync search bar with current search query when on /search
    const pageQuery = usePage().props?.query ?? '';
    const [searchQuery, setSearchQuery] = useState(pageQuery);
    useEffect(() => { setSearchQuery(pageQuery); }, [pageQuery]);

    const desktopMenuRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const avatarUrl = user
        ? (user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=fff&length=2&size=40`)
        : null;

    useEffect(() => {
        const h = (e) => {
            if (desktopMenuRef.current && !desktopMenuRef.current.contains(e.target)) setDesktopMenuOpen(false);
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) setMobileMenuOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.visit(`/search?q=${encodeURIComponent(searchQuery.trim())}`, { preserveState: false });
    };

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-white">
            <SuspendedModal />
            <div className="flex min-h-screen flex-col md:flex-row">

                {/* Desktop Sidebar */}
                <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 z-20">
                    <div className="flex h-full flex-col">
                        <div className="px-5 py-5 border-b border-gray-100 dark:border-zinc-800">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                    <img src={chortleLogo} alt="Chortle" className="h-6 w-6 object-contain" />
                                </div>
                                <div>
                                    <h1 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">Chortle</h1>
                                    <p className="text-[11px] text-gray-400 dark:text-zinc-500 leading-none mt-0.5">Meme community</p>
                                </div>
                            </Link>
                        </div>

                        <nav className="flex-1 px-3 py-4 space-y-0.5">
                            {(user ? authNavItems : guestNavItems).map((item) => (
                                <NavItem key={item.path} {...item} currentUrl={currentUrl} />
                            ))}
                            {isAdmin && (
                                <>
                                    <div className="my-2 border-t border-gray-100 dark:border-zinc-800" />
                                    <NavItem
                                        path="/dashboard"
                                        label="Admin Panel"
                                        icon={LayoutGrid}
                                        currentUrl={currentUrl}
                                    />
                                </>
                            )}
                        </nav>

                        {user ? (
                            <div className="border-t border-gray-100 dark:border-zinc-800 p-3" ref={desktopMenuRef}>
                                <Link href="/profile"
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-gray-50 dark:hover:bg-zinc-800">
                                    {avatarUrl && <img src={avatarUrl} alt={user.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-orange-100 dark:ring-orange-500/20 flex-shrink-0" />}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-gray-800 dark:text-zinc-100">{user.name}</p>
                                        <p className="truncate text-xs text-gray-400 dark:text-zinc-500">{user.email}</p>
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <div className="border-t border-gray-100 dark:border-zinc-800 p-4">
                                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-3 px-1">Join Chortle</p>
                                <div className="flex flex-col gap-2">
                                    <Link href="/register"
                                        className="w-full py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold text-center transition-colors shadow-sm">
                                        Sign up
                                    </Link>
                                    <Link href="/login"
                                        className="w-full py-2 rounded-full border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 text-sm font-medium text-center hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                        Log in
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main */}
                <div className="flex min-h-screen flex-1 flex-col md:ml-64">

                    <header className="sticky top-0 z-30 border-b border-gray-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md">
                        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:px-6">

                            {/* Mobile logo */}
                            <Link href="/" className="md:hidden flex items-center gap-2 flex-shrink-0">
                                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                                    <img src={chortleLogo} alt="Chortle" className="h-5 w-5 object-contain" />
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white text-sm">Chortle</span>
                            </Link>

                            {/* Search — centered on desktop, hidden on mobile */}
                            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-auto">
                                <div className="relative w-full">
                                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 pointer-events-none" />
                                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search memes, users..."
                                        className="w-full rounded-full border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 py-2 pl-9 pr-4 text-sm outline-none transition " />
                                </div>
                            </form>

                            {/* Right actions */}
                            <div className="flex items-center gap-1.5 ml-auto">
                                {/* Mobile search icon — only for authenticated users */}
                                {user && (
                                    <Link href="/search" className="md:hidden rounded-full p-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                                        <Search size={19} />
                                    </Link>
                                )}

                                {/* Bell — only for authenticated users */}
                                {user && (
                                    <Link href="/notifications" className="relative rounded-full p-2 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-700 dark:hover:text-white transition">
                                        <Bell size={19} />
                                        {liveUnread > 0 && (
                                            <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                                                {liveUnread > 99 ? '99+' : liveUnread}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                {/* Guest: Login + Sign up buttons */}
                                {!user && (
                                    <>
                                        <Link href="/login"
                                            className="hidden md:inline-flex items-center px-4 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                            Log in
                                        </Link>
                                        <Link href="/register"
                                            className="hidden md:inline-flex items-center px-4 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm">
                                            Sign up
                                        </Link>
                                        {/* Mobile: Login + Sign up buttons */}
                                        <Link href="/login"
                                            className="md:hidden inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700 text-xs font-medium text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                            Log in
                                        </Link>
                                        <Link href="/register"
                                            className="md:hidden inline-flex items-center px-3 py-1.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors shadow-sm">
                                            Sign up
                                        </Link>
                                    </>
                                )}

                                {/* Desktop avatar + dropdown */}
                                {user && (
                                    <div className="relative hidden md:block" ref={desktopMenuRef}>
                                        <button onClick={() => setDesktopMenuOpen((p) => !p)}
                                            className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                                            <img src={avatarUrl} alt={user.name} className="h-7 w-7 rounded-full object-cover ring-2 ring-orange-100 dark:ring-orange-500/20" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-zinc-200 max-w-[100px] truncate">{user.name}</span>
                                            <ChevronUp size={13} className={`text-gray-400 dark:text-zinc-500 transition-transform ${desktopMenuOpen ? '' : 'rotate-180'}`} />
                                        </button>
                                        {desktopMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-1.5 shadow-xl z-50">
                                                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-zinc-700">
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">{user.email}</p>
                                                </div>
                                                <Link href="/profile" onClick={() => setDesktopMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                                                    <User size={15} className="text-gray-400 dark:text-zinc-500" /> Profile
                                                </Link>
                                                <Link href="/settings/profile" onClick={() => setDesktopMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                                                    <Settings size={15} className="text-gray-400 dark:text-zinc-500" /> Settings
                                                </Link>
                                                <div className="my-1 border-t border-gray-100 dark:border-zinc-700" />
                                                <Link href={logout()} method="post" as="button"
                                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                                                    <LogOut size={15} /> Sign out
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Mobile avatar */}
                                {user && (
                                    <div className="relative md:hidden" ref={mobileMenuRef}>
                                        <button onClick={() => setMobileMenuOpen((p) => !p)}
                                            className="rounded-full ring-2 ring-transparent hover:ring-orange-200 transition">
                                            <img src={avatarUrl} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                                        </button>
                                        {mobileMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-1.5 shadow-xl z-50">
                                                <Link href="/profile" onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                                                    <User size={15} className="text-gray-400 dark:text-zinc-500" /> Profile
                                                </Link>
                                                <Link href="/settings/profile" onClick={() => setMobileMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                                                    <Settings size={15} className="text-gray-400 dark:text-zinc-500" /> Settings
                                                </Link>
                                                <div className="my-1 border-t border-gray-100 dark:border-zinc-700" />
                                                <Link href={logout()} method="post" as="button"
                                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                                                    <LogOut size={15} /> Sign out
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 px-3 pb-24 pt-5 md:px-6 md:pb-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
                    </main>

                    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md md:hidden">
                        <div className="flex h-16 items-center">
                            {user ? (
                                <>
                                    {mobileMainItems.map((item) => (
                                        <MobileNavItem key={item.path} {...item} currentUrl={currentUrl} />
                                    ))}
                                    <MobileMoreButton navItems={navItems.slice(4)} currentUrl={currentUrl} user={user} />
                                </>
                            ) : (
                                guestNavItems.map((item) => (
                                    <MobileNavItem key={item.path} {...item} currentUrl={currentUrl} />
                                ))
                            )}
                        </div>
                    </nav>

   
                </div>
            </div>
        </div>
    );
}
