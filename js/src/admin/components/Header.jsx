import { usePage } from '@inertiajs/react';
import { Bell, ChevronDown, Menu, Search, X } from 'lucide-react';
import { useState } from 'react';

const TAB_TITLES = {
    dashboard:     'Dashboard',
    memes:         'Memes',
    users:         'Users',
    trending:      'Trending',
    reports:       'Reports',
    feedback:      'Feedback',
    notifications: 'Notifications',
    settings:      'Settings',
    help:          'Help Center',
};

export default function Header({ toggleMobileMenu, profileDropdownOpen, toggleProfileDropdown, dropdownRef, tab, onSearch }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const title = TAB_TITLES[tab] ?? 'Dashboard';
    const [searchQuery, setSearchQuery] = useState('');

    const avatarUrl = user?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'Admin')}&background=f97316&color=fff&size=32`;

    return (
        <header className="sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

            {/* Left */}
            <div className="flex items-center gap-3">
                <button onClick={toggleMobileMenu}
                    className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
                    <Menu size={17} className="text-gray-600 dark:text-zinc-300" />
                </button>
                <h1 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h1>
            </div>

            {/* Center search */}
            <div className="hidden md:flex flex-1 justify-center max-w-sm mx-auto">
                <div className="relative w-full">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
                    <input 
                        type="text" 
                        placeholder="Search memes, users..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (onSearch) {
                                onSearch(e.target.value);
                            }
                        }}
                        className="w-full pl-9 pr-9 py-2 rounded-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:bg-white dark:focus:bg-zinc-700 transition" 
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                if (onSearch) {
                                    onSearch('');
                                }
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 transition"
                            aria-label="Clear search"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                <a href="/dashboard/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition" aria-label="Notifications">
                    <Bell size={17} className="text-gray-600 dark:text-zinc-300" />
                    {/* Only show badge if there are unread notifications */}
                    {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" /> */}
                </a>

                <div className="relative" ref={dropdownRef}>
                    <button onClick={toggleProfileDropdown}
                        className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                        <img src={avatarUrl} className="w-7 h-7 rounded-full object-cover" alt={user?.name} />
                        <span className="hidden xl:block text-sm font-medium text-gray-700 dark:text-zinc-200">{user?.name ?? 'Admin'}</span>
                        <ChevronDown size={13} className={`text-gray-400 dark:text-zinc-500 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {profileDropdownOpen && (
                        <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl py-1.5 z-50">
                            <div className="px-4 py-2.5 border-b border-gray-100 dark:border-zinc-700">
                                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user?.name}</p>
                                <p className="text-xs text-gray-400 dark:text-zinc-500 truncate capitalize">{user?.role}</p>
                            </div>
                            <a href="/profile"
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                                View Profile
                            </a>
                            <a href="/settings/profile"
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition">
                                Settings
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
