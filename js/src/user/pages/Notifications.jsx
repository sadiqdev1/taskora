import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, AtSign, Trophy, Users, Star, Share2, BellOff, Bell } from 'lucide-react';

const fetchNotifications = async (page = 1, limit = 8) => {
  await new Promise((r) => setTimeout(r, 700));
  const base = [
    { id: 1, user: 'dankmemer', action: 'liked your meme', time: '2m ago', dateGroup: 'Today', read: false, icon: Heart, iconColor: 'text-red-500', iconBg: 'bg-red-50', preview: 'https://picsum.photos/40/40?random=1', postId: 123 },
    { id: 2, user: 'lolmaster', action: 'commented: "This is gold! 😂"', time: '15m ago', dateGroup: 'Today', read: false, icon: MessageCircle, iconColor: 'text-blue-500', iconBg: 'bg-blue-50', preview: 'https://picsum.photos/40/40?random=2', postId: 456 },
    { id: 3, user: 'sadiqdev', action: 'started following you', time: '1h ago', dateGroup: 'Today', read: true, icon: UserPlus, iconColor: 'text-green-500', iconBg: 'bg-green-50', preview: 'https://ui-avatars.com/api/?name=Sadiq+Dev&background=random&length=2&size=40', profileId: 'sadiqdev' },
    { id: 4, user: 'gitgud', action: 'liked your meme', time: '3h ago', dateGroup: 'Today', read: false, icon: Heart, iconColor: 'text-red-500', iconBg: 'bg-red-50', preview: 'https://picsum.photos/40/40?random=3', postId: 789 },
    { id: 5, user: 'system', action: 'Your meme reached 10K upvotes! 🎉', time: '5h ago', dateGroup: 'Today', read: false, icon: Trophy, iconColor: 'text-yellow-500', iconBg: 'bg-yellow-50', preview: 'https://picsum.photos/40/40?random=4', postId: 101 },
    { id: 6, user: 'coder', action: 'mentioned you in a comment', time: '2d ago', dateGroup: 'This Week', read: true, icon: AtSign, iconColor: 'text-purple-500', iconBg: 'bg-purple-50', preview: 'https://picsum.photos/40/40?random=5', postId: 202 },
    { id: 7, user: 'laughlover', action: 'liked your meme', time: '3d ago', dateGroup: 'This Week', read: true, icon: Heart, iconColor: 'text-red-500', iconBg: 'bg-red-50', preview: 'https://picsum.photos/40/40?random=6', postId: 303 },
    { id: 8, user: 'memequeen', action: 'started following you', time: '4d ago', dateGroup: 'This Week', read: false, icon: UserPlus, iconColor: 'text-green-500', iconBg: 'bg-green-50', preview: 'https://ui-avatars.com/api/?name=Meme+Queen&background=random&length=2&size=40', profileId: 'memequeen' },
    { id: 9, user: 'programmerhumor', action: 'commented: "So true! 😆"', time: '5d ago', dateGroup: 'This Week', read: true, icon: MessageCircle, iconColor: 'text-blue-500', iconBg: 'bg-blue-50', preview: 'https://picsum.photos/40/40?random=7', postId: 404 },
    { id: 10, user: 'system', action: 'You reached 100 followers!', time: '6d ago', dateGroup: 'This Week', read: true, icon: Users, iconColor: 'text-orange-500', iconBg: 'bg-orange-50', preview: 'https://picsum.photos/40/40?random=8' },
    { id: 11, user: 'user123', action: 'liked your meme', time: '2w ago', dateGroup: 'Earlier', read: true, icon: Heart, iconColor: 'text-red-500', iconBg: 'bg-red-50', preview: 'https://picsum.photos/40/40?random=9', postId: 505 },
    { id: 12, user: 'devlife', action: 'started following you', time: '3w ago', dateGroup: 'Earlier', read: true, icon: UserPlus, iconColor: 'text-green-500', iconBg: 'bg-green-50', preview: 'https://ui-avatars.com/api/?name=Dev+Life&background=random&length=2&size=40', profileId: 'devlife' },
    { id: 13, user: 'system', action: 'Your meme was featured! ⭐', time: '2mo ago', dateGroup: 'Earlier', read: true, icon: Star, iconColor: 'text-yellow-500', iconBg: 'bg-yellow-50', preview: 'https://picsum.photos/40/40?random=11', postId: 707 },
  ];
  const start = (page - 1) * limit;
  return { notifications: base.slice(start, start + limit), hasMore: start + limit < base.length };
};

const Skeleton = () => (
  <div className="flex items-center gap-3 p-4 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-3/4 rounded-full bg-gray-100" />
      <div className="h-2.5 w-1/4 rounded-full bg-gray-100" />
    </div>
    <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0" />
  </div>
);

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('all');
  const sentinelRef = useRef();

  const load = async (pageNum, reset = false) => {
    setLoading(true);
    const data = await fetchNotifications(pageNum, 8);
    setNotifications((prev) => {
      const merged = reset ? data.notifications : [...prev, ...data.notifications];
      return Array.from(new Map(merged.map((n) => [n.id, n])).values());
    });
    setHasMore(data.hasMore);
    setLoading(false);
  };

  useEffect(() => { load(1, true); }, []);
  useEffect(() => { if (page > 1) load(page); }, [page]);

  useEffect(() => {
    if (loading || !hasMore) return;
    const obs = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) setPage((p) => p + 1); }, { threshold: 0.1 });
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loading, hasMore]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;
  const grouped = filtered.reduce((acc, n) => { (acc[n.dateGroup] = acc[n.dateGroup] || []).push(n); return acc; }, {});
  const groupOrder = ['Today', 'This Week', 'Earlier'];

  const markAsRead = (id) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Bell size={18} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && <p className="text-xs text-gray-400">{unreadCount} unread</p>}
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors px-3 py-1.5 rounded-full hover:bg-orange-50">
            Mark all read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 mb-5 bg-white border border-gray-100 rounded-xl p-1.5 shadow-sm">
        {[{ id: 'all', label: 'All' }, { id: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` }].map(({ id, label }) => (
          <button key={id} onClick={() => setFilter(id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${filter === id ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {groupOrder.map((group) => {
          const items = grouped[group];
          if (!items?.length) return null;
          return (
            <div key={group}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">{group}</p>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                {items.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <Link
                      key={notif.id}
                      to={notif.postId ? `/p/post-${notif.postId}` : `/profile/${notif.profileId}`}
                      onClick={() => markAsRead(notif.id)}
                      className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-orange-50/40' : ''}`}
                    >
                      <div className="relative flex-shrink-0">
                        <img src={notif.preview} alt={notif.user} className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${notif.user}&background=random&length=1&size=40`; }} loading="lazy" />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 ${notif.iconBg} rounded-full flex items-center justify-center border-2 border-white`}>
                          <Icon size={10} className={notif.iconColor} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 leading-snug">
                          <span className="font-semibold">{notif.user}</span>{' '}{notif.action}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{notif.time}</p>
                      </div>

                      {!notif.read && <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}

        {hasMore && !loading && <div ref={sentinelRef} className="h-4" />}
        {loading && <><Skeleton /><Skeleton /><Skeleton /></>}

        {!loading && notifications.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-14 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BellOff size={22} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700">{filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}</p>
            <p className="text-xs text-gray-400 mt-1">When someone interacts with you, it'll show up here.</p>
            <Link to="/" className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-medium transition">
              Explore memes
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
