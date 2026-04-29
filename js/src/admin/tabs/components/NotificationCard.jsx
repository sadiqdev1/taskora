import React from 'react';
import { CheckCircle, Trash2, Clock } from 'lucide-react';

const NotificationCard = ({ notif, markAsRead, deleteNotification }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 transition-all duration-200
        hover:shadow-lg ${notif.read ? 'border border-gray-100' : 'border border-orange-200 bg-orange-50/30'}`}>
      
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
            ${notif.read ? 'bg-gray-100 text-gray-400' : 'bg-orange-50 text-orange-500'}`}>
          {notif.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-800">{notif.title}</h3>
            {!notif.read && <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 animate-pulse"></span>}
          </div>

          <p className="text-sm text-gray-600 mt-0.5">{notif.description}</p>

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock size={12} />
              {notif.time}
            </span>

            <div className="flex items-center gap-3">
              {!notif.read && (
                <button onClick={() => markAsRead(notif.id)}
                  className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors">
                  <CheckCircle size={14} />
                  <span>Mark read</span>
                </button>
              )}

              <button onClick={() => deleteNotification(notif.id)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default NotificationCard;