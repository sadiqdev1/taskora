import React from 'react';
import { CheckCircle, Trash2, Clock } from 'lucide-react';

const NotificationCard = ({ notif, markAsRead, deleteNotification }) => (
  <div className={`bg-white rounded-xl border p-4 transition-all duration-200 hover:shadow-sm
    ${notif.read ? 'border-gray-100' : 'border-orange-200 bg-orange-50/30'}`}>
    <div className="flex items-start gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
        ${notif.read ? 'bg-gray-100 text-gray-400' : 'bg-orange-100 text-orange-500'}`}>
        {notif.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
          {!notif.read && <span className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.description}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={11} />{notif.time}
          </span>
          <div className="flex items-center gap-2">
            {!notif.read && (
              <button onClick={() => markAsRead(notif.id)}
                className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 transition-colors">
                <CheckCircle size={13} /> Mark read
              </button>
            )}
            <button onClick={() => deleteNotification(notif.id)}
              className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NotificationCard;
