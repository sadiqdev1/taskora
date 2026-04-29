import axios from 'axios';
import { Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Clock, Search, Star } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '../Contexts/ToastContexts';
import VerifiedBadge from '../../../components/VerifiedBadge';

const typeOptions   = ['All', 'Bug Report', 'Feature Request', 'General Feedback', 'UI/UX Suggestion', 'Other'];
const statusOptions = ['All', 'New', 'In Review', 'Resolved'];

const statusBadge = (s) => {
    const m = {
        new:       'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
        in_review: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
        resolved:  'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400',
    };
    const label = { new: 'New', in_review: 'In Review', resolved: 'Resolved' };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${m[s] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>{label[s] || s}</span>;
};

const typeBadge = (t) => {
    const colors = {
        'Bug Report':       'bg-red-50 dark:bg-red-500/10 text-red-600',
        'Feature Request':  'bg-orange-50 dark:bg-orange-500/10 text-orange-600',
        'General Feedback': 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300',
        'UI/UX Suggestion': 'bg-orange-50 dark:bg-orange-500/10 text-orange-600',
        Other:              'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300',
    };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${colors[t] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600'}`}>{t}</span>;
};

const Stars = ({ rating }) => (
    <div className="flex gap-1">
        {[1,2,3,4,5].map((s) => <Star key={s} size={12} className={s <= rating ? 'text-orange-400 fill-orange-400' : 'text-gray-200 dark:text-zinc-700'} />)}
    </div>
);

function FilterDropdown({ value, options, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    return (
        <div className="relative flex-1 md:w-44" ref={ref}>
            <button onClick={() => setOpen(!open)} className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-left flex items-center justify-between text-sm hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition">
                <span className="text-gray-700 dark:text-zinc-200 truncate">{value}</span>
                <ChevronDown size={14} className={`text-gray-400 dark:text-zinc-500 transition-transform flex-shrink-0 ml-1 ${open ? 'rotate-180' : ''}`} />
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

export default function FeedbackView({ searchQuery = '' }) {
    const [feedback, setFeedback] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const toast = useToast();
    const searchTimer = useRef(null);

    // Sync with global search
    useEffect(() => {
        if (searchQuery !== undefined && searchQuery !== search) {
            setSearch(searchQuery);
        }
    }, [searchQuery]);

    const load = useCallback(async (pg = 1) => {
        setLoading(true);
        try {
            const res = await axios.get('/admin/feedback', { params: { search, type: typeFilter, status: statusFilter, page: pg } });
            setFeedback(res.data.data);
            setMeta({ total: res.data.total, last_page: res.data.last_page });
            setPage(pg);
        } catch {}
        setLoading(false);
    }, [search, typeFilter, statusFilter]);

    useEffect(() => {
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => load(1), 300);
        return () => clearTimeout(searchTimer.current);
    }, [search, typeFilter, statusFilter, load]);

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`/admin/feedback/${id}`, { status });
            setFeedback((p) => p.map((f) => f.id === id ? { ...f, status } : f));
            toast.addToast(`Status updated to ${status.replace('_', ' ')}`, 'success');
        } catch {
            toast.addToast('Update failed', 'error');
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
                    <input type="text" placeholder="Search feedback..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition" />
                </div>
                <div className="flex gap-2">
                    <FilterDropdown value={typeFilter}   options={typeOptions}   onChange={setTypeFilter} />
                    <FilterDropdown value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
                </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                            <tr>
                                {['User', 'Type', 'Message', 'Rating', 'Date', 'Status', 'Actions'].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}><td colSpan={7} className="px-4 py-3">
                                        <div className="h-8 rounded-lg bg-gray-100 dark:bg-zinc-800 animate-pulse" />
                                    </td></tr>
                                ))
                            ) : feedback.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-zinc-500">No feedback found.</td></tr>
                            ) : feedback.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-zinc-200 text-sm">{item.user?.name ?? 'Anonymous'}</p>
                                                <p className="text-xs text-gray-400 dark:text-zinc-500">{item.user?.email ?? '—'}</p>
                                            </div>
                                            {item.user?.is_verified && <VerifiedBadge size={12} />}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{typeBadge(item.type)}</td>
                                    <td className="px-4 py-3 max-w-[200px]"><p className="truncate text-sm text-gray-600 dark:text-zinc-400">{item.message}</p></td>
                                    <td className="px-4 py-3"><Stars rating={item.rating ?? 0} /></td>
                                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-500">{item.created_at}</td>
                                    <td className="px-4 py-3">{statusBadge(item.status)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            {item.status !== 'in_review' && (
                                                <button onClick={() => updateStatus(item.id, 'in_review')} title="Mark In Review"
                                                    className="p-1.5 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-500/10 text-yellow-500 transition">
                                                    <Clock size={14} />
                                                </button>
                                            )}
                                            {item.status !== 'resolved' && (
                                                <button onClick={() => updateStatus(item.id, 'resolved')} title="Resolve"
                                                    className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10 text-green-500 transition">
                                                    <CheckCircle size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile cards */}
            <div className="block md:hidden space-y-3">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4 animate-pulse">
                            <div className="h-4 w-1/2 rounded-full bg-gray-100 dark:bg-zinc-800 mb-2" />
                            <div className="h-3 w-3/4 rounded-full bg-gray-100 dark:bg-zinc-800" />
                        </div>
                    ))
                ) : feedback.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                <p className="text-sm font-medium text-gray-800 dark:text-zinc-200">{item.user?.name ?? 'Anonymous'}</p>
                                {item.user?.is_verified && <VerifiedBadge size={12} />}
                            </div>
                            {statusBadge(item.status)}
                        </div>
                        {typeBadge(item.type)}
                        <p className="text-sm text-gray-600 dark:text-zinc-400">{item.message}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-zinc-800">
                            <Stars rating={item.rating ?? 0} />
                            <div className="flex gap-1">
                                {item.status !== 'resolved' && (
                                    <button onClick={() => updateStatus(item.id, 'resolved')}
                                        className="px-3 py-1.5 bg-green-500 text-white rounded-full text-xs font-medium">Resolve</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {meta && meta.last_page > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-zinc-400">Page {page} of {meta.last_page} · {meta.total} total</p>
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
