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
import HelpCenter from './pages/HelpCenter'; 
import Feedback from './pages/Feedback';
import SLATracker from './pages/SLATracker'; // 1. Import the new page component
import AuditLogs from './pages/AuditLogs';
import Departments from './pages/Departments';
import SystemHealth from './pages/SystemHealth';
function App() {
  return (
    <>
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

        {/* SLA Tracker Route - Added to fix the redirect issue */}
        <Route path="/sla-tracker" element={
          <ProtectedRoute>
            <Layout><SLATracker /></Layout>
          </ProtectedRoute>
        } />

        {/* Shared Utility Modules */}
        <Route path="/help" element={
          <ProtectedRoute>
            <Layout><HelpCenter /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/feedback" element={
          <ProtectedRoute>
            <Layout><Feedback /></Layout>
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

        <Route path="/audit-logs" element={
  <ProtectedRoute allowAdminOnly={true}>
    <Layout><AuditLogs /></Layout>
  </ProtectedRoute>
} />
<Route 
  path="/departments" 
  element={
    <ProtectedRoute allowAdminOnly={true}>
      <Layout>
        <Departments />
      </Layout>
    </ProtectedRoute>
  } 
/>
<Route path="/system-health" element={
  <ProtectedRoute allowAdminOnly={true}>
    <Layout><SystemHealth /></Layout>
  </ProtectedRoute>
} />
        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default App;