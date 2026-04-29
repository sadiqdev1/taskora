import axios from 'axios';
import { Bookmark, Copy, Eye, EyeOff, Flag, Heart, Loader2, Maximize2, MessageCircle, MoreHorizontal, Share2, X } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, usePage } from '@inertiajs/react';
import CommentItem, { Avatar, CommentInput } from './comment-item';
import VerifiedBadge from './VerifiedBadge';
import ReportModal from '@/src/user/components/meme/ReportModal';
import ReactionPicker, { ReactionButton, ReactionsSummary } from './reaction-picker';
import AuthPromptModal from './auth-prompt-modal';
import TextPostCanvas from './text-post-canvas';

const fmt = (n) => n >= 1e6 ? (n/1e6).toFixed(1)+"M" : n >= 1e3 ? (n/1e3).toFixed(1)+"K" : String(n);

// ── Expandable title (like Facebook) ─────────────────────────────────────────
const TITLE_LIMIT = 120;

function TitleText({ authorName, isVerified, title, slug }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = title && title.length > TITLE_LIMIT;
  const displayed = isLong && !expanded ? title.slice(0, TITLE_LIMIT).trimEnd() : title;

  return (
    <div className="text-sm text-gray-800 dark:text-zinc-200 leading-snug">
      <span className="inline-flex items-center gap-1 mr-1">
        <Link href={`/u/${authorName.replace('@','')}`} className="font-semibold text-gray-900 dark:text-white hover:text-orange-500 transition-colors">
          {authorName}
        </Link>
        {isVerified && <VerifiedBadge size={12} />}
      </span>
      <Link href={`/p/${slug}`} className="hover:text-gray-600 dark:hover:text-zinc-400 transition-colors">
        {displayed}
      </Link>
      {isLong && !expanded && (
        <>
          {' '}
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setExpanded(true); }}
            className="text-gray-500 dark:text-zinc-400 font-semibold hover:text-gray-700 dark:hover:text-zinc-200 transition-colors"
            aria-label="Show more"
          >
            more
          </button>
        </>
      )}
    </div>
  );
}

export default function MemeCard({ meme }) {
  const { auth } = usePage().props;
  const currentUser = auth?.user;
  const isOwn = currentUser && meme.user?.id === currentUser.id;

  const [reactionType, setReactionType] = useState(meme.reaction_type);
  const [likesCount, setLikesCount] = useState(meme.likes_count ?? 0);
  const [reactionsSummary, setReactionsSummary] = useState(meme.reactions_summary || {});
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [saved, setSaved] = useState(meme.is_saved ?? false);
  const [following, setFollowing] = useState(meme.user?.is_following ?? false);
  const [followLoading, setFollowLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  // Auth prompt modal state (for guest users)
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState('general');
  const menuRef = useRef(null);
  const sheetRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (commentOpen || lightboxOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [commentOpen, lightboxOpen]);

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") { setCommentOpen(false); setLightboxOpen(false); setMenuOpen(false); setShowReactionPicker(false); } };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  // Keyboard shortcuts for reactions (1-6 keys)
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only trigger if not typing in an input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      const reactionMap = {
        '1': 'like',
        '2': 'love',
        '3': 'haha',
        '4': 'wow',
        '5': 'sad',
        '6': 'angry',
        'l': 'like', // L for like (alternative)
      };

      const type = reactionMap[e.key.toLowerCase()];
      if (type && !commentOpen && !lightboxOpen) {
        e.preventDefault();
        handleReaction(type);
      }
    };

    document.addEventListener('keypress', handleKeyPress);
    return () => document.removeEventListener('keypress', handleKeyPress);
  }, [commentOpen, lightboxOpen, reactionType]);

  const handleReaction = async (type) => {
    if (!currentUser) {
      setAuthPromptAction('like');
      setAuthPromptOpen(true);
      return;
    }
    const prevType = reactionType;
    const prevCount = likesCount;
    const prevSummary = reactionsSummary;

    // Optimistic update
    if (prevType === type) {
      // Remove reaction
      setReactionType(null);
      setLikesCount(p => p - 1);
    } else if (prevType) {
      // Change reaction
      setReactionType(type);
    } else {
      // Add new reaction
      setReactionType(type);
      setLikesCount(p => p + 1);
    }

    setShowReactionPicker(false);

    try {
      const res = await axios.post(`/p/${meme.slug}/like`, { type });
      setReactionType(res.data.reaction_type);
      setLikesCount(res.data.likes_count);
      setReactionsSummary(res.data.reactions_summary);
    } catch (error) {
      // Revert on error
      setReactionType(prevType);
      setLikesCount(prevCount);
      setReactionsSummary(prevSummary);
      
      // Show rate limit error
      if (error.response?.status === 429) {
        setRateLimitError(true);
        setTimeout(() => setRateLimitError(false), 3000);
      }
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      setAuthPromptAction('save');
      setAuthPromptOpen(true);
      setMenuOpen(false);
      return;
    }
    const newSaved = !saved; setSaved(newSaved);
    try { await axios.post(`/p/${meme.slug}/save`); } catch { setSaved(!newSaved); }
    setMenuOpen(false);
  };

  const handleFollow = async () => {
    if (!currentUser) {
      setAuthPromptAction('follow');
      setAuthPromptOpen(true);
      return;
    }
    if (followLoading || isOwn) return;
    setFollowLoading(true);
    const prev = following;
    setFollowing(!prev);
    try {
      await axios.post(`/u/${meme.user.id}/follow`);
    } catch {
      setFollowing(prev);
    }
    setFollowLoading(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/p/${meme.slug}`;
    if (navigator.share) { try { await navigator.share({ title: meme.title, url }); return; } catch {} }
    navigator.clipboard?.writeText(url);
    setShareToast(true); setTimeout(() => setShareToast(false), 2500);
    setMenuOpen(false);
  };

  const openComments = async () => {
    if (!currentUser) {
      setAuthPromptAction('comment');
      setAuthPromptOpen(true);
      return;
    }
    setCommentOpen(true);
    if (!commentsLoaded) {
      try {
        const res = await axios.get(`/p/${meme.slug}/comments`);
        setComments(res.data?.comments ?? []);
        setCommentsLoaded(true);
      } catch (error) {
        console.error('Failed to load comments:', error.response?.status || error.message);
        setComments([]);
        setCommentsLoaded(true);
      }
    }
  };

  const authorName = meme.user?.name ?? "Unknown";
  const authorUsername = meme.user?.username ?? "";

  return (
    <>
      <article className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-md dark:hover:shadow-zinc-900 transition-shadow duration-200 group">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Link href={`/u/${authorUsername.replace("@","")}`} className="flex-shrink-0">
              <Avatar user={meme.user} size="w-9 h-9" className="hover:ring-2 hover:ring-orange-300 transition-all" />
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Link href={`/u/${authorUsername.replace("@","")}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-orange-500 transition-colors truncate">{authorName}</Link>
                {meme.user?.is_verified && <VerifiedBadge size={13} />}
                {!isOwn && (
                  <>
                    <span className="text-gray-200 dark:text-zinc-700 text-xs hidden sm:inline">·</span>
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      type="button"
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                        following
                          ? "bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
                          : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}>
                      {followLoading ? <Loader2 size={12} className="animate-spin" /> : (following ? 'Following' : 'Follow')}
                    </button>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400 dark:text-zinc-500">{meme.created_at}</p>
            </div>
          </div>
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button onClick={() => setMenuOpen((p) => !p)} type="button" className="p-2 rounded-full text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all" aria-label="More options"><MoreHorizontal size={17} /></button>
            {menuOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl py-1.5 z-20" style={{ animation: "menuIn .15s ease" }}>
                {[
                  { icon: Bookmark, label: saved ? "Saved ✓" : "Save", action: handleSave },
                  { icon: Copy,     label: "Copy link",                 action: handleShare },
                  { icon: EyeOff,   label: "Hide post",                 action: () => setMenuOpen(false) },
                  { icon: Flag,     label: "Report",                    action: () => { setMenuOpen(false); setReportOpen(true); }, danger: true },
                ].map(({ icon: Icon, label, action, danger }) => (
                  <button key={label} onClick={action} type="button" className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${danger ? "text-gray-700 dark:text-zinc-200 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600" : "text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700"}`}>
                    <Icon size={15} className="text-gray-400 dark:text-zinc-500 flex-shrink-0" />{label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          {meme.post_type === 'text' ? (
            <Link href={`/p/${meme.slug}`} className="block">
              <TextPostCanvas
                textContent={meme.text_content}
                textStyle={meme.text_style}
                className="group-hover:brightness-95 transition-all duration-300"
              />
            </Link>
          ) : (
          <Link href={`/p/${meme.slug}`} className="block bg-gray-100 dark:bg-zinc-800 overflow-hidden">
            <img
              src={meme.optimized_image_url || meme.image_url}
              alt={meme.title}
              className="w-full object-contain max-h-[600px]"
              loading="lazy"
              decoding="async"
            />
          </Link>
          )}
          <button onClick={() => setLightboxOpen(true)} type="button" className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm" aria-label="View fullscreen"><Maximize2 size={14} /></button>
        </div>

        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-zinc-500 mb-1.5">
            <ReactionsSummary reactions={reactionsSummary} onClick={() => {}} />
            {likesCount > 0 && <span>{fmt(likesCount)} reactions</span>}
            <button onClick={openComments} type="button" className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors"><MessageCircle size={13} />{meme.comments_count} comments</button>
            <span className="flex items-center gap-1"><Eye size={13} />{fmt(meme.views_count ?? 0)} views</span>
          </div>
          <TitleText authorName={authorName} isVerified={meme.user?.is_verified} title={meme.title} slug={meme.slug} />
          {meme.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {meme.tags.map((t) => <span key={t.id} className="text-xs text-orange-500 hover:text-orange-600 cursor-pointer">#{t.name}</span>)}
            </div>
          )}
        </div>

        <div className="flex items-center border-t border-gray-100 dark:border-zinc-800 mt-2">
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
          <button onClick={openComments} type="button" className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-orange-500 transition-colors border-x border-gray-100 dark:border-zinc-800"><MessageCircle size={17} /><span>Comment</span></button>
          <button onClick={handleShare} type="button" className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500 dark:text-zinc-400 hover:text-orange-500 transition-colors"><Share2 size={17} /><span>Share</span></button>
        </div>

        {shareToast && <div className="mx-4 mb-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg text-center flex items-center justify-center gap-2"><Copy size={12} /> Link copied!</div>}
        {rateLimitError && <div className="mx-4 mb-3 px-3 py-2 bg-red-500 text-white text-xs rounded-lg text-center flex items-center justify-center gap-2">⚠️ Too many reactions. Please slow down.</div>}
      </article>

      {commentOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:flex md:items-center md:justify-center md:p-4" role="dialog" aria-modal="true" onClick={() => setCommentOpen(false)}>
          <div ref={sheetRef} className="absolute md:relative bottom-0 md:bottom-auto left-0 md:left-auto right-0 md:right-auto bg-white dark:bg-zinc-900 rounded-t-3xl md:rounded-2xl shadow-2xl border-t md:border border-gray-100 dark:border-zinc-800 flex flex-col w-full md:max-w-2xl" style={{ height: '85vh', maxHeight: '85vh', animation: "slideUp .3s cubic-bezier(.22,.61,.36,1)" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center pt-3 pb-2 md:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-zinc-700" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-zinc-800">
              <div><h3 className="text-base font-semibold text-gray-900 dark:text-white">Comments</h3><p className="text-xs text-gray-400 dark:text-zinc-500">{meme.comments_count} comment{meme.comments_count !== 1 ? "s" : ""}</p></div>
              <button onClick={() => setCommentOpen(false)} type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition" aria-label="Close comments"><X size={16} className="text-gray-500 dark:text-zinc-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 space-y-3">
              {!commentsLoaded && (
                <div className="space-y-3 py-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-2.5 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl px-3 py-2.5 space-y-1.5">
                          <div className="h-2.5 w-20 rounded-full bg-gray-200 dark:bg-zinc-700" />
                          <div className="h-3 w-3/4 rounded-full bg-gray-200 dark:bg-zinc-700" />
                          <div className="h-3 w-1/2 rounded-full bg-gray-200 dark:bg-zinc-700" />
                        </div>
                        <div className="h-2 w-16 rounded-full bg-gray-100 dark:bg-zinc-800 ml-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {commentsLoaded && comments.map((c) => (
                <CommentItem 
                  key={c.id} 
                  comment={c} 
                  memeSlug={meme.slug}
                  onReply={(parentId, mention) => {
                    const findComment = (comments, id) => {
                      for (const comment of comments) {
                        if (comment.id === id) return comment;
                        if (comment.replies) {
                          const found = findComment(comment.replies, id);
                          if (found) return found;
                        }
                      }
                      return null;
                    };
                    const targetComment = findComment(comments, parentId);
                    const userName = targetComment?.user?.name || 'User';
                    setReplyingTo({ parentId, userName, mention });
                  }}
                />
              ))}
              {commentsLoaded && comments.length === 0 && <div className="text-center py-20"><MessageCircle size={32} className="text-gray-200 dark:text-zinc-700 mx-auto mb-3" /><p className="text-sm text-gray-400 dark:text-zinc-500 mb-1">No comments yet.</p><p className="text-xs text-gray-400 dark:text-zinc-600">Be the first to comment!</p></div>}
            </div>
            <div className="sticky bottom-0 bg-white dark:bg-zinc-900 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] border-t border-gray-100 dark:border-zinc-800">
              <CommentInput
                memeSlug={meme.slug}
                user={auth?.user}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)}
                onSubmit={(newC, parentId) => {
                  if (parentId) {
                    const updateReplies = (comments) => {
                      return comments.map((c) => {
                        if (c.id === parentId) {
                          return { ...c, replies: [...(c.replies || []), newC] };
                        } else if (c.replies && c.replies.length > 0) {
                          return { ...c, replies: updateReplies(c.replies) };
                        }
                        return c;
                      });
                    };
                    setComments((prev) => updateReplies(prev));
                  } else {
                    setComments((p) => [newC, ...p]);
                  }
                  setReplyingTo(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {lightboxOpen && meme.post_type !== 'text' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={() => setLightboxOpen(false)} role="dialog" aria-modal="true">
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightboxOpen(false)} type="button" className="absolute -top-3 -right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm z-10" aria-label="Close fullscreen"><X size={18} /></button>
            <img src={meme.image_url} alt={meme.title} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" loading="lazy" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl">
              <p className="text-white text-sm font-medium">{meme.title}</p>
              <Link href={`/p/${meme.slug}`} onClick={() => setLightboxOpen(false)} className="text-orange-300 text-xs hover:text-orange-200 transition-colors mt-0.5 inline-block">View full post</Link>
            </div>
          </div>
        </div>
      )}

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={async ({ reason, details }) => {
          try { await axios.post(`/p/${meme.slug}/report`, { reason: reason.charAt(0).toUpperCase() + reason.slice(1), description: details }); } catch {}
        }}
      />

      <AuthPromptModal
        open={authPromptOpen}
        onClose={() => setAuthPromptOpen(false)}
        action={authPromptAction}
      />

      <style>{`
        @keyframes heartPop { 0%{transform:scale(1)} 30%{transform:scale(1.5)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        .heart-pop { animation: heartPop 0.4s ease-out; }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes menuIn { from{opacity:0;transform:scale(.95) translateY(-4px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>
    </>
  );
}
