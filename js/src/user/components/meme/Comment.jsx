import React, { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronDown, ChevronRight } from 'lucide-react';
import { getAvatarColor } from '../../utils/avatarColors';

const Comment = ({ comment, depth = 0 }) => {
  if (!comment) return null;

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes || 0);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplies, setShowReplies] = useState(false);

  const avatarColor = getAvatarColor(comment.author || 'User');
  const indent = Math.min(depth * 28, 84);

  const handleLike = () => {
    setLikeCount((p) => (liked ? p - 1 : p + 1));
    setLiked((p) => !p);
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplies((p) => [...p, { id: crypto.randomUUID(), author: 'You', text: replyText, likes: 0, time: 'just now', replies: [] }]);
    setReplyText('');
    setShowReplyInput(false);
    setShowReplies(true);
  };

  return (
    <div style={{ marginLeft: indent }} className="mt-3">
      <div className="flex gap-2.5">
        <div className={`w-8 h-8 ${avatarColor} rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mt-0.5`}>
          {comment.author?.[0]?.toUpperCase() || 'U'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-gray-50 rounded-2xl px-3.5 py-2.5 inline-block max-w-full">
            <Link to={`/profile/${comment.author}`} className="text-xs font-semibold text-gray-900 hover:text-orange-500 transition-colors">
              {comment.author}
            </Link>
            <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{comment.text}</p>
          </div>

          <div className="flex items-center gap-3 mt-1.5 ml-1 text-xs text-gray-400">
            <span>{comment.time}</span>
            <button onClick={handleLike} className={`flex items-center gap-1 transition-colors hover:text-red-500 ${liked ? 'text-red-500' : ''}`}>
              <Heart size={12} className={liked ? 'fill-red-500 text-red-500' : ''} />
              {likeCount > 0 && <span>{likeCount}</span>}
            </button>
            <button onClick={() => setShowReplyInput((p) => !p)} className="hover:text-orange-500 transition-colors font-medium">
              Reply
            </button>
          </div>

          {showReplyInput && (
            <form onSubmit={handleReplySubmit} className="flex gap-2 mt-2">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:bg-white transition"
                autoFocus
              />
              <button type="submit" className="px-3 py-2 bg-orange-500 text-white text-xs font-medium rounded-full hover:bg-orange-600 transition">
                Post
              </button>
            </form>
          )}

          {replies.length > 0 && (
            <button
              onClick={() => setShowReplies((p) => !p)}
              className="mt-2 ml-1 text-xs text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 transition-colors"
            >
              {showReplies ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              {showReplies ? 'Hide replies' : `${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
            </button>
          )}

          {showReplies && replies.map((r) => <MemoizedComment key={r.id} comment={r} depth={depth + 1} />)}
        </div>
      </div>
    </div>
  );
};

const MemoizedComment = memo(Comment);
export default MemoizedComment;
