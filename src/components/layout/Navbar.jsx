import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { IoNotifications, IoSettings, IoChevronUp, IoLogOut, IoMoon, IoSunny } from 'react-icons/io5';
import taskoraLogo from '../../assets/taskora-logo.svg';

const Navbar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="sticky top-0 z-30 md:relative px-3 pt-3 md:px-0 md:pt-0">
      <header className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-2xl md:rounded-none md:border-0 md:border-b shadow-sm md:shadow-none">
        <div className="mx-auto flex h-14 items-center gap-3 px-4 md:px-6">
          {/* Left: Logo (Mobile only) */}
          <Link to="/dashboard" className="md:hidden flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm">
              <img src={taskoraLogo} alt="Taskora" className="h-5 w-5 object-contain" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">Taskora</span>
          </Link>

          {/* Center: Empty space for balance */}
          <div className="flex-1" />

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative rounded-full p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <IoSunny size={19} /> : <IoMoon size={19} />}
            </button>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative rounded-full p-2 text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white transition"
            >
              <IoNotifications size={19} />
              <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white leading-none">
                2
              </span>
            </Link>

            {/* User Menu - Desktop */}
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                <img
                  src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff'}
                  alt={user?.name}
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-500/20"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-200 max-w-[100px] truncate">
                  {user?.name}
                </span>
                <IoChevronUp
                  size={13}
                  className={`text-gray-400 dark:text-zinc-500 transition-transform ${
                    showUserMenu ? '' : 'rotate-180'
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 py-1.5 shadow-xl z-50">
                  <div className="px-4 py-2.5 border-b border-gray-200 dark:border-zinc-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                  >
                    <IoSettings size={15} className="text-gray-500 dark:text-zinc-500" />
                    <span>Settings</span>
                  </Link>
                  <div className="my-1 border-t border-gray-200 dark:border-zinc-700" />
                  <button
                    onClick={() => {
                      // Add logout logic here
                      setShowUserMenu(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                  >
                    <IoLogOut size={15} />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Avatar - Mobile (no dropdown) */}
            <Link to="/settings" className="md:hidden rounded-full ring-2 ring-transparent hover:ring-blue-200 dark:hover:ring-blue-500/20 transition">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff'}
                alt={user?.name}
                className="h-8 w-8 rounded-full object-cover"
              />
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
