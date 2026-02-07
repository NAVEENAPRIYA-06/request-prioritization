import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout & Security
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewRequest from './pages/NewRequest';
import MyRequests from './pages/MyRequests';
import AdminPanel from './pages/AdminPanel';
import ResolvedArchive from './pages/ResolvedArchive';
import Analytics from './pages/Analytics';
import UserDirectory from './pages/UserDirectory';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

function App() {
  return (
    <>
      {/* Global Notification System */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '20px',
            background: '#1e293b',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 'bold',
            padding: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          },
        }} 
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Protected Routes Wrapped in Layout 
            The Layout component provides the persistent Sidebar on the left.
        */}

        {/* Shared Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />

        {/* Employee Specific Modules */}
        <Route path="/new-request" element={
          <ProtectedRoute>
            <Layout><NewRequest /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/my-requests" element={
          <ProtectedRoute>
            <Layout><MyRequests /></Layout>
          </ProtectedRoute>
        } />

        {/* Admin Specific Modules */}
        <Route path="/admin-panel" element={
          <ProtectedRoute allowAdminOnly={true}>
            <Layout><AdminPanel /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute allowAdminOnly={true}>
            <Layout><UserDirectory /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute allowAdminOnly={true}>
            <Layout><Analytics /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/archives" element={
          <ProtectedRoute allowAdminOnly={true}>
            <Layout><ResolvedArchive /></Layout>
          </ProtectedRoute>
        } />

        {/* Shared Utility Modules */}
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout><Settings /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/notifications" element={
  <ProtectedRoute>
    <Layout><Notifications /></Layout>
  </ProtectedRoute>
} />

        <Route path="/users" element={
  <ProtectedRoute allowAdminOnly={true}>
    <Layout><UserDirectory /></Layout>
  </ProtectedRoute>
} />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App;