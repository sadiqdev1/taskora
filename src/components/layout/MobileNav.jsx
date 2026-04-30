import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  IoHome,
  IoStorefront,
  IoWallet,
  IoPeople,
  IoSettings,
} from 'react-icons/io5';

const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Home',        icon: IoHome       },
    { path: '/tasks',     label: 'Marketplace', icon: IoStorefront },
    { path: '/wallet',    label: 'Wallet',       icon: IoWallet     },
    { path: '/referral',  label: 'Refer',        icon: IoPeople     },
    { path: '/settings',  label: 'Settings',     icon: IoSettings   },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 md:hidden safe-area-bottom">
        <div className="flex h-16 items-center px-2">
          {navItems.map((item) => {
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
        </div>
      </nav>

      <style>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
};

export default MobileNav;
