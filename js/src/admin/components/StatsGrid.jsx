import axios from 'axios';
import { Flag, Image, TrendingDown, TrendingUp, Upload, Users } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// ── Consistent color system ───────────────────────────────────────────────────
// Primary   → orange  (brand, main actions)
// Secondary → zinc    (neutral, text, borders)
// Accent    → used sparingly per card meaning:
//   Memes   → orange (primary — core content)
//   Users   → orange/10 tint (secondary — community)
//   Uploads → orange (primary — activity)
//   Reports → red    (accent — alert/attention only)

const STAT_CONFIG = [
    {
        key:       'total_memes',
        changeKey: 'memes_change',
        icon:      Image,
        label:     'Total Memes',
        sublabel:  'vs last week',
        iconBg:    'bg-orange-500/10 dark:bg-orange-500/15',
        iconColor: 'text-orange-500',
        bar:       'bg-orange-500',
    },
    {
        key:       'active_users',
        changeKey: 'users_change',
        icon:      Users,
        label:     'Active Users',
        sublabel:  'vs last week',
        iconBg:    'bg-zinc-100 dark:bg-zinc-800',
        iconColor: 'text-zinc-500 dark:text-zinc-400',
        bar:       'bg-zinc-400 dark:bg-zinc-500',
    },
    {
        key:       'uploads_today',
        changeKey: 'uploads_change',
        icon:      Upload,
        label:     'Uploads Today',
        sublabel:  'vs yesterday',
        iconBg:    'bg-orange-500/10 dark:bg-orange-500/15',
        iconColor: 'text-orange-500',
        bar:       'bg-orange-400',
    },
    {
        key:       'pending_reports',
        changeKey: 'reports_change',
        icon:      Flag,
        label:     'Pending Reports',
        sublabel:  'need review',
        iconBg:    'bg-red-50 dark:bg-red-500/10',
        iconColor: 'text-red-500',
        bar:       'bg-red-400',
    },
];

const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n ?? 0);

function TrendBadge({ change }) {
    if (change === null || change === undefined) return null;
    const up   = change > 0;
    const flat = change === 0;

    if (flat) return (
        <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">—</span>
    );

    return (
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
            up ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
        }`}>
            {up
                ? <TrendingUp size={11} className="flex-shrink-0" />
                : <TrendingDown size={11} className="flex-shrink-0" />
            }
            {up ? '+' : ''}{change}%
        </span>
    );
}

export default function StatsGrid() {
    const [stats, setStats] = useState(null);
    const [counts, setCounts] = useState([0, 0, 0, 0]);
    const [visible, setVisible] = useState(false);
    const gridRef = useRef(null);

    useEffect(() => {
        axios.get('/admin/stats').then((r) => setStats(r.data)).catch(() => {});
    }, []);

    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
        if (gridRef.current) obs.observe(gridRef.current);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (!visible || !stats) return;
        STAT_CONFIG.forEach(({ key }, i) => {
            const target = stats[key] ?? 0;
            if (target === 0) return;
            let cur = 0;
            const step = target / (1200 / 16);
            const timer = setInterval(() => {
                cur += step;
                if (cur >= target) { cur = target; clearInterval(timer); }
                setCounts((p) => { const n = [...p]; n[i] = Math.floor(cur); return n; });
            }, 16);
        });
    }, [visible, stats]);

    return (
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {STAT_CONFIG.map(({ icon: Icon, iconBg, iconColor, label, sublabel, bar, changeKey }, i) => (
                <div key={label} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-5 flex flex-col gap-3">

                    {/* Top row — icon + trend */}
                    <div className="flex items-start justify-between">
                        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={16} className={iconColor} />
                        </div>
                        <div className="text-right">
                            {stats ? (
                                <TrendBadge change={stats[changeKey]} />
                            ) : (
                                <div className="h-3.5 w-10 rounded-full bg-gray-100 dark:bg-zinc-800 animate-pulse" />
                            )}
                            {stats && (
                                <p className="text-[10px] text-gray-400 dark:text-zinc-600 mt-0.5">{sublabel}</p>
                            )}
                        </div>
                    </div>

                    {/* Value + label */}
                    <div>
                        {stats ? (
                            <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                {fmt(counts[i])}
                            </p>
                        ) : (
                            <div className="h-7 w-20 rounded-lg bg-gray-100 dark:bg-zinc-800 animate-pulse mb-1" />
                        )}
                        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">{label}</p>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${bar} rounded-full transition-all duration-1000`}
                            style={{
                                width: stats
                                    ? `${Math.min((counts[i] / Math.max(stats[STAT_CONFIG[i].key] ?? 1, 1)) * 100, 100)}%`
                                    : '0%',
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
