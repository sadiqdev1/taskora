import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { mockNotifications } from '../../data/mockData';
import { formatRelativeTime } from '../../utils/formatters';
import { IoNotifications, IoCheckmarkCircle, IoWallet, IoInformationCircle, IoBriefcase } from 'react-icons/io5';
import { motion } from 'framer-motion';

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
      task_update: <IoCheckmarkCircle size={22} />,
      payment: <IoWallet size={22} />,
      system: <IoInformationCircle size={22} />,
      campaign: <IoBriefcase size={22} />,
    };
    return icons[type] || <IoNotifications size={22} />;
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

  // Group notifications by date
  const groupByDate = (items) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const groups = { Today: [], Yesterday: [], 'This Week': [], Earlier: [] };

    items.forEach(n => {
      const d = new Date(n.createdAt);
      const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (day >= today) groups['Today'].push(n);
      else if (day >= yesterday) groups['Yesterday'].push(n);
      else if (day >= weekAgo) groups['This Week'].push(n);
      else groups['Earlier'].push(n);
    });

    // Only return groups that have items
    return Object.entries(groups).filter(([, items]) => items.length > 0);
  };

  const grouped = groupByDate(notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-24 md:pb-6"
    >
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Notifications
            </h1>
            <p className="text-gray-600 dark:text-zinc-400">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : "You're all caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          )}
        </div>
      </motion.div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={<IoNotifications size={48} />}
          title="No notifications"
          description="You're all caught up! Check back later for updates."
        />
      ) : (
        <div className="space-y-6">
          {grouped.map(([label, items], groupIndex) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + groupIndex * 0.05 }}
            >
              {/* Date Group Label */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-zinc-500">
                  {label}
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-zinc-800" />
                <span className="text-xs text-gray-400 dark:text-zinc-600">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Notifications in group */}
              <div className="space-y-2">
                {items.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.04 }}
                    whileHover={{ x: 3 }}
                  >
                    <Card
                      hover
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.link) navigate(notification.link);
                      }}
                      className={`p-4 cursor-pointer transition-all ${
                        !notification.read
                          ? 'border-l-4 border-blue-500 bg-blue-50/30 dark:bg-blue-500/5'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-0.5">
                            <h3 className={`text-sm font-semibold ${
                              !notification.read
                                ? 'text-gray-900 dark:text-white'
                                : 'text-gray-700 dark:text-zinc-300'
                            }`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {!notification.read && (
                                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-zinc-400 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-zinc-600">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Notifications;
