import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowAdminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // If no user is logged in, send them to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If the page is for admins only and user is an employee, send to dashboard
  if (allowAdminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;