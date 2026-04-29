import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../admin/Contexts/ToastContexts';
import LoadingSpinner from '../components/LoadingSpinner';
import Comment from '../components/meme/Comment';
import {
  ArrowLeft, Heart, MessageCircle, Share2,
  MoreHorizontal, Copy, Flag, Bookmark,
  Send, ChevronRight,
} from 'lucide-react';
import { getAvatarColor } from '../utils/avatarColors';
import { idFromSlug, toSlug } from '../utils/slug';

const fmt = (n) => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n);

const mockMeme = {
  id: 1,
  title: 'When the code finally works',
  author: 'dankmemer',
  upvotes: 12400,
  comments: 342,
  shares: 89,
  imageUrl: 'https://picsum.photos/800/800?random=1',
  timeAgo: '2h ago',
  description: 'That feeling when you stare at the screen for 3 hours and finally figure out it was a missing semicolon. Every developer has been there.',
  tags: ['programming', 'devlife', 'coding'],
  commentsList: [
    { id: 1, author: 'user123', text: 'This is hilarious! 😂', time: '2h ago', likes: 24, replies: [
      { id: 11, author: 'dankmemer', text: 'Right? I can relate 😆', time: '1h ago', likes: 8, replies: [] },
    ]},
    { id: 2, author: 'sadiqdev', text: 'I feel personally attacked 😂', time: '1h ago', likes: 15, replies: [] },
    { id: 3, author: 'programmerhumor', text: 'Every dev knows this struggle 😭', time: '2h ago', likes: 31, replies: [] },
    { id: 4, author: 'gitgud', text: 'The semicolon gets me every time 😅', time: '3h ago', likes: 9, replies: [] },
  ],
};

const MemeDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const id = idFromSlug(slug);

  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const menuRef = useRef(null);
  const commentInputRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      // In real app: fetch by id from API
      setMeme({ ...mockMeme, id: parseInt(id) });
      setLocalLikes(mockMeme.upvotes);
      setComments(mockMeme.commentsList);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleLike = () => {
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 400);
    setLiked((p) => !p);
    setLocalLikes((p) => (liked ? p - 1 : p + 1));
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: meme?.title, url }); return; } catch {}
    }
    navigator.clipboard?.writeText(url);
    toast.addToast('Link copied!', 'success');
    setMenuOpen(false);
  };

  const handleCommentSubmit = (e) => {
    e?.preventDefault();
    if (!newComment.trim()) return;
    setComments((p) => [{ id: Date.now(), author: 'You', text: newComment, time: 'just now', likes: 0, replies: [] }, ...p]);
    setNewComment('');
  };

  if (loading) return <LoadingSpinner text="Loading post..." />;
  if (!meme) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-sm mb-4">Post not found.</p>
      <Link to="/" className="text-orange-500 text-sm font-semibold hover:underline">← Back to feed</Link>
    </div>
  );

  const avatarColor = getAvatarColor(meme.author);

  return (
    <div className="max-w-5xl mx-auto">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-5">
        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/trending" className="hover:text-orange-500 transition-colors">Memes</Link>
        <ChevronRight size={12} />
        <span className="text-gray-600 truncate max-w-[200px]">{meme.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">

        {/* ── Left: Image ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <img
            src={meme.imageUrl}
            alt={meme.title}
            className="w-full object-cover"
            loading="lazy"
          />
        </div>

        {/* ── Right: Content + Comments ── */}
        <div className="flex flex-col gap-4">

          {/* Post card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Author row */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Link to={`/profile/${meme.author}`}>
                  <div className={`w-10 h-10 ${avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-sm hover:ring-2 hover:ring-orange-300 transition-all`}>
                    {meme.author?.[0]?.toUpperCase()}
                  </div>
                </Link>
                <div>
                  <Link to={`/profile/${meme.author}`} className="text-sm font-semibold text-gray-900 hover:text-orange-500 transition-colors block">
                    {meme.author}
                  </Link>
                  <p className="text-xs text-gray-400">{meme.timeAgo}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFollowing((p) => !p)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    following ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  {following ? 'Following' : 'Follow'}
                </button>

                <div className="relative" ref={menuRef}>
                  <button onClick={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
                    <MoreHorizontal size={17} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-1.5 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 z-10"
                      style={{ animation: 'menuIn .15s ease' }}>
                      {[
                        { icon: Copy,     label: 'Copy link',           action: handleShare },
                        { icon: Bookmark, label: saved ? 'Saved ✓' : 'Save', action: () => { setSaved(p => !p); setMenuOpen(false); } },
                        { icon: Flag,     label: 'Report',              action: () => { toast.addToast('Report submitted', 'info'); setMenuOpen(false); }, danger: true },
                      ].map(({ icon: Icon, label, action, danger }) => (
                        <button key={label} onClick={action}
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                            danger ? 'text-gray-700 hover:bg-red-50 hover:text-red-600' : 'text-gray-700 hover:bg-gray-50'
                          }`}>
                          <Icon size={14} className="text-gray-400" />{label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Title + description */}
            <div className="px-4 py-4">
              <h1 className="text-lg font-bold text-gray-900 leading-snug">{meme.title}</h1>
              {meme.description && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{meme.description}</p>
              )}
              {meme.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {meme.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-5 px-4 py-2.5 border-t border-gray-100 text-xs text-gray-400">
              <span className={`flex items-center gap-1.5 ${liked ? 'text-red-500' : ''}`}>
                <Heart size={13} className={liked ? 'fill-red-500 text-red-500' : ''} />
                {fmt(localLikes)} likes
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle size={13} />
                {fmt(comments.length)} comments
              </span>
              <span className="flex items-center gap-1.5">
                <Share2 size={13} />
                {fmt(meme.shares)} shares
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center border-t border-gray-100">
              <button onClick={handleLike}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
                <span className={likeAnim ? 'heart-pop inline-block' : 'inline-block'}>
                  <Heart size={17} className={liked ? 'fill-red-500 text-red-500' : ''} />
                </span>
                {liked ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={() => commentInputRef.current?.focus()}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-500 hover:text-blue-500 transition-colors border-x border-gray-100">
                <MessageCircle size={17} /> Comment
              </button>
              <button onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-500 hover:text-orange-500 transition-colors">
                <Share2 size={17} /> Share
              </button>
            </div>
          </div>

          {/* ── Comments ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-900">
                {comments.length} Comment{comments.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-b border-gray-100">
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:bg-white transition"
                />
                <button type="submit"
                  className="p-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition disabled:opacity-40"
                  disabled={!newComment.trim()}>
                  <Send size={15} />
                </button>
              </form>
            </div>

            {/* Comment list */}
            <div className="px-4 py-3 space-y-1 max-h-[400px] overflow-y-auto">
              {comments.length > 0
                ? comments.map((c) => <Comment key={c.id} comment={c} />)
                : (
                  <div className="text-center py-8">
                    <MessageCircle size={24} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No comments yet. Start the conversation!</p>
                  </div>
                )
              }
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes heartPop { 0%{transform:scale(1)} 30%{transform:scale(1.5)} 60%{transform:scale(1.1)} 100%{transform:scale(1)} }
        .heart-pop { animation: heartPop .4s ease-out; }
        @keyframes menuIn { from{opacity:0;transform:scale(.95) translateY(-4px)} to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>
    </div>
  );
};

export default MemeDetail;
