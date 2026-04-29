import axios from 'axios';
import { ArrowUp, Check, ChevronDown, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import VerifiedBadge from '../../../components/VerifiedBadge';

const sortOptions = ['Hot', 'Top', 'Rising'];
const fmt = (n) => n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n ?? 0);

function FilterDropdown({ value, options, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    return (
        <div className="relative w-full md:w-36" ref={ref}>
            <button onClick={() => setOpen(!open)} className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-left flex items-center justify-between text-sm hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition">
                <span className="text-gray-700 dark:text-zinc-200">{value}</span>
                <ChevronDown size={14} className={`text-gray-400 dark:text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute z-20 mt-1.5 w-full bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl py-1.5">
                    {options.map((opt) => (
                        <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${value === opt ? 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 font-medium' : 'text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700'}`}>
                            {opt}{value === opt && <Check size={13} className="text-orange-500" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function TrendingView() {
    const [memes, setMemes] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('Hot');
    const [page, setPage] = useState(1);

    const load = useCallback(async (pg = 1) => {
        setLoading(true);
        try {
            const res = await axios.get('/admin/trending', { params: { sort: sortBy, page: pg } });
            setMemes(res.data.data);
            setMeta({ total: res.data.total, last_page: res.data.last_page });
            setPage(pg);
        } catch {}
        setLoading(false);
    }, [sortBy]);

    useEffect(() => { load(1); }, [load]);

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2">
                <FilterDropdown value={sortBy} options={sortOptions} onChange={setSortBy} />
                <p className="text-xs text-gray-400 dark:text-zinc-500">{meta?.total ?? 0} memes</p>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[560px]">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                            <tr>
                                {['#', 'Meme', 'Author', 'Likes', 'Comments', 'Posted'].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}><td colSpan={6} className="px-4 py-3">
                                        <div className="h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 animate-pulse" />
                                    </td></tr>
                                ))
                            ) : memes.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-zinc-500">No trending memes yet.</td></tr>
                            ) : memes.map((meme, i) => (
                                <tr key={meme.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <span className={`text-sm font-bold ${i === 0 ? 'text-orange-500' : i === 1 ? 'text-gray-500 dark:text-zinc-400' : i === 2 ? 'text-amber-600' : 'text-gray-400 dark:text-zinc-500'}`}>
                                            #{(page - 1) * 10 + i + 1}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={meme.image_url} alt={meme.title} className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />
                                            <p className="text-sm font-medium text-gray-800 dark:text-zinc-200 truncate max-w-[160px]">{meme.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm text-gray-600 dark:text-zinc-400">{meme.user?.name ?? '—'}</span>
                                            {meme.user?.is_verified && <VerifiedBadge size={12} />}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-zinc-300">
                                            <ArrowUp size={13} className="text-orange-500" />{fmt(meme.likes_count)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="flex items-center gap-1 text-sm text-gray-700 dark:text-zinc-300">
                                            <MessageCircle size={13} className="text-blue-400" />{fmt(meme.comments_count)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-500">{meme.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4 animate-pulse">
                            <div className="flex gap-3"><div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800" /><div className="flex-1 space-y-2"><div className="h-3.5 w-2/3 rounded-full bg-gray-100 dark:bg-zinc-800" /><div className="h-3 w-1/3 rounded-full bg-gray-100 dark:bg-zinc-800" /></div></div>
                        </div>
                    ))
                ) : memes.map((meme, i) => (
                    <div key={meme.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4 flex gap-3 items-center">
                        <span className={`text-lg font-extrabold w-7 text-center flex-shrink-0 ${i === 0 ? 'text-orange-500' : i === 1 ? 'text-gray-400 dark:text-zinc-500' : i === 2 ? 'text-amber-600' : 'text-gray-300 dark:text-zinc-600'}`}>
                            {(page - 1) * 10 + i + 1}
                        </span>
                        <img src={meme.image_url} alt={meme.title} className="w-12 h-12 rounded-xl object-cover bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200 truncate">{meme.title}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <p className="text-xs text-gray-400 dark:text-zinc-500">{meme.user?.name ?? '—'} · {meme.created_at}</p>
                                {meme.user?.is_verified && <VerifiedBadge size={11} />}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-zinc-400">
                                <span className="flex items-center gap-1"><ArrowUp size={11} className="text-orange-500" />{fmt(meme.likes_count)}</span>
                                <span className="flex items-center gap-1"><MessageCircle size={11} className="text-blue-400" />{fmt(meme.comments_count)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
