import axios from 'axios';
import { Flag, Heart, Upload, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const typeIcon = {
    upload: { icon: Upload, bg: 'bg-orange-50 dark:bg-orange-500/10', color: 'text-orange-500'                    },
    report: { icon: Flag,   bg: 'bg-red-50 dark:bg-red-500/10',       color: 'text-red-500'                       },
    user:   { icon: User,   bg: 'bg-zinc-100 dark:bg-zinc-800',       color: 'text-zinc-500 dark:text-zinc-400'   },
    like:   { icon: Heart,  bg: 'bg-red-50 dark:bg-red-500/10',       color: 'text-red-500'                       },
};

export default function RecentActivity() {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/admin/activity')
            .then((r) => setActivity(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
                {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-3 w-3/4 rounded-full bg-gray-100 dark:bg-zinc-800" />
                                <div className="h-2.5 w-1/2 rounded-full bg-gray-100 dark:bg-zinc-800" />
                            </div>
                        </div>
                    ))
                    : activity.length === 0
                        ? <p className="text-sm text-gray-400 dark:text-zinc-500 text-center py-4">No recent activity</p>
                        : activity.map((item, i) => {
                            const cfg = typeIcon[item.type] ?? typeIcon.upload;
                            const Icon = cfg.icon;
                            return (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                                        <Icon size={14} className={cfg.color} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800 dark:text-zinc-200 leading-snug">{item.message}</p>
                                        {item.detail && <p className="text-xs text-gray-400 dark:text-zinc-500 truncate mt-0.5">{item.detail}</p>}
                                    </div>
                                    <span className="text-[11px] text-gray-400 dark:text-zinc-500 whitespace-nowrap flex-shrink-0">{item.time}</span>
                                </div>
                            );
                        })
                }
            </div>
        </div>
    );
}
