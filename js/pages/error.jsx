import { Head, Link } from '@inertiajs/react';
import { Home, RotateCcw, Search, TrendingUp, Wifi, WifiOff, ShieldOff, ServerCrash, FileQuestion } from 'lucide-react';
import chortleLogo from '@/src/assets/chortle-logo.svg';

const CONFIG = {
    404: {
        icon: FileQuestion,
        emoji: '🔍',
        color: 'from-violet-500 to-purple-600',
        bg: 'bg-violet-50 dark:bg-violet-500/10',
        border: 'border-violet-100 dark:border-violet-500/20',
        badge: 'bg-violet-500 shadow-violet-500/30',
        title: 'Page not found',
        subtitle: "This page doesn't exist or was moved.",
        hint: "Double-check the URL, or head back home.",
    },
    403: {
        icon: ShieldOff,
        emoji: '🔒',
        color: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        border: 'border-amber-100 dark:border-amber-500/20',
        badge: 'bg-amber-500 shadow-amber-500/30',
        title: 'Access denied',
        subtitle: "You don't have permission to view this.",
        hint: "If you think this is a mistake, try logging in.",
    },
    500: {
        icon: ServerCrash,
        emoji: '💥',
        color: 'from-red-500 to-rose-600',
        bg: 'bg-red-50 dark:bg-red-500/10',
        border: 'border-red-100 dark:border-red-500/20',
        badge: 'bg-red-500 shadow-red-500/30',
        title: 'Server error',
        subtitle: "Something went wrong on our end.",
        hint: "We've been notified. Try refreshing in a moment.",
    },
    503: {
        icon: WifiOff,
        emoji: '🔧',
        color: 'from-sky-500 to-blue-600',
        bg: 'bg-sky-50 dark:bg-sky-500/10',
        border: 'border-sky-100 dark:border-sky-500/20',
        badge: 'bg-sky-500 shadow-sky-500/30',
        title: 'Down for maintenance',
        subtitle: "We're making things better.",
        hint: "Check back in a few minutes.",
    },
};

export default function ErrorPage({ status = 404 }) {
    const cfg = CONFIG[status] ?? CONFIG[500];
    const Icon = cfg.icon;

    return (
        <>
            <Head title={`${status} — ${cfg.title}`} />

            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col">

                {/* Minimal nav */}
                <header className="border-b border-gray-100 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
                    <div className="mx-auto flex h-14 max-w-5xl items-center px-4 md:px-6">
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                                <img src={chortleLogo} alt="Chortle" className="h-5 w-5 object-contain" />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white text-sm">Chortle</span>
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 flex items-center justify-center px-4 py-20">
                    <div className="w-full max-w-md text-center">

                        {/* Icon block */}
                        <div className="relative inline-flex mb-8">
                            <div className={`w-24 h-24 rounded-3xl ${cfg.bg} border ${cfg.border} flex items-center justify-center`}>
                                <Icon size={40} className={`bg-gradient-to-br ${cfg.color} bg-clip-text`}
                                    style={{ color: 'transparent', stroke: 'url(#grad)' }} />
                                {/* Fallback solid icon for browsers that don't support SVG gradient stroke */}
                                <span className="sr-only">{cfg.emoji}</span>
                            </div>
                            {/* Status badge */}
                            <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-2xl ${cfg.badge} shadow-lg flex items-center justify-center`}>
                                <span className="text-white font-black text-[10px] leading-none">{status}</span>
                            </div>
                        </div>

                        {/* Text */}
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-2">
                            {cfg.title}
                        </h1>
                        <p className="text-gray-500 dark:text-zinc-400 text-base mb-1">
                            {cfg.subtitle}
                        </p>
                        <p className="text-gray-400 dark:text-zinc-500 text-sm mb-8">
                            {cfg.hint}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mb-10">
                            <Link href="/"
                                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/25 active:scale-[.97] text-sm w-full sm:w-auto justify-center">
                                <Home size={15} />
                                Go home
                            </Link>

                            {status === 500 ? (
                                <button onClick={() => window.location.reload()}
                                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all text-sm w-full sm:w-auto justify-center">
                                    <RotateCcw size={15} />
                                    Try again
                                </button>
                            ) : (
                                <Link href="/search"
                                    className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all text-sm w-full sm:w-auto justify-center">
                                    <Search size={15} />
                                    Search
                                </Link>
                            )}

                            <Link href="/trending"
                                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-semibold rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all text-sm w-full sm:w-auto justify-center">
                                <TrendingUp size={15} />
                                Trending
                            </Link>
                        </div>

                        {/* Footer note */}
                        <p className="text-xs text-gray-300 dark:text-zinc-700">
                            Error {status} · Chortle
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}
