import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  IoHome,
  IoStorefront,
  IoWallet,
  IoEllipsisHorizontal,
  IoClose,
  IoCheckmarkDone,
  IoBriefcase,
  IoSwapHorizontal,
  IoSettings,
  IoAdd,
  IoGrid,
} from 'react-icons/io5';
import taskoraLogo from '../../assets/taskora-logo.svg';

const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  const mainItems = [
    { path: '/dashboard', label: 'Home', icon: IoHome },
    { path: '/tasks', label: 'Marketplace', icon: IoStorefront },
    { path: '/wallet', label: 'Wallet', icon: IoWallet },
  ];

  const moreItems = [
    { path: '/my-tasks', label: 'My Tasks', icon: IoCheckmarkDone },
    { path: '/transactions', label: 'Transactions', icon: IoSwapHorizontal },
    { path: '/settings', label: 'Settings', icon: IoSettings },
  ];

  // Add creator items
  if (user?.role === 'creator' || user?.role === 'admin') {
    moreItems.unshift(
      { path: '/campaigns/create', label: 'Create Campaign', icon: IoAdd },
      { path: '/campaigns', label: 'My Campaigns', icon: IoBriefcase }
    );
  }

  // Add admin panel
  if (user?.role === 'admin' || user?.role === 'moderator') {
    moreItems.unshift({ path: '/admin', label: 'Admin Panel', icon: IoGrid });
  }

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const hasActiveMore = moreItems.some((item) => isActive(item.path));

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md md:hidden">
        <div className="flex h-16 items-center">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-all active:scale-95"
              >
                <div className={`p-1.5 rounded-xl transition-all ${
                  active ? 'bg-blue-50 dark:bg-blue-500/10' : ''
                }`}>
                  <Icon
                    size={19}
                    className={`transition-colors ${
                      active ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-500'
                    }`}
                  />
                </div>
                <span className={`mt-0.5 text-[10px] ${
                  active ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-500'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setMoreOpen(true)}
            className="group flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-all active:scale-95"
          >
            <div className={`p-1.5 rounded-xl transition-all ${
              hasActiveMore ? 'bg-blue-50 dark:bg-blue-500/10' : ''
            }`}>
              <IoEllipsisHorizontal
                size={19}
                className={hasActiveMore ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-500'}
              />
            </div>
            <span className={`mt-0.5 text-[10px] ${
              hasActiveMore ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-500'
            }`}>
              More
            </span>
          </button>
        </div>
      </nav>

      {/* More Menu Modal */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative w-full bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl border-t border-gray-100 dark:border-zinc-800 pb-[env(safe-area-inset-bottom)]"
            style={{ animation: 'slideUp .25s cubic-bezier(.22,.61,.36,1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-zinc-700" />
            </div>
            <div className="px-4 py-3 space-y-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <Icon size={18} className={active ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-500'} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="px-4 pb-4">
              <button
                onClick={() => setMoreOpen(false)}
                className="w-full py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-2"
              >
                <IoClose size={15} /> Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
