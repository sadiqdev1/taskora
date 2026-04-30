import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  IoHome,
  IoList,
  IoCheckmarkDone,
  IoBriefcase,
  IoWallet,
  IoSwapHorizontal,
  IoNotifications,
  IoSettings,
  IoAdd,
  IoGrid,
} from 'react-icons/io5';
import taskoraLogo from '../../assets/taskora-logo.svg';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <IoHome />, roles: ['user', 'creator', 'admin'] },
    { path: '/tasks', label: 'Marketplace', icon: <IoList />, roles: ['user', 'creator', 'admin'] },
    { path: '/my-tasks', label: 'My Tasks', icon: <IoCheckmarkDone />, roles: ['user'] },
    { path: '/wallet', label: 'Wallet', icon: <IoWallet />, roles: ['user', 'creator', 'admin'] },
    { path: '/transactions', label: 'Transactions', icon: <IoSwapHorizontal />, roles: ['user', 'creator', 'admin'] },
    { path: '/notifications', label: 'Notifications', icon: <IoNotifications />, roles: ['user', 'creator', 'admin'] },
    { path: '/settings', label: 'Settings', icon: <IoSettings />, roles: ['user', 'creator', 'admin'] },
  ];

  // Add creator items
  if (user?.role === 'creator' || user?.role === 'admin') {
    menuItems.splice(3, 0, 
      { path: '/campaigns/create', label: 'Create Campaign', icon: <IoAdd />, roles: ['creator', 'admin'] },
      { path: '/campaigns', label: 'My Campaigns', icon: <IoBriefcase />, roles: ['creator', 'admin'] }
    );
  }

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-20 bg-white dark:bg-zinc-900 border-r border-gray-100 dark:border-zinc-800">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100 dark:border-zinc-800">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <img src={taskoraLogo} alt="Taskora" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">Taskora</h1>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500 leading-none mt-0.5">Task platform</p>
            </div>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {filteredMenuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-r-full before:bg-blue-500'
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className={`text-[17px] flex-shrink-0 transition-colors ${
                  active ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300'
                }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Admin Panel - Separate Section */}
          {(user?.role === 'admin' || user?.role === 'moderator') && (
            <>
              <div className="my-2 border-t border-gray-100 dark:border-zinc-800" />
              <Link
                to="/admin"
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-r-full before:bg-blue-500'
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className={`text-[17px] flex-shrink-0 transition-colors ${
                  location.pathname.startsWith('/admin') ? 'text-blue-500' : 'text-gray-400 dark:text-zinc-500 group-hover:text-gray-600 dark:group-hover:text-zinc-300'
                }`}>
                  <IoGrid />
                </span>
                <span>Admin Panel</span>
              </Link>
            </>
          )}
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-100 dark:border-zinc-800 p-3">
          <div className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-500/20 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800 dark:text-zinc-100">
                {user?.name}
              </p>
              <p className="truncate text-xs text-gray-400 dark:text-zinc-500">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
