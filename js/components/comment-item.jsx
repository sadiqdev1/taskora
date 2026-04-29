import axios from 'axios';
import { ChevronDown, ChevronRight, Heart, Loader2, Send } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import VerifiedBadge from './VerifiedBadge';
import AuthPromptModal from './auth-prompt-modal';

const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n ?? 0);

// ── Avatar ────────────────────────────────────────────────────────────────────
export function Avatar({ user, size = 'w-8 h-8', className = '' }) {
    const src = user?.avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name ?? 'U')}&background=f97316&color=fff&size=40`;
    return (
        <img src={src} alt={user?.name ?? 'User'}
            className={`${size} rounded-full object-cover flex-shrink-0 ${className}`} />
    );
}

// ── Parse @mentions and render as links ───────────────────────────────────────
function CommentBody({ text }) {
    if (!text) return null;
    // Split on @word boundaries
    const parts = text.split(/(@\w+)/g);
    return (
        <p className="text-sm text-gray-700 dark:text-zinc-300 mt-0.5 leading-relaxed break-words">
            {parts.map((part, i) => {
                if (/^@\w+$/.test(part)) {
                    const username = part.slice(1);
                    return (
                        <Link key={i} href={`/u/${username}`}
                            className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                            {part}
                        </Link>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </p>
    );
}

// ── @mention autocomplete input ───────────────────────────────────────────────
function MentionInput({ value, onChange, onSubmit, placeholder, submitting, autoFocus = false }) {
    const [suggestions, setSuggestions] = useState([]);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionStart, setMentionStart] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const suggestTimer = useRef(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) inputRef.current.focus();
    }, [autoFocus]);

    const handleChange = (e) => {
        const val = e.target.value;
        onChange(val);
        // Detect @mention trigger
        const cursor = e.target.selectionStart;
        const textBefore = val.slice(0, cursor);
        const match = textBefore.match(/@(\w*)$/);
        if (match) {
            setMentionStart(cursor - match[0].length);
            const query = match[1];
            setMentionQuery(query);
            clearTimeout(suggestTimer.current);
            // Only search if there's at least 1 character after @
            if (query.length >= 1) {
                suggestTimer.current = setTimeout(async () => {
                    try {
                        // Use regular axios GET without Inertia headers to avoid 409 conflict
                        const res = await axios.get('/api/search-users', {
                            params: { q: query }
                        });
                        const users = res.data?.users ?? [];
                        setSuggestions(users.slice(0, 5));
                        setShowSuggestions(users.length > 0);
                    } catch {
                        setSuggestions([]);
                        setShowSuggestions(false);
                    }
                }, 150); // Faster response - 150ms
            } else {
                // Just typed @, don't show anything yet
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    const insertMention = (username) => {
        const before = value.slice(0, mentionStart);
        const after  = value.slice(inputRef.current?.selectionStart ?? value.length);
        const newVal = `${before}@${username} ${after}`;
        onChange(newVal);
        setShowSuggestions(false);
        setSuggestions([]);
        setTimeout(() => {
            if (inputRef.current) {
                const pos = before.length + username.length + 2;
                inputRef.current.setSelectionRange(pos, pos);
                inputRef.current.focus();
            }
        }, 0);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !showSuggestions) {
            e.preventDefault();
            onSubmit();
        }
        if (e.key === 'Escape') setShowSuggestions(false);
    };

    return (
        <div className="relative flex-1">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:bg-white dark:focus:bg-zinc-700 transition"
            />
            {/* Mention suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute bottom-full mb-1.5 left-0 w-56 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl py-1.5 z-50"
                    style={{ animation: 'menuIn .15s ease' }}>
                    {suggestions.map((u) => (
                        <button key={u.id} type="button"
                            onMouseDown={(e) => { e.preventDefault(); insertMention(u.username?.replace('@', '') ?? u.name.toLowerCase().replace(/\s+/g, '')); }}
                            className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors text-left">
                            <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=f97316&color=fff&size=32`}
                                alt={u.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{u.name}</p>
                                <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">{u.username}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Main CommentItem ──────────────────────────────────────────────────────────
export default function CommentItem({ comment, memeSlug, depth = 0, onReply }) {
    const { auth } = usePage().props;
    const [liked, setLiked]           = useState(comment.is_liked ?? false);
    const [likesCount, setLikesCount] = useState(comment.likes_count ?? 0);
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies]       = useState(comment.replies ?? []);
    const [authPromptOpen, setAuthPromptOpen] = useState(false);

    useEffect(() => {
        setReplies(comment.replies ?? []);
    }, [comment.replies]);

    const handleLike = async () => {
        if (!auth?.user) { setAuthPromptOpen(true); return; }
        const next = !liked;
        setLiked(next);
        setLikesCount((p) => next ? p + 1 : p - 1);
        try { await axios.post(`/comments/${comment.id}/like`); }
        catch { setLiked(!next); setLikesCount((p) => next ? p - 1 : p + 1); }
    };

    const handleReplyClick = () => {
        const username = comment.user?.username?.replace('@', '') ??
            comment.user?.name?.toLowerCase().replace(/\s+/g, '');
        onReply?.(comment.id, `@${username} `);
    };

    const isOwn = auth?.user?.id === comment.user?.id;

    return (
        <div className={depth > 0 ? 'ml-9 mt-2 border-l-2 border-gray-100 dark:border-zinc-800 pl-3' : ''}>
            <div className="flex gap-2.5">
                <Link href={`/u/${(comment.user?.username ?? '').replace('@', '') || comment.user?.id}`}>
                    <Avatar user={comment.user} size="w-8 h-8"
                        className="hover:ring-2 hover:ring-orange-300 transition-all" />
                </Link>
                <div className="flex-1 min-w-0">
                    {/* Bubble */}
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-2xl px-3.5 py-2.5 inline-block max-w-full">
                        <div className="flex items-center gap-1.5">
                            <Link href={`/u/${(comment.user?.username ?? '').replace('@', '') || comment.user?.id}`}
                                className="text-xs font-bold text-gray-900 dark:text-white hover:text-orange-500 transition-colors">
                                {comment.user?.name}
                            </Link>
                            {comment.user?.is_verified && <VerifiedBadge size={12} />}
                        </div>
                        <CommentBody text={comment.body} />
                    </div>

                    {/* Action row */}
                    <div className="flex items-center gap-3 mt-1 px-1">
                        <span className="text-[11px] text-gray-400 dark:text-zinc-500">
                            {comment.created_at}
                        </span>
                        <button onClick={handleLike} type="button"
                            className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${liked ? 'text-red-500' : 'text-gray-400 dark:text-zinc-500 hover:text-red-400'}`}>
                            <Heart size={11} className={liked ? 'fill-red-500' : ''} />
                            {likesCount > 0 ? fmt(likesCount) : 'Like'}
                        </button>
                        <button onClick={handleReplyClick} type="button"
                            className="text-[11px] font-semibold text-gray-400 dark:text-zinc-500 hover:text-orange-500 transition-colors">
                            Reply
                        </button>
                        {replies.length > 0 && (
                            <button onClick={() => setShowReplies((p) => !p)} type="button"
                                className="flex items-center gap-0.5 text-[11px] font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                                {showReplies ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                                {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Nested replies */}
            {showReplies && replies.length > 0 && (
                <div className="mt-2 space-y-2">
                    {replies.map((r) => (
                        <CommentItem 
                            key={r.id} 
                            comment={r} 
                            memeSlug={memeSlug} 
                            depth={depth + 1} 
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}

            <style>{`@keyframes menuIn{from{opacity:0;transform:scale(.95) translateY(-4px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
            <AuthPromptModal open={authPromptOpen} onClose={() => setAuthPromptOpen(false)} action="like" />
        </div>
    );
}

// ── Comment input (top-level) ─────────────────────────────────────────────────
export const CommentInput = React.forwardRef(function CommentInput({ memeSlug, onSubmit, user, replyingTo, onCancelReply }, forwardedRef) {
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionStart, setMentionStart] = useState(-1);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const suggestTimer = useRef(null);

    // Merge forwarded ref with internal ref
    const setRef = (el) => {
        inputRef.current = el;
        if (typeof forwardedRef === 'function') forwardedRef(el);
        else if (forwardedRef) forwardedRef.current = el;
    };

    // Auto-fill @mention when replying
    useEffect(() => {
        if (replyingTo) {
            setText(replyingTo.mention);
            // Focus input after a short delay
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [replyingTo]);

    const handleChange = (e) => {
        const val = e.target.value;
        setText(val);
        // Detect @mention trigger
        const cursor = e.target.selectionStart;
        const textBefore = val.slice(0, cursor);
        const match = textBefore.match(/@(\w*)$/);
        if (match) {
            setMentionStart(cursor - match[0].length);
            const query = match[1];
            setMentionQuery(query);
            clearTimeout(suggestTimer.current);
            // Only search if there's at least 1 character after @
            if (query.length >= 1) {
                suggestTimer.current = setTimeout(async () => {
                    try {
                        // Use regular axios GET without Inertia headers to avoid 409 conflict
                        const res = await axios.get('/api/search-users', {
                            params: { q: query }
                        });
                        const users = res.data?.users ?? [];
                        setSuggestions(users.slice(0, 5));
                        setShowSuggestions(users.length > 0);
                    } catch (error) {
                        console.error('Search error:', error);
                        setSuggestions([]);
                        setShowSuggestions(false);
                    }
                }, 150);
            } else {
                // Just typed @, don't show anything yet
                setSuggestions([]);
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
            setSuggestions([]);
        }
    };

    const insertMention = (username) => {
        const before = text.slice(0, mentionStart);
        const after  = text.slice(inputRef.current?.selectionStart ?? text.length);
        const newVal = `${before}@${username} ${after}`;
        setText(newVal);
        setShowSuggestions(false);
        setSuggestions([]);
        setTimeout(() => {
            if (inputRef.current) {
                const pos = before.length + username.length + 2;
                inputRef.current.setSelectionRange(pos, pos);
                inputRef.current.focus();
            }
        }, 0);
    };

    const submit = async () => {
        if (!text.trim() || submitting) return;
        setSubmitting(true);
        try {
            const payload = { body: text };
            if (replyingTo?.parentId) {
                payload.parent_id = replyingTo.parentId;
            }
            const res = await axios.post(`/p/${memeSlug}/comments`, payload);
            onSubmit?.(res.data, replyingTo?.parentId);
            setText('');
            onCancelReply?.();
        } catch {}
        setSubmitting(false);
    };

    return (
        <div className="space-y-2">
            {replyingTo && (
                <div className="flex items-center justify-between px-1">
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                        Replying to <span className="font-semibold text-orange-500">{replyingTo.userName}</span>
                    </p>
                    <button onClick={onCancelReply} type="button"
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors">
                        Cancel
                    </button>
                </div>
            )}
            <div className="flex gap-2.5 items-center">
                {user && <Avatar user={user} size="w-8 h-8" />}
                <div className="flex-1 relative">
                    <input
                        ref={setRef}
                        type="text"
                        value={text}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && !showSuggestions) {
                                e.preventDefault();
                                submit();
                            }
                            if (e.key === 'Escape') {
                                setShowSuggestions(false);
                                onCancelReply?.();
                            }
                        }}
                        placeholder={replyingTo ? `Reply to ${replyingTo.userName}...` : "Write a comment..."}
                        className="w-full px-4 py-2.5 pr-12 bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-full text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:bg-white dark:focus:bg-zinc-700 transition"
                    />
                    {/* Mention suggestions dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute bottom-full mb-1.5 left-0 w-56 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl py-1.5 z-[9999]"
                            style={{ animation: 'menuIn .15s ease' }}>
                            {suggestions.map((u) => (
                                <button key={u.id} type="button"
                                    onMouseDown={(e) => { e.preventDefault(); insertMention(u.username?.replace('@', '') ?? u.name.toLowerCase().replace(/\s+/g, '')); }}
                                    className="flex items-center gap-2.5 w-full px-3 py-2 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors text-left">
                                    <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=f97316&color=fff&size=32`}
                                        alt={u.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{u.name}</p>
                                        <p className="text-xs text-gray-400 dark:text-zinc-500 truncate">{u.username}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={submit} disabled={!text.trim() || submitting} type="button"
                    className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full font-medium text-sm transition-all hover:shadow-lg hover:shadow-orange-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0">
                    {submitting ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            <span className="hidden sm:inline">Sending...</span>
                        </>
                    ) : (
                        <>
                            <Send size={16} />
                            <span className="hidden sm:inline">Send</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
});
