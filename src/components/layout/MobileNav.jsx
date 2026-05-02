import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  IoHome,
  IoStorefront,
  IoWallet,
  IoSettings,
  IoAdd,
} from 'react-icons/io5';
import { motion } from 'framer-motion';

const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Home',        icon: IoHome       },
    { path: '/tasks',     label: 'Marketplace', icon: IoStorefront },
    { path: '/wallet',    label: 'Wallet',      icon: IoWallet     },
    { path: '/settings',  label: 'Settings',    icon: IoSettings   },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Floating Create Task FAB */}
      <div className="fixed bottom-24 right-4 z-50 md:hidden">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Link
            to="/create-task"
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transition-colors"
          >
            <IoAdd size={28} />
          </Link>
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden safe-area-bottom px-3 pb-3">
        <nav className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-lg">
          <div className="flex h-16 items-center justify-around px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-0 flex-1 relative"
                >
                  <Icon
                    size={24}
                    className={`transition-colors ${
                      active
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-zinc-500'
                    }`}
                  />
                  <span className={`text-[11px] font-medium transition-colors truncate ${
                    active
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-zinc-500'
                  }`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <style>{`
        .safe-area-bottom {
          padding-bottom: calc(env(safe-area-inset-bottom) + 0.75rem);
        }
      `}</style>
    </>
  );
};

export default MobileNav;
