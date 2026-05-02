import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  IoHome,
  IoClipboard,
  IoWallet,
  IoPersonCircle,
  IoLogOut,
  IoAdd,
  IoGrid,
  IoChevronDown,
} from 'react-icons/io5';
import taskoraLogo from '../../assets/taskora-logo.svg';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard',  label: 'Dashboard',      icon: <IoHome size={18} /> },
    { path: '/my-tasks',   label: 'My Tasks',        icon: <IoClipboard size={18} /> },
    { path: '/wallet',     label: 'Deposit',         icon: <IoWallet size={18} /> },
    { path: '/settings',   label: 'Account',         icon: <IoPersonCircle size={18} /> },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col z-20 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800">
      <div className="flex flex-col h-full">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-200 dark:border-zinc-800">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <img src={taskoraLogo} alt="Taskora" className="h-6 w-6 object-contain" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-gray-900 dark:text-white">Taskora</h1>
              <p className="text-[11px] text-gray-500 dark:text-zinc-500 leading-none mt-0.5">Earning platform</p>
            </div>
          </Link>
        </div>

        {/* Section label */}
        <div className="px-5 pt-5 pb-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-600">
            Main menu
          </p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-r-full before:bg-blue-500'
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className={`flex-shrink-0 transition-colors ${
                  active ? 'text-blue-500' : 'text-gray-500 dark:text-zinc-500 group-hover:text-gray-700 dark:group-hover:text-zinc-300'
                }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Admin Panel */}
          {(user?.role === 'admin' || user?.role === 'moderator') && (
            <>
              <div className="my-2 border-t border-gray-200 dark:border-zinc-800" />
              <Link
                to="/admin"
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <IoGrid size={18} className="flex-shrink-0" />
                <span>Admin Panel</span>
              </Link>
            </>
          )}
        </nav>

        {/* Bottom: User info + Logout */}
        <div className="border-t border-gray-200 dark:border-zinc-800 p-3 space-y-1">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <IoLogOut size={18} className="flex-shrink-0" />
            <span>Logout</span>
          </button>

          {/* User row */}
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-500/20 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-gray-900 dark:text-zinc-100">
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
