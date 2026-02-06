import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowAdminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. If no user is logged in, send them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If the route is for Admin Only, but the user is an employee, send to dashboard
  if (allowAdminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Otherwise, show the page
  return children;
};

export default ProtectedRoute;