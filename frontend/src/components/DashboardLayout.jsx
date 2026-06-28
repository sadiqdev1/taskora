'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Loader from './Loader';

export default function DashboardLayout({ children, title, subtitle, adminOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // collapsed = icon-rail mode on desktop
  // mobileOpen = drawer open on mobile
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    if (!loading && user && adminOnly && user.role !== 'admin') router.replace('/dashboard');
  }, [user, loading, router, adminOnly]);

  if (loading || !user) return <Loader fullscreen />;

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onMenuClick={() => setMobileOpen(true)}
          onToggleCollapse={() => setCollapsed(c => !c)}
          collapsed={collapsed}
          title={title}
          subtitle={subtitle}
        />
        <main className="flex-1 overflow-y-auto p-5 md:p-6 page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
