import React from 'react';
import { User, CheckCircle, Clock, Check, Star } from 'lucide-react';

const FeedbackCard = ({ item, onMarkRead, onStatusChange, getTypeBadge, getStatusBadge }) => {
  const renderStars = (r) => (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={12} className={s <= r ? 'text-orange-400 fill-orange-400' : 'text-gray-200'} />
      ))}
    </div>
  );

  return (
    <div className={`relative bg-white rounded-xl border p-4 transition-all hover:shadow-sm
      ${item.read ? 'border-gray-100' : 'border-orange-200 bg-orange-50/20'}`}>
      {!item.read && <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-orange-500 rounded-full" />}

      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.read ? 'bg-gray-100' : 'bg-orange-100'}`}>
          <User size={15} className={item.read ? 'text-gray-400' : 'text-orange-600'} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-400">{item.email}</p>
              {renderStars(item.rating)}
            </div>
            {getStatusBadge(item.status)}
          </div>
        </div>
      </div>

      <div className="mt-3">{getTypeBadge(item.type)}</div>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.message}</p>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">{item.date}</span>
        <div className="flex items-center gap-1">
          {!item.read && (
            <button onClick={() => onMarkRead(item.id)} className="p-1.5 rounded-lg hover:bg-blue-50 transition" title="Mark read">
              <CheckCircle size={14} className="text-blue-500" />
            </button>
          )}
          <button onClick={() => onStatusChange(item.id, 'resolved')} className="p-1.5 rounded-lg hover:bg-green-50 transition" title="Resolve">
            <Check size={14} className="text-green-500" />
          </button>
          <button onClick={() => onStatusChange(item.id, 'in review')} className="p-1.5 rounded-lg hover:bg-orange-50 transition" title="In review">
            <Clock size={14} className="text-orange-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
