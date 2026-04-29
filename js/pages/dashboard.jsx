import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';import { Flame } from 'lucide-react';
import Sidebar from '@/src/admin/components/Sidebar';
import Header from '@/src/admin/components/Header';
import StatsGrid from '@/src/admin/components/StatsGrid';
import ActivityChart from '@/src/admin/components/ActivityChart';
import RecentActivity from '@/src/admin/components/RecentActivity';
import DataTable from '@/src/admin/components/DataTable';
import MemesManager from '@/src/admin/tabs/MemesManager';
import UsersManager from '@/src/admin/tabs/UsersManager';
import TrendingView from '@/src/admin/tabs/TrendingView';
import ReportsManager from '@/src/admin/tabs/ReportsManager';
import NotificationsView from '@/src/admin/tabs/NotificationsView';
import SettingsView from '@/src/admin/tabs/SettingsView';
import HelpView from '@/src/admin/tabs/HelpView';
import FeedbackView from '@/src/admin/tabs/FeedbackView';
import GlobalLoader from '@/src/admin/components/GlobalLoader';import { ToastProvider } from '@/src/admin/Contexts/ToastContexts';
import '@/src/admin/Dashboard.css';

// ── Tab-level skeleton loader ─────────────────────────────────────────────────
const Sk = ({ w = 'w-full', h = 'h-4', extra = '' }) => (
    <div className={`${w} ${h} rounded-lg bg-gray-100 dark:bg-zinc-800 animate-pulse ${extra}`} />
);

function TabLoader({ tab }) {
    // Table-style tabs
    if (['memes', 'users', 'reports', 'feedback', 'trending'].includes(tab)) {
        return (
            <div className="space-y-4" style={{ animation: 'fadeIn .2s ease' }}>
                <div className="flex gap-2">
                    <Sk w="flex-1" h="h-10" />
                    <Sk w="w-36" h="h-10" />
                    <Sk w="w-36" h="h-10" />
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-zinc-800/50 px-4 py-3 flex gap-4">
                        {[2, 3, 2, 1.5, 1].map((w, i) => <Sk key={i} w={`w-${w === 2 ? '24' : w === 3 ? '32' : w === 1.5 ? '20' : '16'}`} h="h-3" />)}
                    </div>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-t border-gray-50 dark:border-zinc-800">
                            <Sk w="w-10" h="h-10" extra="rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-2"><Sk w="w-1/3" h="h-3" /><Sk w="w-1/4" h="h-2.5" /></div>
                            <Sk w="w-16" h="h-6" extra="rounded-full" />
                            <Sk w="w-12" h="h-3" />
                            <Sk w="w-16" h="h-7" extra="rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    // Notifications
    if (tab === 'notifications') {
        return (
            <div className="space-y-3" style={{ animation: 'fadeIn .2s ease' }}>
                <div className="flex justify-between"><Sk w="w-36" h="h-10" /><Sk w="w-32" h="h-10" /></div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4 flex items-center gap-3">
                        <Sk w="w-9" h="h-9" extra="rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2"><Sk w="w-1/2" h="h-3" /><Sk w="w-1/3" h="h-2.5" /></div>
                        <Sk w="w-16" h="h-6" extra="rounded-full" />
                    </div>
                ))}
            </div>
        );
    }
    // Settings
    if (tab === 'settings') {
        return (
            <div className="space-y-5 max-w-2xl" style={{ animation: 'fadeIn .2s ease' }}>
                {[1,2,3,4].map((i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                            <Sk w="w-8" h="h-8" extra="rounded-lg flex-shrink-0" />
                            <Sk w="w-32" h="h-4" />
                        </div>
                        <div className="px-5 py-4 space-y-4">
                            {Array.from({ length: 2 }).map((_, j) => (
                                <div key={j} className="flex items-center justify-between">
                                    <div className="space-y-1.5"><Sk w="w-32" h="h-3.5" /><Sk w="w-48" h="h-2.5" /></div>
                                    <Sk w="w-11" h="h-6" extra="rounded-full flex-shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
    // Dashboard home
    return (
        <div className="space-y-5" style={{ animation: 'fadeIn .2s ease' }}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1,2,3,4].map((i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 space-y-3">
                        <div className="flex justify-between"><Sk w="w-10" h="h-10" extra="rounded-xl" /><Sk w="w-12" h="h-5" extra="rounded-full" /></div>
                        <Sk w="w-20" h="h-7" />
                        <Sk w="w-24" h="h-3" />
                        <Sk h="h-1.5" extra="rounded-full" />
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5">
                    <div className="flex justify-between mb-5"><Sk w="w-40" h="h-5" /><Sk w="w-36" h="h-9" extra="rounded-full" /></div>
                    <Sk h="h-56" extra="rounded-xl" />
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-5 space-y-4">
                    <Sk w="w-32" h="h-4" />
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Sk w="w-8" h="h-8" extra="rounded-full flex-shrink-0" />
                            <div className="flex-1 space-y-1.5"><Sk h="h-3" /><Sk w="w-2/3" h="h-2.5" /></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const DashboardHome = () => {
    const { auth } = usePage().props;
    return (
    <>
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Welcome back, {auth?.user?.name ?? 'Admin'} <Flame className="text-orange-500" size={20} />
                </h1>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">Here's what's happening on your platform today.</p>
            </div>
        </div>
        <StatsGrid />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <ActivityChart />
            <RecentActivity />
        </div>
        <DataTable />
    </>
    );
};

const tabs = {
    dashboard: DashboardHome,
    memes: MemesManager,
    users: UsersManager,
    trending: TrendingView,
    reports: ReportsManager,
    notifications: NotificationsView,
    settings: SettingsView,
    help: HelpView,
    feedback: FeedbackView,
};

export default function Dashboard() {
    const { activeTab: serverTab } = usePage().props;
    const activeTab = serverTab ?? 'dashboard';

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const changeTab = (tab) => {
        if (tab === activeTab) return;
        closeMobileMenu();
        const url = tab === 'dashboard' ? '/dashboard' : `/dashboard/${tab}`;
        router.visit(url, { preserveScroll: false });
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen((p) => !p);
        document.body.classList.toggle('overflow-hidden');
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        document.body.classList.remove('overflow-hidden');
    };

    const toggleProfileDropdown = (e) => { e.stopPropagation(); setProfileDropdownOpen((p) => !p); };

    useEffect(() => {
        const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileDropdownOpen(false); };
        document.addEventListener('click', h);
        return () => document.removeEventListener('click', h);
    }, []);

    useEffect(() => {
        const h = () => { if (window.innerWidth >= 768) { setMobileMenuOpen(false); document.body.classList.remove('overflow-hidden'); } };
        window.addEventListener('resize', h);
        return () => window.removeEventListener('resize', h);
    }, []);

    const ActiveTab = tabs[activeTab] || DashboardHome;

    return (
        <ToastProvider>
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-zinc-950">
            <Head title="Dashboard" />
            {mobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMobileMenu} />}

            <Sidebar mobileMenuOpen={mobileMenuOpen} closeMobileMenu={closeMobileMenu} activeTab={activeTab} setActiveTab={changeTab} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
                <Header
                    toggleMobileMenu={toggleMobileMenu}
                    profileDropdownOpen={profileDropdownOpen}
                    toggleProfileDropdown={toggleProfileDropdown}
                    dropdownRef={dropdownRef}
                    tab={activeTab}
                />
                <main className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-gray-50 dark:bg-zinc-950">
                    <ActiveTab />
                </main>
            </div>
        </div>
        </ToastProvider>
    );
}

// inject fadeIn for tab loader
if (typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}';
    document.head.appendChild(s);
}