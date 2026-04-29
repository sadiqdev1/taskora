import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Home, Flame, PlusCircle, User, Settings,
  Search, Bell, LogOut, ChevronUp,
} from 'lucide-react';
import chortleLogo from '../../assets/chortle-logo.svg';
import ScrollToTop from './ScrollToTop';
import ConfirmDialog from '../components/ConfirmDialog';
import VerifiedBadge from '../../../components/VerifiedBadge';

const mockNotifications = [
  { id: 1, read: false },
  { id: 2, read: false },
  { id: 3, read: true },
];

const user = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=f97316&color=fff&length=2&size=40',
};

const Layout = () => {
  const navigate = useNavigate();
  const isLoggedIn = true;

  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const unreadCount = useMemo(() => mockNotifications.filter((n) => !n.read).length, []);

  const handleLogout = () => {
    setDesktopMenuOpen(false);
    setMobileMenuOpen(false);
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/trending', label: 'Trending', icon: Flame },
    { path: '/upload', label: 'Upload', icon: PlusCircle },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const mobileNavItems = navItems.slice(0, 4);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target)) setDesktopMenuOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) setMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const navLinkClass = ({ isActive }) =>
    [
      'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
      isActive
        ? 'bg-orange-50 text-orange-600 before:absolute before:left-0 before:top-1/2 before:h-5 before:w-0.5 before:-translate-y-1/2 before:rounded-r-full before:bg-orange-500'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
    ].join(' ');

  const mobileNavLinkClass = ({ isActive }) =>
    ['group flex flex-col items-center justify-center flex-1 h-full text-xs font-medium transition-all active:scale-95',
      isActive ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'].join(' ');

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900">
      <div className="flex min-h-screen flex-col md:flex-row">

        {/* Desktop Sidebar */}
        <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r border-gray-100 bg-white">
          <div className="flex h-full flex-col">

            {/* Brand */}
            <div className="px-5 py-5 border-b border-gray-100">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <img src={chortleLogo} alt="Chortle" className="h-6 w-6 object-contain" />
                </div>
                <div>
                  <h1 className="text-base font-bold tracking-tight text-gray-900">Chortle</h1>
                  <p className="text-[11px] text-gray-400 leading-none mt-0.5">Meme community</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5">
              {navItems.map(({ path, label, icon: Icon }) => (
                <NavLink key={path} to={path} end={path === '/'} className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      <Icon size={17} className={`flex-shrink-0 transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
                      <span>{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Desktop User */}
            <div className="border-t border-gray-100 p-3 relative" ref={desktopMenuRef}>
              <button
                onClick={() => setDesktopMenuOpen((prev) => !prev)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-gray-50"
              >
                <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-orange-100 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-gray-800">{user.name}</p>
                    {user.is_verified && <VerifiedBadge size={12} />}
                  </div>
                  <p className="truncate text-xs text-gray-400">{user.email}</p>
                </div>
                <ChevronUp size={14} className={`text-gray-400 transition-transform flex-shrink-0 ${desktopMenuOpen ? '' : 'rotate-180'}`} />
              </button>

              {desktopMenuOpen && (
                <div className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl z-50">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors rounded-lg mx-auto"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Section */}
        <div className="flex min-h-screen flex-1 flex-col md:ml-64">

          {/* Header */}
          <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">

              {/* Mobile Logo */}
              <Link to="/" className="md:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <img src={chortleLogo} alt="Chortle" className="h-5 w-5 object-contain" />
                </div>
                <span className="font-bold text-gray-900 text-sm">Chortle</span>
              </Link>

              {/* Desktop Search */}
              <div className="hidden flex-1 md:flex md:max-w-sm md:items-center">
                <div className="relative w-full">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search memes, users..."
                    className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-1.5">
                <Link to="/search" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition md:hidden">
                  <Search size={19} />
                </Link>

                <Link to="/notifications" className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition">
                  <Bell size={19} />
                  {unreadCount > 0 && (
                    <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-bold text-white leading-none">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {isLoggedIn && (
                  <div className="relative md:hidden" ref={mobileMenuRef}>
                    <button onClick={() => setMobileMenuOpen((prev) => !prev)} className="rounded-full ring-2 ring-transparent hover:ring-orange-200 transition">
                      <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                    </button>

                    {mobileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl z-50">
                        <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <User size={15} className="text-gray-400" /> Profile
                        </Link>
                        <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                          <Settings size={15} className="text-gray-400" /> Settings
                        </Link>
                        <div className="my-1 border-t border-gray-100" />
                        <button onClick={() => setShowLogoutConfirm(true)} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition">
                          <LogOut size={15} /> Sign out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 px-3 pb-24 pt-5 md:px-6 md:pb-10">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>

          {/* Mobile Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-md md:hidden">
            <div className="flex h-16 items-center">
              {mobileNavItems.map(({ path, label, icon: Icon }) => (
                <NavLink key={path} to={path} end={path === '/'} className={mobileNavLinkClass}>
                  {({ isActive }) => (
                    <>
                      <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-orange-50' : ''}`}>
                        <Icon size={19} className={`transition-colors ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
                      </div>
                      <span className="mt-0.5 text-[10px]">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          <ScrollToTop />

          <footer className="hidden border-t border-gray-100 bg-white py-4 px-6 text-xs text-gray-400 md:flex items-center justify-between">
            <span>&copy; {new Date().getFullYear()} Chortle · All rights reserved</span>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="text-gray-500 hover:text-orange-500 transition-colors font-medium"
            >
              Logout
            </button>
          </footer>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign out"
        message="Are you sure you want to sign out of your account?"
        confirmText="Sign out"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Layout;
