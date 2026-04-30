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
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 md:hidden safe-area-bottom">
        <div className="flex h-16 items-center px-2">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all active:scale-95"
              >
                <div className={`relative p-2 rounded-xl transition-all duration-200 ${
                  active 
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/30' 
                    : 'hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}>
                  <Icon
                    size={22}
                    className={`transition-colors duration-200 ${
                      active ? 'text-white' : 'text-gray-500 dark:text-zinc-400'
                    }`}
                  />
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                  )}
                </div>
                <span className={`text-[10px] font-medium transition-colors duration-200 ${
                  active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-zinc-400'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* More Button */}
          <button
            onClick={() => setMoreOpen(true)}
            className="group flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all active:scale-95"
          >
            <div className={`relative p-2 rounded-xl transition-all duration-200 ${
              hasActiveMore 
                ? 'bg-blue-500 shadow-lg shadow-blue-500/30' 
                : 'hover:bg-gray-100 dark:hover:bg-zinc-800'
            }`}>
              <IoEllipsisHorizontal
                size={22}
                className={`transition-colors duration-200 ${
                  hasActiveMore ? 'text-white' : 'text-gray-500 dark:text-zinc-400'
                }`}
              />
              {hasActiveMore && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
              )}
            </div>
            <span className={`text-[10px] font-medium transition-colors duration-200 ${
              hasActiveMore ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-zinc-400'
            }`}>
              More
            </span>
          </button>
        </div>
      </nav>

      {/* More Menu Modal */}
      {moreOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end md:hidden" 
          onClick={() => setMoreOpen(false)}
          style={{ animation: 'fadeIn .2s ease' }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative w-full bg-white dark:bg-zinc-900 rounded-t-3xl shadow-2xl border-t border-gray-200 dark:border-zinc-800"
            style={{ animation: 'slideUp .3s cubic-bezier(.22,.61,.36,1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-700" />
            </div>

            {/* Menu Title */}
            <div className="px-6 py-3 border-b border-gray-100 dark:border-zinc-800">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">More Options</h3>
            </div>

            {/* Menu Items */}
            <div className="px-4 py-4 space-y-1 max-h-[60vh] overflow-y-auto">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-medium transition-all active:scale-98 ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800 active:bg-gray-100 dark:active:bg-zinc-700'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      active 
                        ? 'bg-blue-100 dark:bg-blue-500/20' 
                        : 'bg-gray-100 dark:bg-zinc-800'
                    }`}>
                      <Icon 
                        size={20} 
                        className={active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-zinc-400'} 
                      />
                    </div>
                    <span className="flex-1">{item.label}</span>
                    {active && (
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Close Button */}
            <div className="px-4 py-4 border-t border-gray-100 dark:border-zinc-800 pb-safe">
              <button
                onClick={() => setMoreOpen(false)}
                className="w-full py-3.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <IoClose size={18} />
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(100%); 
          }
          to { 
            opacity: 1;
            transform: translateY(0); 
          }
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
        .pb-safe {
          padding-bottom: calc(1rem + env(safe-area-inset-bottom));
        }
      `}</style>
    </>
  );
};

export default MobileNav;
