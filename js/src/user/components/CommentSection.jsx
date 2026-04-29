import React, { useState } from 'react';

const CommentSection = ({ comments: initialComments = [] }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      author: 'current_user', // 🔁 Replace with actual logged-in user (from context/auth)
      text: newComment,
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-800">Comments ({comments.length})</h3>
      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3 text-sm">
            {/* Avatar – safe access with fallback */}
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
              {c.author?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{c.author || 'Anonymous'}</p>
              <p className="text-gray-600 mt-0.5">{c.text}</p>
              <p className="text-xs text-gray-400 mt-1">
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : 'just now'}
              </p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400/50"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentSection;