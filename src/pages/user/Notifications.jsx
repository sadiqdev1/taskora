import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { mockNotifications } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/formatters';
import { IoNotifications, IoCheckmarkCircle, IoWallet, IoInformationCircle, IoBriefcase } from 'react-icons/io5';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const getNotificationIcon = (type) => {
    const icons = {
      task_update: <IoCheckmarkCircle size={24} />,
      payment: <IoWallet size={24} />,
      system: <IoInformationCircle size={24} />,
      campaign: <IoBriefcase size={24} />,
    };
    return icons[type] || <IoNotifications size={24} />;
  };

  const getNotificationColor = (type) => {
    const colors = {
      task_update: 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400',
      payment: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
      system: 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400',
      campaign: 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    };
    return colors[type] || 'bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-zinc-400 mt-1">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={<IoNotifications size={48} />}
          title="No notifications"
          description="You're all caught up! Check back later for updates."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              hover
              onClick={() => {
                markAsRead(notification.id);
                if (notification.link) {
                  navigate(notification.link);
                }
              }}
              className={`p-6 cursor-pointer ${
                !notification.read ? 'border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <Badge variant="primary" size="sm">New</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-zinc-400 mb-2">
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-zinc-500">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
