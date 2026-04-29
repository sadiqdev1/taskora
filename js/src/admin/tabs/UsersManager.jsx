import axios from 'axios';
import { AlertTriangle, Ban, Check, ChevronDown, ChevronLeft, ChevronRight, Loader2, Plus, Search, Trash2, UserCheck, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '../Contexts/ToastContexts';

const roleOptions   = ['All', 'Admin', 'Moderator', 'User'];
const statusOptions = ['All', 'Active', 'Suspended'];

function VerifiedBadge({ size = 14 }) {
    return <i className="ri-verified-badge-fill text-blue-500" style={{ fontSize: size, lineHeight: 1 }} title="Verified" />;
}

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
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition">Cancel</button>
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

function CreateUserModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const toast = useToast();
    const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!form.name.trim())        errs.name     = 'Name is required';
        if (!form.email.trim())       errs.email    = 'Email is required';
        if (form.password.length < 8) errs.password = 'Min. 8 characters';
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setSubmitting(true);
        try {
            const res = await axios.post('/admin/users', form);
            toast.addToast('User created', 'success');
            onCreated(res.data); onClose();
        } catch (err) {
            toast.addToast(err.response?.data?.message || 'Failed', 'error');
            if (err.response?.data?.errors) setErrors(err.response.data.errors);
        }
        setSubmitting(false);
    };

    const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-2xl"
                style={{ animation: 'modalIn .25s cubic-bezier(.16,1,.3,1)' }}
                onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">Create User</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-gray-400 dark:text-zinc-500"><X size={16} /></button>
                </div>
                <form onSubmit={submit} className="px-6 py-5 space-y-4" autoComplete="off">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide">Full Name</label>
                        <input type="text" value={form.name} onChange={set('name')} placeholder="Full name" autoComplete="off" className={inputCls} />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide">Email</label>
                        <input type="email" value={form.email} onChange={set('email')} placeholder="user@example.com" autoComplete="off" className={inputCls} />
                        {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide">Password</label>
                        <input type="password" value={form.password} onChange={set('password')} placeholder="Min. 8 characters" autoComplete="new-password" className={inputCls} />
                        {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide">Role</label>
                        <FilterDropdown value={form.role.charAt(0).toUpperCase() + form.role.slice(1)} options={['User', 'Moderator', 'Admin']} onChange={(v) => setForm((p) => ({ ...p, role: v.toLowerCase() }))} className="w-full" />
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                        <button type="submit" disabled={submitting}
                            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-full transition-all disabled:opacity-50 active:scale-[.97]">
                            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                            {submitting ? 'Creating...' : 'Create User'}
                        </button>
                        <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition">Cancel</button>
                    </div>
                </form>
                <style>{`@keyframes modalIn{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
            </div>
        </div>
    );
}

const roleBadge = (r) => {
    const m = { admin: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400', moderator: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300', user: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400' };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${m[r] || 'bg-zinc-100 text-zinc-500'}`}>{r}</span>;
};

const statusBadge = (s) => {
    const m = { active: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400', suspended: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' };
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${m[s] || 'bg-zinc-100 text-zinc-500'}`}>{s}</span>;
};

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
                <div className="absolute z-[200] mt-1.5 w-full bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl py-1.5">
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

export default function UsersManager({ searchQuery = '' }) {
    const [users, setUsers]           = useState([]);
    const [meta, setMeta]             = useState(null);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage]             = useState(1);
    const [showCreate, setShowCreate] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
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
            const res = await axios.get('/admin/users', { params: { search, role: roleFilter, status: statusFilter, page: pg } });
            setUsers(res.data.data);
            setMeta({ total: res.data.total, last_page: res.data.last_page });
            setPage(pg);
        } catch {}
        setLoading(false);
    }, [search, roleFilter, statusFilter]);

    useEffect(() => {
        clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => load(1), 300);
        return () => clearTimeout(searchTimer.current);
    }, [search, roleFilter, statusFilter, load]);

    const updateUser = async (userId, data) => {
        // Set updating flag
        setUsers((p) => p.map((u) => u.id === userId ? { ...u, updating: true } : u));
        
        try {
            const res = await axios.patch(`/admin/users/${userId}`, data);
            setUsers((p) => p.map((u) => u.id === userId ? { ...u, role: res.data.role, status: res.data.status, is_verified: res.data.is_verified, updating: false } : u));
            return true;
        } catch (e) {
            // Remove updating flag on error
            setUsers((p) => p.map((u) => u.id === userId ? { ...u, updating: false } : u));
            toast.addToast(e.response?.data?.message || 'Action failed', 'error');
            return false;
        }
    };

    const action = async (type, user) => {
        if (type === 'suspend') {
            const newStatus = user.status === 'active' ? 'suspended' : 'active';
            const ok = await updateUser(user.id, { status: newStatus });
            if (ok) toast.addToast(`User ${newStatus === 'suspended' ? 'suspended' : 'reactivated'}`, 'success');
        } else if (type === 'role') {
            const roles = ['user', 'moderator', 'admin'];
            const next = roles[(roles.indexOf(user.role) + 1) % roles.length];
            const ok = await updateUser(user.id, { role: next });
            if (ok) toast.addToast(`Role changed to ${next}`, 'success');
        } else if (type === 'verify') {
            const ok = await updateUser(user.id, { is_verified: !user.is_verified });
            if (ok) toast.addToast(user.is_verified ? 'Verification removed' : 'User verified', 'success');
        } else if (type === 'delete') {
            try {
                await axios.delete(`/admin/users/${user.id}`);
                setUsers((p) => p.filter((u) => u.id !== user.id));
                toast.addToast('User deleted', 'success');
            } catch (e) {
                toast.addToast(e.response?.data?.message || 'Delete failed', 'error');
            }
        }
    };

    return (
        <div className="space-y-5">
            {showCreate && <CreateUserModal onClose={() => setShowCreate(false)} onCreated={(u) => setUsers((p) => [u, ...p])} />}
            {confirmDelete && (
                <ConfirmModal
                    title="Delete user?"
                    message={`"${confirmDelete.name}" and all their data will be permanently removed. This cannot be undone.`}
                    confirmLabel="Delete"
                    onConfirm={() => action('delete', confirmDelete)}
                    onClose={() => setConfirmDelete(null)}
                />
            )}

            <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-500" />
                    <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 transition" />
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 md:flex-none md:w-36">
                        <FilterDropdown value={roleFilter} options={roleOptions} onChange={setRoleFilter} className="w-full" />
                    </div>
                    <div className="flex-1 md:flex-none md:w-36">
                        <FilterDropdown value={statusFilter} options={statusOptions} onChange={setStatusFilter} className="w-full" />
                    </div>
                    <button onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all active:scale-[.97] flex-shrink-0">
                        <Plus size={15} /> <span className="hidden sm:inline">New User</span><span className="sm:hidden">New</span>
                    </button>
                </div>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-zinc-800">
                            <tr>
                                {['User', 'Role', 'Status', 'Memes', 'Joined', 'Actions'].map((h) => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}><td colSpan={6} className="px-4 py-3">
                                        <div className="flex items-center gap-3 animate-pulse">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800" />
                                            <div className="flex-1 space-y-2"><div className="h-3 w-1/3 rounded-full bg-gray-100 dark:bg-zinc-800" /><div className="h-2.5 w-1/4 rounded-full bg-gray-100 dark:bg-zinc-800" /></div>
                                        </div>
                                    </td></tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400 dark:text-zinc-500">No users found.</td></tr>
                            ) : users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <p className="font-medium text-gray-800 dark:text-zinc-200">{user.name}</p>
                                                    {user.is_verified && <VerifiedBadge />}
                                                </div>
                                                <p className="text-xs text-gray-400 dark:text-zinc-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button 
                                            onClick={() => action('role', user)} 
                                            title="Click to cycle role" 
                                            disabled={user.updating}
                                            className="hover:opacity-70 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {user.updating ? (
                                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center gap-1">
                                                    <Loader2 size={10} className="animate-spin" /> Updating...
                                                </span>
                                            ) : (
                                                roleBadge(user.role)
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">{statusBadge(user.status)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-zinc-400">{user.memes_count}</td>
                                    <td className="px-4 py-3 text-xs text-gray-400 dark:text-zinc-500">{user.created_at}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => action('verify', user)} title={user.is_verified ? 'Remove verification' : 'Verify user'}
                                                className={`p-1.5 rounded-lg transition text-sm ${user.is_verified ? 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10' : 'text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                                                <i className={user.is_verified ? 'ri-checkbox-circle-fill' : 'ri-checkbox-circle-line'} style={{ fontSize: 15 }} />
                                            </button>
                                            <button onClick={() => action('suspend', user)} title={user.status === 'active' ? 'Suspend' : 'Reactivate'}
                                                className={`p-1.5 rounded-lg transition ${user.status === 'active' ? 'hover:bg-orange-50 dark:hover:bg-orange-500/10 text-orange-400' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400'}`}>
                                                {user.status === 'active' ? <Ban size={15} /> : <UserCheck size={15} />}
                                            </button>
                                            <button onClick={() => setConfirmDelete(user)} title="Delete"
                                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-400 transition">
                                                <Trash2 size={15} />
                                            </button>
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
                            <div className="flex gap-3"><div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800" /><div className="flex-1 space-y-2"><div className="h-3.5 w-1/2 rounded-full bg-gray-100 dark:bg-zinc-800" /><div className="h-3 w-1/3 rounded-full bg-gray-100 dark:bg-zinc-800" /></div></div>
                        </div>
                    ))
                ) : users.map((user) => (
                    <div key={user.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="font-semibold text-gray-800 dark:text-zinc-200 text-sm">{user.name}</p>
                                    {user.is_verified && <VerifiedBadge size={13} />}
                                </div>
                                <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">{user.email}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                {roleBadge(user.role)}
                                {statusBadge(user.status)}
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-zinc-800 text-xs text-gray-400 dark:text-zinc-500">
                            <span>{user.memes_count} memes · {user.created_at}</span>
                            <div className="flex items-center gap-1">
                                <button onClick={() => action('verify', user)} title={user.is_verified ? 'Remove verification' : 'Verify'}
                                    className={`p-1.5 rounded-lg transition ${user.is_verified ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'text-zinc-400 dark:text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}>
                                    <i className={user.is_verified ? 'ri-checkbox-circle-fill' : 'ri-checkbox-circle-line'} style={{ fontSize: 14 }} />
                                </button>
                                <button onClick={() => action('role', user)}
                                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 transition capitalize">
                                    {user.role}
                                </button>
                                <button onClick={() => action('suspend', user)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${user.status === 'active' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'}`}>
                                    {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                                </button>
                                <button onClick={() => setConfirmDelete(user)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 transition"><Trash2 size={14} /></button>
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
