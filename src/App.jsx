import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/common/ToastContainer';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';

// Public Pages
import Welcome from './pages/public/Welcome';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages
import Dashboard from './pages/user/Dashboard';
import Tasks from './pages/user/Tasks';
import TaskDetails from './pages/user/TaskDetails';
import MyTasks from './pages/user/MyTasks';
import CreateTask from './pages/user/CreateTask';
import Wallet from './pages/user/Wallet';
import Withdrawal from './pages/user/Withdrawal';
import Deposit from './pages/user/Deposit';
import Transactions from './pages/user/Transactions';
import TransactionDetail from './pages/user/TransactionDetail';
import Notifications from './pages/user/Notifications';
import Settings from './pages/user/Settings';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <ToastContainer />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Welcome />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* All routes are now accessible without login */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AuthenticatedLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/tasks" element={<Tasks />} />
                  <Route path="/tasks/:id" element={<TaskDetails />} />
                  <Route path="/my-tasks" element={<MyTasks />} />
                  <Route path="/create-task" element={<CreateTask />} />
                  <Route path="/wallet" element={<Wallet />} />
                  <Route path="/withdrawal" element={<Withdrawal />} />
                  <Route path="/deposit" element={<Deposit />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/transactions/:id" element={<TransactionDetail />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* Creator Routes */}
                  <Route element={<RoleBasedRoute allowedRoles={['creator', 'admin']} />}>
                    <Route path="/campaigns/create" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Create Campaign - Coming Soon</h2></div>} />
                    <Route path="/campaigns" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">My Campaigns - Coming Soon</h2></div>} />
                  </Route>
                  
                  {/* Admin Routes */}
                  <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Admin Dashboard - Coming Soon</h2></div>} />
                  </Route>
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={<div className="min-h-screen flex items-center justify-center"><h1 className="text-4xl font-bold">404 - Page Not Found</h1></div>} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
