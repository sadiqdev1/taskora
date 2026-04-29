import axios from 'axios';
import { AlertTriangle, Check, CheckCircle, ChevronDown, ChevronLeft, ChevronRight, Flag, Heart, Loader2, MessageCircle, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '../Contexts/ToastContexts';
import VerifiedBadge from '../../../components/VerifiedBadge';

const statusOptions  = ['All', 'Pending', 'Approved', 'Rejected'];
const categoryOptions = ['Funny', 'Dank', 'Wholesome', 'Dark Humor', 'Memes', 'Other'];

// ── Shared confirm modal ──────────────────────────────────────────────────────
function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onClose, danger = true }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl"
                style={{ animation: 'modalIn .2s cubic-bezier(.16,1,.3,1)' }}
                onClick={(e) => e.stopPropagation()}>
                <div className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-50 dark:bg-red-500/10' : 'bg-orange-50 dark:bg-orange-500/10'}`}>
                        <AlertTriangle size={22} className={danger ? 'text-red-500' : 'text-orange-500'} />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">{message}</p>
                </div>
                <div className="flex items-center gap-2 px-6 pb-6">
                    <button onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
                        Cancel
                    </button>
                    <button onClick={() => { onConfirm(); onClose(); }}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition active:scale-[.97] ${danger ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}>
                        {confirmLabel}
                    </button>
                </div>
                <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
            </div>
        </div>
    );
}

// ── Create Meme Modal ─────────────────────────────────────────────────────────
function CreateMemeModal({ onClose, onCreated }) {
    const [title, setTitle]     = useState('');
    const [category, setCategory] = useState('Funny');
    const [status, setStatus]   = useState('approved');
    const [image, setImage]     = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors]   = useState({});
    const fileRef = useRef(null);
    const toast   = useToast();

    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file); setPreview(URL.createObjectURL(file));
    };
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        setImage(file); setPreview(URL.createObjectURL(file));
    };

    const submit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!title.trim()) errs.title = 'Title is required';
        if (!image)        errs.image = 'Image is required';
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('image', image); fd.append('title', title);
            fd.append('category', category); fd.append('status', status);
            const res = await axios.post('/admin/memes', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.addToast('Meme created', 'success');
            onCreated(res.data); onClose();
        } catch (err) {
            toast.addToast(err.response?.data?.message || 'Failed', 'error');
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
        }
        setSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl"
                style={{ animation: 'modalIn .25s cubic-bezier(.16,1,.3,1)' }}
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">Create Meme</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-gray-400 dark:text-zinc-500"><X size={16} /></button>
                </div>
                <form onSubmit={submit} className="px-6 py-5 space-y-4">
                    <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={() => fileRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-xl cursor-pointer transition-colors ${preview ? 'border-orange-300 dark:border-orange-500/40' : 'border-gray-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-500/40'}`}>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-xl" />
                                <button type="button" onClick={(e) => { e.stopPropagation(); setImage(null); setPreview(null); }}
                                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition"><X size={13} /></button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 gap-2">
                                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
                                    <Upload size={18} className="text-orange-500" />
                                </div>
                                <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">Drop image or click to browse</p>
                                <p className="text-xs text-gray-400 dark:text-zinc-500">JPG, PNG, GIF, WebP · max 10MB</p>
                            </div>
                        )}
                    </div>
                    {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide">Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your meme a title..."
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition" />
                        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide">Category</label>
                            <FilterDropdown value={category} options={categoryOptions} onChange={setCategory} className="w-full" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide">Status</label>
                            <FilterDropdown value={status.charAt(0).toUpperCase() + status.slice(1)} options={['Approved', 'Pending']} onChange={(v) => setStatus(v.toLowerCase())} className="w-full" />
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                        <button type="submit" disabled={submitting}
                            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-all disabled:opacity-50 active:scale-[.97]">
                            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                            {submitting ? 'Creating...' : 'Create Meme'}
                        </button>
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition">Cancel</button>
                    </div>
                </form>
                <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
            </div>
        </div>
    );
}

const statusBadge = (s) => {
    const m = {
        approved: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
        pending:  'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
        rejected: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400',
    };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${m[s] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>{s}</span>;
};

const fmt = (n) => n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n ?? 0);

function FilterDropdown({ value, options, onChange, className = 'w-full md:w-36' }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);
    return (
        <div className={`relative ${className}`} ref={ref}>
            <button onClick={() => setOpen(!open)} className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-left flex items-center justify-between text-sm hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400/40 transition">
                <span className="text-gray-700 dark:text-zinc-200">{value}</span>
                <ChevronDown size={14} className={`text-gray-400 dark:text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {open && (
                <div className="absolute z-50 mt-1.5 w-full bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl py-1.5">
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

export default function MemesManager({ searchQuery = '' }) {
    const [memes, setMemes]           = useState([]);
    const [meta, setMeta]             = useState(null);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage]             = useState(1);
    const [showCreate, setShowCreate] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null); // meme to delete
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
            const res = await axios.get('/admin/memes', { params: { search, status: statusFilter, page: pg } });
            setMemes(res.data.data);
            setMeta({ total: res.data.total, last_page: res.data.last_page });
            setPage(pg);
        } catch {}
        setLoading(false);
    }, [search, statusFilter]);

    useEffect(() => {
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => load(1), 300);
        return () => clearTimeout(searchTimer.current);
    }, [search, statusFilter, load]);

    const action = async (type, meme) => {
        try {
            if (type === 'approve') {
                await axios.post(`/admin/memes/${meme.id}/approve`);
                setMemes((p) => p.map((m) => m.id === meme.id ? { ...m, status: 'approved' } : m));
                toast.addToast('Meme approved', 'success');
            } else if (type === 'reject') {
                await axios.post(`/admin/memes/${meme.id}/reject`);
                setMemes((p) => p.map((m) => m.id === meme.id ? { ...m, status: 'rejected' } : m));
                toast.addToast('Meme rejected', 'info');
            } else if (type === 'delete') {
                await axios.delete(`/admin/memes/${meme.id}`);
                setMemes((p) => p.filter((m) => m.id !== meme.id));
                toast.addToast('Meme deleted', 'success');
            }
        } catch {
            toast.addToast('Action failed', 'error');
        }
    };

    return (
        <div className="space-y-5">
            {showCreate && <CreateMemeModal onClose={() => setShowCreate(false)} onCreated={(m) => setMemes((p) => [m, ...p])} />}
            {confirmDelete && (
                <ConfirmModal
                    title="Delete meme?"
                    message={`"${confirmDelete.title}" will be permanently removed. This cannot be undone.`}
                    confirmLabel="Delete"
                    onConfirm={() => action('delete', confirmDelete)}
                    onClose={() => setConfirmDelete(null)}
                />
            )}

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
                    <input type="text" placeholder="Search memes..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition" />
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 md:flex-none md:w-36">
                        <FilterDropdown value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="w-full" />
                    </div>
                    <button onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all active:scale-[.97] flex-shrink-0">
                        <Plus size={15} /> <span className="hidden sm:inline">New Meme</span><span className="sm:hidden">New</span>
                    </button>
                </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                            <tr>
                                {['Meme', 'Author', 'Status', 'Engagement', 'Reports', 'Posted', 'Actions'].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}><td colSpan={7} className="px-4 py-3">
                                        <div className="flex items-center gap-3 animate-pulse">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800" />
                                            <div className="flex-1 space-y-2"><div className="h-3 w-1/2 rounded-full bg-gray-100 dark:bg-zinc-800" /><div className="h-2.5 w-1/3 rounded-full bg-gray-100 dark:bg-zinc-800" /></div>
                                        </div>
                                    </td></tr>
                                ))
                            ) : memes.length === 0 ? (
                                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-zinc-500">No memes found.</td></tr>
                            ) : memes.map((meme) => (
                                <tr key={meme.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {meme.post_type === 'text' ? (
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white text-xs font-bold">T</span>
                                                </div>
                                            ) : (
                                                <img src={meme.thumbnail_image_url || meme.image_url} alt={meme.title} className="w-10 h-10 rounded-lg object-cover bg-gray-100 dark:bg-zinc-800 flex-shrink-0" loading="lazy" />
                                            )}
                                            <p className="font-medium text-gray-800 dark:text-zinc-200 truncate max-w-[160px]">{meme.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm text-gray-600 dark:text-zinc-400">{meme.user?.name ?? '—'}</span>
                                            {meme.user?.is_verified && <VerifiedBadge size={12} />}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{statusBadge(meme.status)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5 text-xs text-gray-500 dark:text-zinc-400">
                                            <span className="flex items-center gap-1"><Heart size={12} className="text-red-400" />{fmt(meme.likes_count)}</span>
                                            <span className="flex items-center gap-1"><MessageCircle size={12} className="text-zinc-400" />{fmt(meme.comments_count)}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {meme.reports_count > 0 ? (
                                            <span className="flex items-center gap-1 text-xs font-semibold text-red-500">
                                                <Flag size={12} />{meme.reports_count}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-300 dark:text-zinc-700">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-500">{meme.created_at}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            {meme.status === 'pending' && (
                                                <>
                                                    <button onClick={() => action('approve', meme)} title="Approve" className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-500/10 text-orange-500 transition"><CheckCircle size={15} /></button>
                                                    <button onClick={() => action('reject', meme)} title="Reject" className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition"><X size={15} /></button>
                                                </>
                                            )}
                                            <button onClick={() => setConfirmDelete(meme)} title="Delete" className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400 transition"><Trash2 size={15} /></button>
                                        </div>
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
                            <div className="flex gap-3"><div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-zinc-800" /><div className="flex-1 space-y-2"><div className="h-3.5 w-2/3 rounded-full bg-gray-100 dark:bg-zinc-800" /><div className="h-3 w-1/3 rounded-full bg-gray-100 dark:bg-zinc-800" /></div></div>
                        </div>
                    ))
                ) : memes.map((meme) => (
                    <div key={meme.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4">
                        <div className="flex gap-3 mb-3">
                            {meme.post_type === 'text' ? (
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-lg font-bold">T</span>
                                </div>
                            ) : (
                                <img src={meme.thumbnail_image_url || meme.image_url} alt={meme.title} className="w-14 h-14 rounded-xl object-cover bg-gray-100 dark:bg-zinc-800 flex-shrink-0" loading="lazy" />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-800 dark:text-zinc-200 text-sm truncate">{meme.title}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <p className="text-xs text-gray-400 dark:text-zinc-500">{meme.user?.name ?? '—'} · {meme.created_at}</p>
                                    {meme.user?.is_verified && <VerifiedBadge size={11} />}
                                </div>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                    {statusBadge(meme.status)}
                                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500"><Heart size={11} className="text-red-400" />{fmt(meme.likes_count)}</span>
                                    <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-zinc-500"><MessageCircle size={11} className="text-zinc-400" />{fmt(meme.comments_count)}</span>
                                    {meme.reports_count > 0 && <span className="flex items-center gap-1 text-xs font-semibold text-red-500"><Flag size={11} />{meme.reports_count}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-50 dark:border-zinc-800">
                            {meme.status === 'pending' && (
                                <>
                                    <button onClick={() => action('approve', meme)} className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold transition">Approve</button>
                                    <button onClick={() => action('reject', meme)} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition">Reject</button>
                                </>
                            )}
                            <button onClick={() => setConfirmDelete(meme)} className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 transition"><Trash2 size={15} /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
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
