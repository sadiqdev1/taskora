import axios from 'axios';
import { Eye, Flame, Heart, MessageCircle, MoreVertical, Rocket, Trash2, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '../Contexts/ToastContexts';
import VerifiedBadge from '../../../components/VerifiedBadge';

const statusStyles = {
    approved: { cls: 'text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400',   icon: <TrendingUp size={12} /> },
    pending:  { cls: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 dark:text-yellow-400',icon: <Rocket size={12} /> },
    rejected: { cls: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400',            icon: <Flame size={12} /> },
};

function RowMenu({ meme, onAction }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button onClick={() => setOpen(!open)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300">
                <MoreVertical size={15} />
            </button>
            {open && (
                <div className="absolute right-0 mt-1.5 w-40 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl py-1.5 z-50">
                    {[
                        { icon: Eye,    label: 'View',   action: () => window.open(`/p/${meme.slug}`, '_blank') },
                        { icon: Trash2, label: 'Delete', action: () => onAction('delete', meme), danger: true },
                    ].map(({ icon: Icon, label, action, danger }) => (
                        <button key={label} onClick={() => { action(); setOpen(false); }}
                            className={`flex items-center gap-2.5 w-full px-4 py-2 text-sm transition-colors ${danger ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10' : 'text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700'}`}>
                            <Icon size={13} />{label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

const fmt = (n) => n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n ?? 0);

export default function DataTable() {
    const [memes, setMemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    const load = () => {
        setLoading(true);
        axios.get('/admin/memes', { params: { status: 'All' } })
            .then((r) => setMemes(r.data.data?.slice(0, 5) ?? []))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleAction = async (action, meme) => {
        try {
            if (action === 'delete') {
                await axios.delete(`/admin/memes/${meme.id}`);
                setMemes((p) => p.filter((m) => m.id !== meme.id));
                toast.addToast('Meme deleted', 'success');
            }
        } catch {
            toast.addToast('Action failed', 'error');
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-zinc-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Memes</h3>
                <span className="text-xs text-gray-400 dark:text-zinc-500">{memes.length} shown</span>
            </div>

            {loading ? (
                <div className="divide-y divide-gray-50 dark:divide-zinc-800">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-3 w-1/2 rounded-full bg-gray-100 dark:bg-zinc-800" />
                                <div className="h-2.5 w-1/3 rounded-full bg-gray-100 dark:bg-zinc-800" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : memes.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-zinc-500 text-center py-10">No memes yet</p>
            ) : (
                <div className="divide-y divide-gray-50 dark:divide-zinc-800">
                    {memes.map((meme) => {
                        const s = statusStyles[meme.status] ?? statusStyles.pending;
                        return (
                            <div key={meme.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                <img src={meme.image_url} alt={meme.title}
                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100 dark:bg-zinc-800" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 dark:text-zinc-200 truncate">{meme.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-gray-400 dark:text-zinc-500">{meme.user?.name ?? 'Unknown'}</span>
                                        {meme.user?.is_verified && <VerifiedBadge size={11} />}
                                        <span className="text-gray-300 dark:text-zinc-700">·</span>
                                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-zinc-400">
                                            <span className="flex items-center gap-1">
                                                <Heart size={12} className="text-red-500" />
                                                {fmt(meme.likes_count)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageCircle size={12} className="text-blue-500" />
                                                {fmt(meme.comments_count)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={12} className="text-gray-400 dark:text-zinc-500" />
                                                {fmt(meme.views_count ?? 0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <span className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
                                    {s.icon}{meme.status}
                                </span>
                                <RowMenu meme={meme} onAction={handleAction} />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
