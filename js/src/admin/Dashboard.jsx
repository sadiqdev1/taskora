import React, { useState, useEffect, useRef } from 'react';
import { Flame } from 'lucide-react';
import { usePage } from '@inertiajs/react';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import ActivityChart from './components/ActivityChart';
import RecentActivity from './components/RecentActivity';
import DataTable from './components/DataTable';

import MemesManager from './tabs/MemesManager';
import UsersManager from './tabs/UsersManager';
import TrendingView from './tabs/TrendingView';
import ReportsManager from './tabs/ReportsManager';
import NotificationsView from './tabs/NotificationsView';
import SettingsView from './tabs/SettingsView';
import HelpView from './tabs/HelpView';
import FeedbackView from './tabs/FeedbackView';
import GlobalLoader from './components/GlobalLoader';

import './Dashboard.css';

const DashboardHome = () => {
  const { auth } = usePage().props;
  const user = auth?.user;
  
  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          Welcome back, {user?.name || 'Admin'} <Flame className="text-orange-500" size={20} />
        </h1>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-0.5">Here's what's happening on your platform today.</p>
      </div>
      <StatsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <ActivityChart />
        <RecentActivity />
      </div>
      <DataTable />
    </>
  );
};

const tabs = {
  dashboard: DashboardHome,
  memes: MemesManager,
  users: UsersManager,
  trending: TrendingView,
  reports: ReportsManager,
  notifications: NotificationsView,
  settings: SettingsView,
  help: HelpView,
  feedback: FeedbackView,
};

const Dashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const dropdownRef = useRef(null);

  const changeTab = (tab) => {
    if (tab === activeTab) return;
    setLoading(true);
    closeMobileMenu();
    setGlobalSearch(''); // Clear search when changing tabs
    setTimeout(() => { setActiveTab(tab); setLoading(false); }, 400);
  };

  const handleGlobalSearch = (query) => {
    setGlobalSearch(query);
    // If on dashboard, switch to appropriate tab based on search
    if (activeTab === 'dashboard' && query.trim()) {
      // Default to users tab for search
      setActiveTab('users');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((p) => !p);
    document.body.classList.toggle('overflow-hidden');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.classList.remove('overflow-hidden');
  };

  const toggleProfileDropdown = (e) => { e.stopPropagation(); setProfileDropdownOpen((p) => !p); };

  useEffect(() => {
    const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setProfileDropdownOpen(false); };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  useEffect(() => {
    const h = () => { if (window.innerWidth >= 768) { setMobileMenuOpen(false); document.body.classList.remove('overflow-hidden'); } };
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);

  const ActiveTab = tabs[activeTab] || DashboardHome;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMobileMenu} />}

      <Sidebar mobileMenuOpen={mobileMenuOpen} closeMobileMenu={closeMobileMenu} activeTab={activeTab} setActiveTab={changeTab} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Header
          toggleMobileMenu={toggleMobileMenu}
          profileDropdownOpen={profileDropdownOpen}
          toggleProfileDropdown={toggleProfileDropdown}
          dropdownRef={dropdownRef}
          tab={activeTab}
          onSearch={handleGlobalSearch}
        />
        <main className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {loading ? <GlobalLoader tab={activeTab} /> : <ActiveTab searchQuery={globalSearch} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
