import React from 'react';
import { Image, Check, X, Star, Trash2, Calendar, Tag } from 'lucide-react';

const MemeMobileCard = ({ meme, onApprove, onReject, onFeature, onDelete, getCategoryBadge, getStatusBadge }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
    <div className="flex items-start gap-3">
      <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
        {meme.thumbnail?.startsWith('data:') || meme.thumbnail?.startsWith('http')
          ? <img src={meme.thumbnail} alt="" className="w-full h-full object-cover rounded-xl" />
          : <Image size={20} className="text-gray-400" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{meme.caption}</p>
        <p className="text-xs text-gray-500 mt-0.5">{meme.author}</p>
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {getCategoryBadge(meme.category)}
          {getStatusBadge(meme.status)}
          {meme.featured && <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-600 rounded-full">Featured</span>}
          {meme.nsfw && <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">NSFW</span>}
        </div>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Calendar size={11} />{meme.uploadDate}</span>
          {meme.tags?.length > 0 && (
            <span className="flex items-center gap-1 truncate max-w-[140px]">
              <Tag size={11} />{meme.tags.map((t) => `#${t}`).join(' ')}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-100">
      {[
        { icon: Check, color: 'text-green-500 hover:bg-green-50', action: () => onApprove(meme.id), title: 'Approve' },
        { icon: X, color: 'text-red-500 hover:bg-red-50', action: () => onReject(meme.id), title: 'Reject' },
        { icon: Star, color: 'text-yellow-500 hover:bg-yellow-50', action: () => onFeature(meme.id), title: 'Feature' },
        { icon: Trash2, color: 'text-gray-500 hover:bg-gray-100', action: () => onDelete(meme.id), title: 'Delete' },
      ].map(({ icon: Icon, color, action, title }) => (
        <button key={title} onClick={action} title={title} className={`p-2.5 rounded-full transition-colors ${color}`}>
          <Icon size={16} />
        </button>
      ))}
    </div>
  </div>
);

export default MemeMobileCard;
