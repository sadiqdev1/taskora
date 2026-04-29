import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart, MessageCircle, Ellipsis, Flag, Bookmark,
  Copy, EyeOff, Image as ImageIcon, Share2, X,
  Maximize2,
} from 'lucide-react';
import ReportModal from './meme/ReportModal';
import Comment from './meme/Comment';
import Reactions from './meme/Reactions';
import { getAvatarColor } from '../utils/avatarColors';
import { toSlug } from '../utils/slug';

const MemeCard = ({ meme }) => {
  if (!meme) return null;

  const navigate = useNavigate();
  const slug = toSlug(meme.title, meme.id);
  const postUrl = `/p/${slug}`;

  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(meme.likes || meme.upvotes || 0);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [newComment, setNewComment] = useState('');

  const [comments, setComments] = useState([
    { id: 1, author: 'user123', text: 'This is hilarious! 😂', time: '2h ago', likes: 24, replies: [
      { id: 11, author: 'dankmemer', text: 'Right? I can relate 😆', time: '1h ago', likes: 8, replies: [] },
    ]},
    { id: 2, author: 'Sadiqdev', text: 'I feel personally attacked 😂', time: '1h ago', likes: 15, replies: [] },
    { id: 3, author: 'programmerhumor', text: 'Every dev knows this struggle 😭', time: '2h ago', likes: 31, replies: [] },
  ]);

  const menuRef = useRef(null);
  const sheetRef = useRef(null);
  const lightboxRef = useRef(null);
  const avatarColor = getAvatarColor(meme.author || 'User');

  const fmt = (n) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };

  const handleLike = () => {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    setLikesCount((p) => (liked ? p - 1 : p + 1));
    setLiked((p) => !p);
  };

  const handleShare = async () => {
    const link = `${window.location.origin}${postUrl}`;
    // Use Web Share API on mobile if available
    if (navigator.share) {
      try {
        await navigator.share({ title: meme.title, url: link });
        return;
      } catch {}
    }
    try { await navigator.clipboard.writeText(link); } catch {}
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    setComments((p) => [{ id: Date.now(), author: 'You', text: newComment, time: 'just now', likes: 0, replies: [] }, ...p]);
    setNewComment('');
  };

  // Scroll lock when any overlay is open
  useEffect(() => {
    document.body.style.overflow = (commentOpen || lightboxOpen || reportOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [commentOpen, lightboxOpen, reportOpen]);

  // Outside click handlers
  useEffect(() => {
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (sheetRef.current && !sheetRef.current.contains(e.target)) setCommentOpen(false);
      if (lightboxRef.current && !lightboxRef.current.contains(e.target)) setLightboxOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // ESC key
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); setCommentOpen(false); setLightboxOpen(false); setReportOpen(false); }
    };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, []);

  return (
    <>
      <article className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200 w-full group">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <Link to={`/profile/${meme.author}`}>
              <div className={`w-9 h-9 ${avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 hover:ring-2 hover:ring-orange-300 transition-all`}>
                {meme.author?.[0]?.toUpperCase() || 'U'}
              </div>
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <Link to={`/profile/${meme.author}`} className="text-sm font-semibold text-gray-900 hover:text-orange-500 transition-colors">
                {meme.author || 'Anonymous'}
              </Link>
              <button
                onClick={() => setFollowing((p) => !p)}
                type="button"
                className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                  following ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {following ? 'Following' : 'Follow'}
              </button>
              <span className="text-xs text-gray-400">{meme.timeAgo || '2h'}</span>
            </div>
          </div>

          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen((p) => !p)} type="button"
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all" aria-label="Options">
              <Ellipsis size={17} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-20" style={{ animation: 'menuIn .15s ease' }}>
                {[
                  { icon: Flag,     label: 'Report',              action: () => { setMenuOpen(false); setReportOpen(true); }, danger: true },
                  { icon: Bookmark, label: saved ? 'Saved ✓' : 'Save', action: () => { setSaved(p => !p); setMenuOpen(false); } },
                  { icon: Copy,     label: 'Copy link',           action: () => { handleShare(); setMenuOpen(false); } },
                  { icon: EyeOff,   label: 'Hide post',           action: () => setMenuOpen(false) },
                ].map(({ icon: Icon, label, action, danger }) => (
                  <button key={label} onClick={action} type="button"
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                      danger ? 'text-gray-700 hover:bg-red-50 hover:text-red-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                    <Icon size={15} className="text-gray-400 flex-shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Image — click → post page, expand button → lightbox ── */}
        <div className="relative">
          <Link to={postUrl} className="block aspect-square bg-gray-100 overflow-hidden">
            {meme.imageUrl
              ? <img src={meme.imageUrl} alt={meme.title || 'Meme'} className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" loading="lazy" />
              : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={36} className="text-gray-300" /></div>
            }
          </Link>
          {/* Expand to lightbox */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
            aria-label="View full size"
          >
            <Maximize2 size={14} />
          </button>
        </div>

        {/* ── Stats + Caption ── */}
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-1.5">
            <span className={`flex items-center gap-1 transition-colors ${liked ? 'text-red-500' : ''}`}>
              <Heart size={13} className={liked ? 'fill-red-500 text-red-500' : ''} />
              {fmt(likesCount)} {likesCount === 1 ? 'like' : 'likes'}
            </span>
            <button onClick={() => setCommentOpen(true)} className="flex items-center gap-1 hover:text-gray-600 transition-colors">
              <MessageCircle size={13} />
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </button>
          </div>
          <Link to={postUrl} className="block">
            <p className="text-sm text-gray-800 leading-snug hover:text-gray-600 transition-colors">
              <span className="font-semibold text-gray-900">{meme.author || 'Anonymous'} </span>
              {meme.title || 'Untitled'}
            </p>
          </Link>
        </div>

        {/* ── Action Bar ── */}
        <div className="flex items-center border-t border-gray-100 mt-1">
          <Reactions onLike={handleLike} likeAnimation={likeAnim} liked={liked} onReact={(type) => { if (type === 'like') handleLike(); }}>
            <button onClick={handleLike} type="button"
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
              <span className={likeAnim ? 'heart-pop inline-block' : 'inline-block'}>
                <Heart size={17} className={liked ? 'fill-red-500 text-red-500' : ''} />
              </span>
              <span>{liked ? 'Liked' : 'Like'}</span>
            </button>
          </Reactions>

          <button onClick={() => setCommentOpen(true)} type="button"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors border-x border-gray-100">
            <MessageCircle size={17} />
            <span>Comment</span>
          </button>

          <button onClick={handleShare} type="button"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors">
            <Share2 size={17} />
            <span>Share</span>
          </button>
        </div>

        {/* Share toast */}
        {shareToast && (
          <div className="mx-4 mb-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg text-center flex items-center justify-center gap-2">
            <Copy size={12} /> Link copied to clipboard
          </div>
        )}
      </article>

      {/* ── Comment Bottom Sheet ── */}
      {commentOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label="Comments">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCommentOpen(false)} />
          <div ref={sheetRef} className="relative bg-white w-full max-w-2xl rounded-t-2xl shadow-2xl z-10 flex flex-col max-h-[88vh]"
            style={{ animation: 'slideUp .3s cubic-bezier(.22,.61,.36,1)' }}
            onClick={(e) => e.stopPropagation()}>

            {/* Sheet handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Comments</h3>
                <p className="text-xs text-gray-400">{comments.length} comment{comments.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={postUrl} onClick={() => setCommentOpen(false)}
                  className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors px-3 py-1.5 rounded-full hover:bg-orange-50">
                  View post →
                </Link>
                <button onClick={() => setCommentOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition" type="button">
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-2 space-y-1">
              {comments.length > 0
                ? comments.map((c) => <Comment key={c.id} comment={c} />)
                : <div className="text-center py-12">
                    <MessageCircle size={28} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
                  </div>
              }
            </div>

            <div className="sticky bottom-0 bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:pb-3 border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:bg-white transition"
                />
                <button onClick={handleCommentSubmit} type="button"
                  className="px-4 py-2.5 bg-orange-500 text-white rounded-full text-sm font-semibold hover:bg-orange-600 transition">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxOpen(false)} role="dialog" aria-modal="true">
          <div ref={lightboxRef} className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightboxOpen(false)}
              className="absolute -top-3 -right-3 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm z-10">
              <X size={18} />
            </button>
            <img src={meme.imageUrl} alt={meme.title || 'Meme'}
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl">
              <p className="text-white text-sm font-medium">{meme.title}</p>
              <Link to={postUrl} onClick={() => setLightboxOpen(false)}
                className="text-orange-300 text-xs hover:text-orange-200 transition-colors mt-0.5 inline-block">
                View full post →
              </Link>
            </div>
          </div>
        </div>
      )}

      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} onSubmit={() => {}} />

      <style>{`
        @keyframes heartPop { 0%{transform:scale(1)} 30%{transform:scale(1.5)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        .heart-pop { animation: heartPop 0.4s ease-out; }
        @keyframes slideUp { from{transform:translateY(100%);opacity:.5} to{transform:translateY(0);opacity:1} }
        @keyframes menuIn { from{opacity:0;transform:scale(.95) translateY(-4px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>
    </>
  );
};

export default MemeCard;
