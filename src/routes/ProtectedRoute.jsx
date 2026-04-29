import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // Always authenticated with hardcoded user
  return <Outlet />;
};

export default ProtectedRoute;
