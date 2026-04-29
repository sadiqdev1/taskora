import React from 'react';
import { Image, Check, X, Star, Trash2 } from 'lucide-react';

const MemeTable = ({ memes, onApprove, onReject, onFeature, onDelete, getCategoryBadge, getStatusBadge }) => (
  <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {['Thumbnail', 'Caption', 'Author', 'Date', 'Category', 'Status', 'Tags', 'Actions'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {memes.length > 0 ? memes.map((meme) => (
            <tr key={meme.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-3">
                <div className="w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {meme.thumbnail?.startsWith('data:') || meme.thumbnail?.startsWith('http')
                    ? <img src={meme.thumbnail} alt="" className="w-full h-full object-cover" />
                    : <Image size={16} className="text-gray-400" />
                  }
                </div>
              </td>
              <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px] truncate">{meme.caption}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{meme.author}</td>
              <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{meme.uploadDate}</td>
              <td className="px-4 py-3">{getCategoryBadge(meme.category)}</td>
              <td className="px-4 py-3">{getStatusBadge(meme.status)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1 max-w-[130px]">
                  {meme.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">#{t}</span>
                  ))}
                  {meme.tags.length > 2 && <span className="text-xs text-gray-400">+{meme.tags.length - 2}</span>}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  {[
                    { icon: Check, cls: 'text-green-500 hover:bg-green-50', fn: () => onApprove(meme.id), title: 'Approve' },
                    { icon: X, cls: 'text-red-500 hover:bg-red-50', fn: () => onReject(meme.id), title: 'Reject' },
                    { icon: Star, cls: 'text-yellow-500 hover:bg-yellow-50', fn: () => onFeature(meme.id), title: 'Feature' },
                    { icon: Trash2, cls: 'text-gray-400 hover:bg-gray-100', fn: () => onDelete(meme.id), title: 'Delete' },
                  ].map(({ icon: Icon, cls, fn, title }) => (
                    <button key={title} onClick={fn} title={title} className={`p-1.5 rounded-lg transition-colors ${cls}`}>
                      <Icon size={14} />
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="8" className="px-4 py-10 text-center text-sm text-gray-400">No memes found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default MemeTable;
