import { usePage } from '@inertiajs/react';
import {
    Bell, Flag, Flame, HelpCircle, Home, Image,
    LogOut, MessageSquare, Moon, PanelLeftClose,
    PanelLeftOpen, Settings, Sun, Users,
} from 'lucide-react';
import { useState } from 'react';
import chortleLogo from '../../assets/chortle-logo.svg';
import { logout } from '@/routes';
import { useAppearance } from '@/hooks/use-appearance';

const navGroups = [
    {
        label: 'Main',
        items: [
            { id: 'dashboard',     icon: Home,         label: 'Dashboard'     },
            { id: 'memes',         icon: Image,        label: 'Memes'         },
            { id: 'users',         icon: Users,        label: 'Users'         },
            { id: 'trending',      icon: Flame,        label: 'Trending'      },
        ],
    },
    {
        label: 'Management',
        items: [
            { id: 'reports',       icon: Flag,         label: 'Reports'       },
            { id: 'feedback',      icon: MessageSquare,label: 'Feedback'      },
            { id: 'notifications', icon: Bell,         label: 'Notifications' },
            { id: 'settings',      icon: Settings,     label: 'Settings'      },
        ],
    },
    {
        label: 'Support',
        items: [
            { id: 'help',          icon: HelpCircle,   label: 'Help Center'   },
        ],
    },
];

export default function Sidebar({ mobileMenuOpen, closeMobileMenu, activeTab, setActiveTab }) {
    const [collapsed, setCollapsed] = useState(false);
    const { auth } = usePage().props;
    const user = auth?.user;
    const { appearance, updateAppearance } = useAppearance();
    const isDark = appearance === 'dark';

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        if (window.innerWidth < 768) closeMobileMenu();
    };

    const avatarUrl = user?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'Admin')}&background=fff&color=f97316&size=40`;

    return (
        <aside className={`
            fixed md:static inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out
            ${collapsed ? 'w-[72px]' : 'w-64'}
            bg-gradient-to-b from-orange-500 via-orange-500 to-orange-600
            dark:bg-gradient-to-b dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900
            dark:border-r dark:border-zinc-800
            text-white shadow-xl
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>

            {/* ── Header ── */}
            <div className={`flex items-center border-b border-white/15 dark:border-zinc-800 ${collapsed ? 'justify-center p-4' : 'justify-between px-5 py-4'}`}>
                {!collapsed && (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white/20 dark:bg-orange-500/20 flex items-center justify-center">
                            <img src={chortleLogo} alt="Chortle" className="w-5 h-5 object-contain" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold leading-none text-white">Chortle</h2>
                            <p className="text-[11px] text-white/60 dark:text-zinc-500 mt-0.5">Admin Panel</p>
                        </div>
                    </div>
                )}
                {collapsed && (
                    <div className="w-8 h-8 rounded-xl bg-white/20 dark:bg-orange-500/20 flex items-center justify-center">
                        <img src={chortleLogo} alt="Chortle" className="w-5 h-5 object-contain" />
                    </div>
                )}
                {!collapsed && (
                    <button onClick={() => setCollapsed(true)} className="p-1.5 rounded-lg hover:bg-white/15 dark:hover:bg-zinc-800 transition text-white dark:text-zinc-400" aria-label="Collapse sidebar">
                        <PanelLeftClose size={16} />
                    </button>
                )}
            </div>

            {collapsed && (
                <button 
                    onClick={() => setCollapsed(false)} 
                    className="mx-auto mt-4 p-1.5 rounded-lg hover:bg-white/15 dark:hover:bg-zinc-800 transition text-white dark:text-zinc-400"
                    aria-label="Expand sidebar"
                >
                    <PanelLeftOpen size={16} />
                </button>
            )}

            {/* ── Nav ── */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 custom-scrollbar">
                {navGroups.map((group) => (
                    <div key={group.label}>
                        {!collapsed && (
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 dark:text-zinc-600 mb-2 px-2">
                                {group.label}
                            </p>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map(({ id, icon: Icon, label }) => {
                                const isActive = activeTab === id;
                                return (
                                    <button key={id} onClick={() => handleTabClick(id)}
                                        title={collapsed ? label : undefined}
                                        className={`
                                            relative flex items-center gap-3 w-full rounded-xl transition-all duration-150
                                            ${collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'}
                                            ${isActive
                                                ? 'bg-white/20 dark:bg-orange-500/15 text-white dark:text-orange-400 shadow-sm'
                                                : 'text-white/75 dark:text-zinc-400 hover:bg-white/10 dark:hover:bg-zinc-800 hover:text-white dark:hover:text-white'}
                                        `}>
                                        {isActive && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-white dark:bg-orange-500 rounded-r-full" />
                                        )}
                                        <Icon size={17} className="flex-shrink-0" />
                                        {!collapsed && <span className="text-sm flex-1 text-left">{label}</span>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* ── Footer ── */}
            <div className="border-t border-white/15 dark:border-zinc-800 p-3 space-y-2">

                {/* Dark mode toggle */}
                {!collapsed && (
                    <button onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/75 dark:text-zinc-400 hover:bg-white/10 dark:hover:bg-zinc-800 hover:text-white dark:hover:text-white transition-all text-sm">
                        {isDark ? <Sun size={16} className="flex-shrink-0" /> : <Moon size={16} className="flex-shrink-0" />}
                        <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
                    </button>
                )}
                {collapsed && (
                    <button onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
                        title={isDark ? 'Light mode' : 'Dark mode'}
                        className="flex items-center justify-center w-full py-2.5 rounded-xl text-white/75 dark:text-zinc-400 hover:bg-white/10 dark:hover:bg-zinc-800 hover:text-white dark:hover:text-white transition-all">
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                )}

                {/* User row */}
                <div className={`flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/10 dark:hover:bg-zinc-800 transition-all ${collapsed ? 'justify-center' : ''}`}>
                    <img src={avatarUrl} alt={user?.name ?? 'Admin'}
                        className="w-9 h-9 rounded-full border-2 border-white/30 dark:border-zinc-700 object-cover flex-shrink-0" />
                    {!collapsed && (
                        <>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate leading-tight text-white dark:text-zinc-100">{user?.name ?? 'Admin'}</p>
                                <p className="text-[11px] text-white/60 dark:text-zinc-500 truncate capitalize">{user?.role ?? 'admin'}</p>
                            </div>
                                    <a href={logout().url}
                                        onClick={(e) => { e.preventDefault(); document.getElementById('admin-logout-form').submit(); }}
                                        className="p-1.5 rounded-lg hover:bg-white/15 dark:hover:bg-zinc-700 transition text-white/70 dark:text-zinc-400 hover:text-white flex-shrink-0"
                                        title="Sign out"
                                        aria-label="Sign out">
                                        <LogOut size={15} />
                                    </a>
                            <form id="admin-logout-form" method="POST" action={logout().url} className="hidden">
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content} />
                                <input type="hidden" name="_method" value="POST" />
                            </form>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
}
