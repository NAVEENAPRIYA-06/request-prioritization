import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Page Imports - Double check these filenames match exactly!
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewRequest from './pages/NewRequest';
import MyRequests from './pages/MyRequests';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import ResolvedArchive from './pages/ResolvedArchive';
function App() {
  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/new-request" element={<ProtectedRoute><NewRequest /></ProtectedRoute>} />
        <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />

        {/* Admin Specific */}
        <Route path="/admin-panel" element={
          <ProtectedRoute allowAdminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        {/* Fallback to Login if path doesn't exist */}
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/archives" element={
  <ProtectedRoute allowAdminOnly={true}>
    <ResolvedArchive />
  </ProtectedRoute>
} />
      </Routes>
    </div>
  );
}

export default App;