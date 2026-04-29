import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    Bookmark, ChevronRight, Copy, Eye,
    EyeOff, Flag, MessageCircle,
    MoreHorizontal, Share2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import ReportModal from '@/src/user/components/meme/ReportModal';
import CommentItem, { Avatar, CommentInput } from '@/components/comment-item';
import VerifiedBadge from '@/components/VerifiedBadge';
import AuthPromptModal from '@/components/auth-prompt-modal';
import ReactionPicker, { ReactionButton, ReactionsSummary } from '@/components/reaction-picker';
import TextPostCanvas from '@/components/text-post-canvas';

const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n ?? 0);

export default function MemeDetail() {
    const { meme: serverMeme, comments: serverComments, isFollowing: serverFollowing, auth } = usePage().props;
    const user = auth?.user;

    // Full reaction state — identical to MemeCard
    const [reactionType, setReactionType]           = useState(serverMeme?.reaction_type ?? null);
    const [reactionsSummary, setReactionsSummary]   = useState(serverMeme?.reactions_summary ?? {});
    const [showReactionPicker, setShowReactionPicker] = useState(false);
    const [likesCount, setLikesCount]               = useState(serverMeme?.likes_count ?? 0);
    const [saved, setSaved]                         = useState(serverMeme?.is_saved ?? false);
    const [following, setFollowing]                 = useState(serverFollowing ?? false);
    const [menuOpen, setMenuOpen]                   = useState(false);
    const [reportOpen, setReportOpen]               = useState(false);
    const [comments, setComments]                   = useState(serverComments ?? []);
    const [replyingTo, setReplyingTo]               = useState(null);
    const [shareToast, setShareToast]               = useState(false);
    const [rateLimitError, setRateLimitError]       = useState(false);
    const menuRef         = useRef(null);
    const commentInputRef = useRef(null);
    const [authPromptOpen, setAuthPromptOpen]       = useState(false);
    const [authPromptAction, setAuthPromptAction]   = useState('general');

    useEffect(() => {
        const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') { setMenuOpen(false); setShowReactionPicker(false); } };
        document.addEventListener('keydown', h);
        return () => document.removeEventListener('keydown', h);
    }, []);

    if (!serverMeme) return (
        <AppLayout>
            <Head title="Meme not found" />
            <div className="max-w-2xl mx-auto text-center py-20">
                <p className="text-gray-500 dark:text-zinc-400 text-sm mb-4">Post not found.</p>
                <Link href="/" className="text-orange-500 text-sm font-semibold hover:underline">← Back to feed</Link>
            </div>
        </AppLayout>
    );

    // Full reaction handler — same logic as MemeCard
    const handleReaction = async (type) => {
        if (!user) { setAuthPromptAction('like'); setAuthPromptOpen(true); return; }

        const prevType    = reactionType;
        const prevCount   = likesCount;
        const prevSummary = reactionsSummary;

        if (prevType === type) {
            setReactionType(null);
            setLikesCount(p => p - 1);
        } else if (prevType) {
            setReactionType(type);
        } else {
            setReactionType(type);
            setLikesCount(p => p + 1);
        }
        setShowReactionPicker(false);

        try {
            const res = await axios.post(`/p/${serverMeme.slug}/like`, { type });
            setReactionType(res.data.reaction_type);
            setLikesCount(res.data.likes_count);
            setReactionsSummary(res.data.reactions_summary);
        } catch (error) {
            setReactionType(prevType);
            setLikesCount(prevCount);
            setReactionsSummary(prevSummary);
            if (error.response?.status === 429) {
                setRateLimitError(true);
                setTimeout(() => setRateLimitError(false), 3000);
            }
        }
    };

    const handleSave = async () => {
        if (!user) { setAuthPromptAction('save'); setAuthPromptOpen(true); setMenuOpen(false); return; }
        const next = !saved;
        setSaved(next);
        try { await axios.post(`/p/${serverMeme.slug}/save`); }
        catch { setSaved(!next); }
        setMenuOpen(false);
    };

    const handleFollow = async () => {
        if (!user) { setAuthPromptAction('follow'); setAuthPromptOpen(true); return; }
        const next = !following;
        setFollowing(next);
        try { await axios.post(`/u/${serverMeme.user?.id}/follow`); }
        catch { setFollowing(!next); }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) { try { await navigator.share({ title: serverMeme.title, url }); return; } catch {} }
        navigator.clipboard?.writeText(url);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2500);
        setMenuOpen(false);
    };

    const isOwn = user?.id === serverMeme.user?.id;
    const authorUsername = (serverMeme.user?.username ?? '').replace('@', '');

    return (
        <AppLayout>
            <Head title={serverMeme.title}>
                <meta name="description" content={`${serverMeme.title} — shared by @${serverMeme.user?.username ?? serverMeme.user?.name} on Chortle.`} />
                <meta property="og:title" content={`${serverMeme.title} — Chortle`} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={serverMeme.image_url} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:image" content={serverMeme.image_url} />
            </Head>
            <div className="max-w-5xl mx-auto">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-zinc-500 mb-5"
                    style={{ animation: 'fadeUp .3s ease both' }}>
                    <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
                    <ChevronRight size={12} />
                    <Link href="/trending" className="hover:text-orange-500 transition-colors">Memes</Link>
                    <ChevronRight size={12} />
                    <span className="text-gray-600 dark:text-zinc-400 truncate max-w-[200px] md:max-w-xs lg:max-w-md">{serverMeme.title}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">

                    {/* Image / Text post */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden"
                        style={{ animation: 'fadeUp .35s ease both' }}>
                        {serverMeme.post_type === 'text' ? (
                            <TextPostCanvas
                                textContent={serverMeme.text_content}
                                textStyle={serverMeme.text_style}
                            />
                        ) : (
                            <img src={serverMeme.image_url} alt={serverMeme.title}
                                className="w-full object-cover" loading="lazy" />
                        )}
                    </div>

                    {/* Right column */}
                    <div className="flex flex-col gap-4" style={{ animation: 'fadeUp .35s .05s ease both' }}>

                        {/* Post card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">

                            {/* Author row */}
                            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <Link href={`/u/${authorUsername}`}>
                                        <Avatar user={serverMeme.user} size="w-10 h-10"
                                            className="hover:ring-2 hover:ring-orange-300 transition-all" />
                                    </Link>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <Link href={`/u/${authorUsername}`}
                                                className="text-sm font-semibold text-gray-900 dark:text-white hover:text-orange-500 transition-colors">
                                                {serverMeme.user?.name}
                                            </Link>
                                            {serverMeme.user?.is_verified && <VerifiedBadge size={13} />}
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-zinc-500">{serverMeme.created_at}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {!isOwn && (
                                        <button onClick={handleFollow}
                                            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                                                following
                                                    ? 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-600'
                                                    : 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm'
                                            }`}>
                                            {following ? 'Following' : 'Follow'}
                                        </button>
                                    )}

                                    <div className="relative" ref={menuRef}>
                                        <button onClick={() => setMenuOpen(!menuOpen)}
                                            className="p-2 rounded-full text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition">
                                            <MoreHorizontal size={17} />
                                        </button>
                                        {menuOpen && (
                                            <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl py-1.5 z-20"
                                                style={{ animation: 'menuIn .15s ease' }}>
                                                {[
                                                    { icon: Bookmark, label: saved ? 'Saved ✓' : 'Save', action: handleSave },
                                                    { icon: Copy,     label: 'Copy link',                 action: handleShare },
                                                    { icon: EyeOff,   label: 'Hide post',                 action: () => setMenuOpen(false) },
                                                    { icon: Flag,     label: 'Report',                    action: () => { if (!user) { setMenuOpen(false); setAuthPromptAction('general'); setAuthPromptOpen(true); return; } setMenuOpen(false); setReportOpen(true); }, danger: true },
                                                ].map(({ icon: Icon, label, action, danger }) => (
                                                    <button key={label} onClick={action}
                                                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                                                            danger
                                                                ? 'text-gray-700 dark:text-zinc-200 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600'
                                                                : 'text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700'
                                                        }`}>
                                                        <Icon size={14} className="text-gray-400 dark:text-zinc-500" />{label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Title + description + tags */}
                            <div className="px-4 py-4">
                                <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">{serverMeme.title}</h1>
                                {serverMeme.description && (
                                    <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2 leading-relaxed">{serverMeme.description}</p>
                                )}
                                {serverMeme.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {serverMeme.tags.map((tag) => (
                                            <span key={tag.id ?? tag.name}
                                                className="text-xs px-2.5 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 rounded-full font-medium">
                                                #{tag.name ?? tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Reactions summary + stats */}
                            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-gray-100 dark:border-zinc-800 text-xs text-gray-400 dark:text-zinc-500">
                                <ReactionsSummary reactions={reactionsSummary} onClick={() => {}} />
                                {likesCount > 0 && <span>{fmt(likesCount)} reactions</span>}
                                <span className="flex items-center gap-1"><MessageCircle size={13} />{fmt(comments.length)} comments</span>
                                <span className="flex items-center gap-1"><Eye size={13} />{fmt(serverMeme.views_count ?? 0)} views</span>
                            </div>

                            {/* Action buttons — full reaction picker like home feed */}
                            <div className="flex items-center border-t border-gray-100 dark:border-zinc-800">
                                <div className="flex-1 relative">
                                    <ReactionPicker
                                        show={showReactionPicker}
                                        currentReaction={reactionType}
                                        onSelect={handleReaction}
                                        onClose={() => setShowReactionPicker(false)}
                                    />
                                    <div className="flex items-center justify-center">
                                        <ReactionButton
                                            reactionType={reactionType}
                                            count={0}
                                            onClick={() => handleReaction(reactionType || 'like')}
                                            onLongPress={() => setShowReactionPicker(true)}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        if (!user) { setAuthPromptAction('comment'); setAuthPromptOpen(true); return; }
                                        commentInputRef.current?.focus();
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-orange-500 transition-colors border-x border-gray-100 dark:border-zinc-800">
                                    <MessageCircle size={17} /> Comment
                                </button>
                                <button onClick={handleShare}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-orange-500 transition-colors">
                                    <Share2 size={17} /> Share
                                </button>
                            </div>

                            {shareToast && (
                                <div className="mx-4 mb-3 px-3 py-2 bg-gray-900 dark:bg-zinc-700 text-white text-xs rounded-lg text-center flex items-center justify-center gap-2">
                                    <Copy size={12} /> Link copied!
                                </div>
                            )}
                            {rateLimitError && (
                                <div className="mx-4 mb-3 px-3 py-2 bg-red-500 text-white text-xs rounded-lg text-center">
                                    Too many reactions. Please slow down.
                                </div>
                            )}
                        </div>

                        {/* Comments */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                            <div className="px-4 py-3.5 border-b border-gray-100 dark:border-zinc-800">
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {comments.length} Comment{comments.length !== 1 ? 's' : ''}
                                </h2>
                            </div>

                            <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800">
                                <CommentInput
                                    ref={commentInputRef}
                                    memeSlug={serverMeme.slug}
                                    user={user}
                                    replyingTo={replyingTo}
                                    onCancelReply={() => setReplyingTo(null)}
                                    onSubmit={(newC, parentId) => {
                                        if (parentId) {
                                            const updateReplies = (list) => list.map((c) => {
                                                if (c.id === parentId) return { ...c, replies: [...(c.replies || []), newC] };
                                                if (c.replies?.length) return { ...c, replies: updateReplies(c.replies) };
                                                return c;
                                            });
                                            setComments(prev => updateReplies(prev));
                                        } else {
                                            setComments(p => [newC, ...p]);
                                        }
                                        setReplyingTo(null);
                                    }}
                                />
                            </div>

                            <div className="px-4 py-3 space-y-4 max-h-[600px] overflow-y-auto">
                                {comments.length > 0 ? comments.map((c) => (
                                    <CommentItem
                                        key={c.id}
                                        comment={c}
                                        memeSlug={serverMeme.slug}
                                        onReply={(parentId, mention) => {
                                            const findComment = (list, id) => {
                                                for (const item of list) {
                                                    if (item.id === id) return item;
                                                    if (item.replies) { const f = findComment(item.replies, id); if (f) return f; }
                                                }
                                                return null;
                                            };
                                            const target = findComment(comments, parentId);
                                            setReplyingTo({ parentId, userName: target?.user?.name || 'User', mention });
                                            commentInputRef.current?.focus();
                                        }}
                                    />
                                )) : (
                                    <div className="text-center py-10">
                                        <MessageCircle size={24} className="text-gray-200 dark:text-zinc-700 mx-auto mb-2" />
                                        <p className="text-sm text-gray-400 dark:text-zinc-500">No comments yet. Start the conversation!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ReportModal
                isOpen={reportOpen}
                onClose={() => setReportOpen(false)}
                onSubmit={async ({ reason, details }) => {
                    try {
                        await axios.post(`/p/${serverMeme.slug}/report`, {
                            reason: reason.charAt(0).toUpperCase() + reason.slice(1),
                            description: details,
                        });
                    } catch {}
                }}
            />

            <AuthPromptModal
                open={authPromptOpen}
                onClose={() => setAuthPromptOpen(false)}
                action={authPromptAction}
            />

            <style>{`
                @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
                @keyframes menuIn { from{opacity:0;transform:scale(.95) translateY(-4px)} to{opacity:1;transform:scale(1) translateY(0)} }
            `}</style>
        </AppLayout>
    );
}
