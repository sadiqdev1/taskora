import axios from 'axios';
import { Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '../Contexts/ToastContexts';
import VerifiedBadge from '../../../components/VerifiedBadge';

const statusOptions = ['All', 'Pending', 'Resolved', 'Dismissed'];
const reasonOptions = ['All', 'Spam', 'Harassment', 'Inappropriate', 'Copyright', 'Other'];

const statusBadge = (s) => {
    const m = {
        pending:   'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
        resolved:  'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
        dismissed: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400',
    };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${m[s] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>{s}</span>;
};

const reasonBadge = (r) => {
    const m = {
        Spam:          'bg-orange-50 dark:bg-orange-500/10 text-orange-600',
        Harassment:    'bg-red-50 dark:bg-red-500/10 text-red-600',
        Inappropriate: 'bg-red-50 dark:bg-red-500/10 text-red-600',
        Copyright:     'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300',
        Other:         'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300',
    };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${m[r] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>{r}</span>;
};

function FilterDropdown({ value, options, onChange }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    return (
        <div className="relative flex-1 md:w-36" ref={ref}>
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

export default function ReportsManager({ searchQuery = '' }) {
    const [reports, setReports] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [reasonFilter, setReasonFilter] = useState('All');
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
            const res = await axios.get('/admin/reports', { params: { search, status: statusFilter, reason: reasonFilter, page: pg } });
            setReports(res.data.data);
            setMeta({ total: res.data.total, last_page: res.data.last_page });
            setPage(pg);
        } catch {}
        setLoading(false);
    }, [search, statusFilter, reasonFilter]);

    useEffect(() => {
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => load(1), 300);
        return () => clearTimeout(searchTimer.current);
    }, [search, statusFilter, reasonFilter, load]);

    const action = async (type, report) => {
        try {
            if (type === 'resolve') {
                await axios.post(`/admin/reports/${report.id}/resolve`);
                setReports((p) => p.map((r) => r.id === report.id ? { ...r, status: 'resolved' } : r));
                toast.addToast('Report resolved', 'success');
            } else if (type === 'dismiss') {
                await axios.post(`/admin/reports/${report.id}/dismiss`);
                setReports((p) => p.map((r) => r.id === report.id ? { ...r, status: 'dismissed' } : r));
                toast.addToast('Report dismissed', 'info');
            }
        } catch {
            toast.addToast('Action failed', 'error');
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
                    <input type="text" placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition" />
                </div>
                <div className="flex gap-2">
                    <FilterDropdown value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
                    <FilterDropdown value={reasonFilter} options={reasonOptions} onChange={setReasonFilter} />
                </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[640px]">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                            <tr>
                                {['Meme', 'Reporter', 'Reason', 'Date', 'Status', 'Actions'].map((h) => (
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
                            ) : reports.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-zinc-500">No reports found.</td></tr>
                            ) : reports.map((report) => (
                                <tr key={report.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {report.meme?.image_url && (
                                                <img src={report.meme.image_url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0 bg-gray-100 dark:bg-zinc-800" />
                                            )}
                                            <p className="text-sm text-gray-700 dark:text-zinc-300 truncate max-w-[140px]">{report.meme?.title ?? '—'}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm text-gray-600 dark:text-zinc-400">{report.reporter?.name ?? '—'}</span>
                                            {report.reporter?.is_verified && <VerifiedBadge size={12} />}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{reasonBadge(report.reason)}</td>
                                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-500">{report.created_at}</td>
                                    <td className="px-4 py-3">{statusBadge(report.status)}</td>
                                    <td className="px-4 py-3">
                                        {report.status === 'pending' && (
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => action('resolve', report)} title="Resolve"
                                                    className="p-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-500/10 text-green-500 transition">
                                                    <CheckCircle size={15} />
                                                </button>
                                                <button onClick={() => action('dismiss', report)} title="Dismiss"
                                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 dark:text-zinc-500 transition">
                                                    <X size={15} />
                                                </button>
                                            </div>
                                        )}
                                    </td>
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
                            <div className="h-4 w-1/2 rounded-full bg-gray-100 dark:bg-zinc-800 mb-2" />
                            <div className="h-3 w-3/4 rounded-full bg-gray-100 dark:bg-zinc-800" />
                        </div>
                    ))
                ) : reports.map((report) => (
                    <div key={report.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4 space-y-2">
                        <div className="flex items-center gap-2">
                            {report.meme?.image_url && <img src={report.meme.image_url} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 dark:text-zinc-200 truncate">{report.meme?.title ?? '—'}</p>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-xs text-gray-400 dark:text-zinc-500">by {report.reporter?.name ?? '—'} · {report.created_at}</p>
                                    {report.reporter?.is_verified && <VerifiedBadge size={11} />}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {reasonBadge(report.reason)}
                            {statusBadge(report.status)}
                        </div>
                        {report.status === 'pending' && (
                            <div className="flex gap-2 pt-2 border-t border-gray-50 dark:border-zinc-800">
                                <button onClick={() => action('resolve', report)} className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition">Resolve</button>
                                <button onClick={() => action('dismiss', report)} className="flex-1 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 rounded-lg text-xs font-semibold transition">Dismiss</button>
                            </div>
                        )}
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
