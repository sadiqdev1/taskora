import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import MobileNav from '../components/layout/MobileNav';

const AuthenticatedLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 text-gray-900 dark:text-white">
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Desktop Sidebar Only */}
        <Sidebar />
        
        <div className="flex min-h-screen flex-1 flex-col md:ml-64">
          <Navbar />
          
          <main className="flex-1 px-3 pb-24 pt-5 md:px-6 md:pb-10">
            <div className="mx-auto w-full max-w-6xl">
              <Outlet />
            </div>
          </main>

          {/* Mobile Bottom Nav Only */}
          <MobileNav />
        </div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
