import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bookmark, Calendar, Camera, Heart, Image, Link as LinkIcon, Loader2, MapPin } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import VerifiedBadge from '@/components/VerifiedBadge';
import MemeCard from '@/components/meme-card';
import OwnMemeCard from '@/components/own-meme-card';
import AuthPromptModal from '@/components/auth-prompt-modal';
import TextPostCanvas from '@/components/text-post-canvas';

const fmt = (n) =>
    n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n);

const makeMemes = (startId, count) =>
    Array.from({ length: count }, (_, i) => ({
        id: startId + i,
        title: ['My first meme', 'Dev life', 'When the code works', 'CSS in production', 'Another funny one'][
            Math.floor(Math.random() * 5)
        ],
        imageUrl: `https://picsum.photos/600/600?random=${startId + i}`,
        likes: Math.floor(Math.random() * 20000) + 1000,
    }));

const inputCls =
    'w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm ' +
    'text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 ' +
    'focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-300 ' +
    'bg-gray-100 dark:bg-zinc-800 focus:bg-gray-50 dark:focus:bg-zinc-700 transition';

const TABS = [
    { id: 'memes', label: 'Memes', icon: Image },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'liked', label: 'Liked', icon: Heart },
];

// ── Skeleton for full meme cards ─────────────────────────────────────────────
function Skeleton() {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 animate-pulse">
            <div className="flex items-center gap-3 px-4 py-4">
                <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-zinc-800" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 rounded-full bg-gray-100 dark:bg-zinc-800" />
                    <div className="h-2.5 w-16 rounded-full bg-gray-100 dark:bg-zinc-800" />
                </div>
            </div>
            <div className="aspect-[4/3] bg-gray-100 dark:bg-zinc-800" />
            <div className="space-y-2 px-4 py-4">
                <div className="h-3 w-3/4 rounded-full bg-gray-100 dark:bg-zinc-800" />
                <div className="h-2.5 w-1/2 rounded-full bg-gray-100 dark:bg-zinc-800" />
            </div>
        </div>
    );
}

// ── Skeleton for grid ─────────────────────────────────────────────────────────
function GridSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-100 dark:bg-zinc-800" />
            <div className="p-3 space-y-2">
                <div className="h-3 w-3/4 rounded-full bg-gray-100 dark:bg-zinc-800" />
                <div className="h-2.5 w-1/2 rounded-full bg-gray-100 dark:bg-zinc-800" />
            </div>
        </div>
    );
}

// ── Mini meme card ────────────────────────────────────────────────────────────
function MiniCard({ item }) {
    return (
        <Link href={`/p/${item.slug}`} className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer">
            <div className="aspect-square bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                <img
                    src={item.thumbnail_image_url ?? item.image_url ?? item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    loading="lazy"
                />
            </div>
            <div className="p-3">
                <p className="text-xs font-medium text-gray-800 dark:text-zinc-200 truncate">{item.title}</p>
                <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-0.5">❤️ {fmt(item.likes_count ?? item.likes ?? 0)}</p>
            </div>
        </Link>
    );
}

// ── Follow button (other users only) ─────────────────────────────────────────
function FollowButton({ userId, initialFollowing }) {
    const { auth } = usePage().props;
    const [following, setFollowing] = useState(initialFollowing);
    const [busy, setBusy] = useState(false);
    const [authPromptOpen, setAuthPromptOpen] = useState(false);

    const toggle = async () => {
        if (!auth?.user) { setAuthPromptOpen(true); return; }
        setBusy(true);
        try {
            await import('axios').then(m => m.default.post(`/u/${userId}/follow`));
            setFollowing((p) => !p);
        } catch (error) {
            console.error('Follow toggle failed:', error);
        }
        setBusy(false);
    };

    return (
        <>
            <button
                onClick={toggle}
                disabled={busy}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all disabled:opacity-60 ${
                    following
                        ? 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-600'
                        : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm'
                }`}
            >
                {busy ? <Loader2 size={14} className="animate-spin" /> : following ? 'Following' : 'Follow'}
            </button>
            <AuthPromptModal open={authPromptOpen} onClose={() => setAuthPromptOpen(false)} action="follow" />
        </>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Profile() {
    const { auth, profileUser, flash, memes: serverMemes, saved: serverSaved, liked: serverLiked } = usePage().props;
    const isOwn = auth?.user?.id === profileUser?.id;

    // form state
    const [formData, setFormData] = useState({
        name: profileUser?.name ?? '',
        bio: profileUser?.bio ?? '',
        location: profileUser?.location ?? '',
        website: profileUser?.website ?? '',
    });

    // ui state
    const [activeTab, setActiveTab] = useState('memes');
    const [tabLoading, setTabLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedToast, setSavedToast] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverUploading, setCoverUploading] = useState(false);
    const [coverPreview, setCoverPreview] = useState(null);

    // real meme data from server
    const [memes, setMemes] = useState(serverMemes?.data ?? []);
    const [memesNextUrl, setMemesNextUrl] = useState(serverMemes?.next_page_url ?? null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [savedMemes, setSavedMemes] = useState(serverSaved?.data ?? []);
    const [likedMemes, setLikedMemes] = useState(serverLiked?.data ?? []);

    const sentinelRef = useRef(null);
    const avatarInputRef = useRef(null);
    const coverInputRef = useRef(null);

    // sync form when server refreshes profileUser
    useEffect(() => {
        setFormData({
            name: profileUser?.name ?? '',
            bio: profileUser?.bio ?? '',
            location: profileUser?.location ?? '',
            website: profileUser?.website ?? '',
        });
    }, [profileUser]);

    // flash toast
    useEffect(() => {
        if (flash?.status === 'profile-updated') {
            setSavedToast(true);
            const t = setTimeout(() => setSavedToast(false), 2500);
            return () => clearTimeout(t);
        }
    }, [flash]);

    // avatar upload
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
        setAvatarUploading(true);
        const fd = new FormData();
        fd.append('avatar', file);
        router.post('/profile/avatar', fd, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setAvatarUploading(false);
                setAvatarPreview(null); // clear preview, let server URL take over
            },
            onError: (errors) => {
                setAvatarPreview(null);
                setAvatarUploading(false);
                alert(errors?.avatar || 'Avatar upload failed. Please try again.');
            },
        });
    };

    // cover upload
    const handleCoverChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCoverPreview(URL.createObjectURL(file));
        setCoverUploading(true);
        const fd = new FormData();
        fd.append('cover', file);
        router.post('/profile/cover', fd, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setCoverUploading(false);
                setCoverPreview(null); // clear preview, let server URL take over
            },
            onError: (errors) => {
                setCoverPreview(null);
                setCoverUploading(false);
                alert(errors?.cover || 'Cover upload failed. Please try again.');
            },
        });
    };

    // tab switch — fetch saved/liked on demand via Inertia partial reload
    const switchTab = (tab) => {
        if (tab === activeTab) return;
        setActiveTab(tab);

        // Fetch saved/liked data if not yet loaded
        if (tab === 'saved' && savedMemes.length === 0 && isOwn) {
            setTabLoading(true);
            router.reload({
                only: ['saved'],
                onSuccess: (page) => {
                    const data = page.props.saved?.data ?? [];
                    setSavedMemes(data);
                    setTabLoading(false);
                },
                onError: () => setTabLoading(false),
            });
            return;
        }

        if (tab === 'liked' && likedMemes.length === 0 && isOwn) {
            setTabLoading(true);
            router.reload({
                only: ['liked'],
                onSuccess: (page) => {
                    const data = page.props.liked?.data ?? [];
                    setLikedMemes(data);
                    setTabLoading(false);
                },
                onError: () => setTabLoading(false),
            });
            return;
        }
    };

    // real data per tab
    const displayed = activeTab === 'memes'
        ? memes
        : activeTab === 'saved'
            ? savedMemes
            : likedMemes;

    // infinite scroll for memes tab
    const loadMore = useCallback(async () => {
        if (loadingMore || !memesNextUrl || activeTab !== 'memes') return;
        setLoadingMore(true);
        try {
            const res = await import('axios').then(m => m.default.get(memesNextUrl, {
                headers: { 'X-Inertia': true, 'X-Inertia-Partial-Data': 'memes', 'X-Inertia-Partial-Component': 'profile' },
            }));
            const data = res.data?.props?.memes;
            if (data) {
                setMemes((p) => [...p, ...data.data]);
                setMemesNextUrl(data.next_page_url);
            }
        } catch {}
        setLoadingMore(false);
    }, [loadingMore, memesNextUrl, activeTab]);

    useEffect(() => {
        if (loadingMore || !memesNextUrl || activeTab !== 'memes' || tabLoading) return;
        const obs = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMore(); },
            { threshold: 0.1 }
        );
        if (sentinelRef.current) obs.observe(sentinelRef.current);
        return () => obs.disconnect();
    }, [loadingMore, memesNextUrl, loadMore, activeTab, tabLoading]);

    // save profile
    const handleSave = (e) => {
        e.preventDefault();
        setSaving(true);
        router.patch('/profile', formData, {
            preserveScroll: true,
            onSuccess: () => { setSaving(false); setEditOpen(false); },
            onError: () => setSaving(false),
        });
    };

    if (!profileUser) return null;

    const avatarUrl =
        avatarPreview ??
        profileUser.avatar_url ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name)}&background=f97316&color=fff&size=120`;

    return (
        <AppLayout>
            <Head title={`${profileUser.name} (@${profileUser.username}) · Chortle`}>
                <meta name="description" content={`${profileUser.name}'s meme profile on Chortle. ${profileUser.bio ?? 'Check out their memes, followers, and more.'}`} />
                <meta property="og:title" content={`${profileUser.name} on Chortle`} />
                <meta property="og:description" content={profileUser.bio ?? `Check out ${profileUser.name}'s memes on Chortle.`} />
                <meta property="og:type" content="profile" />
                {profileUser.avatar_url && <meta property="og:image" content={profileUser.avatar_url} />}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={`${profileUser.name} on Chortle`} />
            </Head>

            <div className="max-w-2xl mx-auto space-y-5">

                {/* Profile card */}
                <div
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden"
                    style={{ animation: 'fadeUp .4s ease both' }}
                >
                    {/* Cover */}
                    <div
                        className={`aspect-[3/1] relative overflow-hidden ${!coverPreview && !profileUser.cover_image ? `bg-gradient-to-r ${profileUser.cover_color ?? 'from-orange-400 to-pink-500'}` : ''}`}
                        style={
                            (coverPreview || profileUser.cover_image)
                                ? { backgroundImage: `url(${coverPreview ?? profileUser.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                : {}
                        }
                    >
                        {/* uploading overlay */}
                        {coverUploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Loader2 size={24} className="animate-spin text-white" />
                            </div>
                        )}

                        {isOwn && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => coverInputRef.current?.click()}
                                    disabled={coverUploading}
                                    title="Change cover photo"
                                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition backdrop-blur-sm disabled:opacity-50"
                                >
                                    <Camera size={14} />
                                </button>
                                <input
                                    ref={coverInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    className="hidden"
                                    onChange={handleCoverChange}
                                />
                            </>
                        )}
                    </div>

                    <div className="px-5 pb-5">
                        {/* Avatar row */}
                        <div className="flex items-end justify-between -mt-10 mb-4">
                            <div className="relative">
                                <img
                                    src={avatarUrl}
                                    alt={profileUser.name}
                                    className={`w-20 h-20 rounded-2xl border-4 border-white dark:border-zinc-900 shadow-md object-cover transition-opacity ${avatarUploading ? 'opacity-50' : ''}`}
                                    loading="lazy"
                                />
                                {avatarUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50">
                                        <Loader2 size={20} className="animate-spin text-white" />
                                    </div>
                                )}
                                {isOwn && !avatarUploading && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => avatarInputRef.current?.click()}
                                            disabled={avatarUploading}
                                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-sm hover:bg-orange-600 transition disabled:opacity-50"
                                            aria-label="Change avatar"
                                        >
                                            <Camera size={11} />
                                        </button>
                                        <input
                                            ref={avatarInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </>
                                )}
                            </div>

                            {isOwn && (
                                <button
                                    onClick={() => setEditOpen(true)}
                                    className="mb-1 px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                                >
                                    Edit profile
                                </button>
                            )}
                        </div>

                        {/* Info */}
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{profileUser.name}</h1>
                                {profileUser.is_verified && <VerifiedBadge size={18} />}
                                {!isOwn && <FollowButton userId={profileUser.id} initialFollowing={profileUser.is_following} />}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">{profileUser.username}</p>

                            {profileUser.bio && (
                                <p className="text-sm text-gray-700 dark:text-zinc-300 mt-2 leading-relaxed">{profileUser.bio}</p>
                            )}

                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                                {profileUser.location && (
                                    <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500">
                                        <MapPin size={12} />{profileUser.location}
                                    </span>
                                )}
                                {profileUser.website && (
                                    <a
                                        href={profileUser.website.startsWith('http') ? profileUser.website : `https://${profileUser.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 transition-colors"
                                    >
                                        <LinkIcon size={12} />{profileUser.website}
                                    </a>
                                )}
                                <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500">
                                    <Calendar size={12} />Joined {profileUser.joined}
                                </span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                            {[
                                { label: 'Memes',     value: profileUser.stats?.memes     ?? 0 },
                                { label: 'Followers', value: profileUser.stats?.followers ?? 0 },
                                { label: 'Following', value: profileUser.stats?.following ?? 0 },
                            ].map(({ label, value }) => (
                                <div key={label} className="text-center">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{fmt(value)}</p>
                                    <p className="text-xs text-gray-400 dark:text-zinc-500">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div
                    className="flex gap-1.5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl p-1.5 shadow-sm"
                    style={{ animation: 'fadeUp .4s .1s ease both' }}
                >
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => switchTab(id)}
                            className={`flex flex-1 items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                activeTab === id
                                    ? 'bg-orange-500 text-white shadow-sm'
                                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800'
                            }`}
                        >
                            <Icon size={15} />{label}
                        </button>
                    ))}
                </div>

                {/* Content - Full cards for all tabs */}
                <div className="space-y-5" style={{ animation: 'fadeUp .4s .2s ease both' }}>
                    {tabLoading
                        ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} />)
                        : displayed.map((item) => 
                            isOwn && activeTab === 'memes'
                                ? <OwnMemeCard key={`meme-${item.id}`} meme={item} onDelete={(id) => setMemes(prev => prev.filter(m => m.id !== id))} />
                                : <MemeCard key={`${activeTab}-${item.id}`} meme={item} />
                        )
                    }

                    {loadingMore && activeTab === 'memes' && (
                        <div className="flex justify-center py-4">
                            <Loader2 className="animate-spin text-orange-500" size={22} />
                        </div>
                    )}

                    {memesNextUrl && !loadingMore && activeTab === 'memes' && (
                        <div ref={sentinelRef} className="h-4" />
                    )}

                    {!tabLoading && displayed.length === 0 && (
                        <div className="py-16 text-center">
                            <p className="text-sm text-gray-400 dark:text-zinc-500">
                                {activeTab === 'memes' && isOwn && 'No memes yet. Start sharing!'}
                                {activeTab === 'memes' && !isOwn && 'No memes yet.'}
                                {activeTab === 'saved' && 'No saved memes yet.'}
                                {activeTab === 'liked' && 'No liked memes yet.'}
                            </p>
                            {isOwn && activeTab === 'memes' && (
                                <Link href="/upload" className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-md">
                                    Upload your first meme
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Edit modal */}
            {editOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
                    style={{ animation: 'fadeIn .2s ease' }}
                    onClick={() => setEditOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-zinc-800 my-8"
                        style={{ animation: 'modalIn .25s cubic-bezier(.16,1,.3,1)' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-zinc-800">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Edit Profile</h3>
                            <button
                                onClick={() => setEditOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 dark:text-zinc-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
                            {[
                                { label: 'Display name', key: 'name',     placeholder: 'Your name',            type: 'text' },
                                { label: 'Location',     key: 'location', placeholder: 'City, Country',        type: 'text' },
                                { label: 'Website',      key: 'website',  placeholder: 'https://yoursite.com', type: 'text' },
                            ].map(({ label, key, placeholder, type }) => (
                                <div key={key}>
                                    <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5">{label}</label>
                                    <input
                                        type={type}
                                        value={formData[key]}
                                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                        placeholder={placeholder}
                                        className={inputCls}
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5">Bio</label>
                                <textarea
                                    rows={3}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Tell people about yourself..."
                                    maxLength={300}
                                    className={`${inputCls} resize-none`}
                                />
                                <p className="text-[11px] text-gray-400 dark:text-zinc-600 mt-1 text-right">{formData.bio?.length ?? 0}/300</p>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setEditOpen(false)}
                                    className="px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-full text-sm font-medium text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-60"
                                >
                                    {saving ? <><Loader2 className="animate-spin" size={14} /> Saving...</> : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Saved toast */}
            {savedToast && (
                <div
                    className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 dark:bg-zinc-700 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 whitespace-nowrap"
                    style={{ animation: 'fadeUp .3s ease' }}
                >
                    ✓ Profile updated
                </div>
            )}

            <style>{`
                @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
                @keyframes fadeUp  { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
                @keyframes modalIn { from { opacity: 0; transform: scale(.95) translateY(10px) } to { opacity: 1; transform: scale(1) translateY(0) } }
            `}</style>
        </AppLayout>
    );
}
