import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewRequest from './pages/NewRequest';
import MyRequests from './pages/MyRequests';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile'; // New Import

// Import Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Secured General Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Secured Employee Only Routes */}
        <Route path="/new-request" element={
          <ProtectedRoute>
            <NewRequest />
          </ProtectedRoute>
        } />
        <Route path="/my-requests" element={
          <ProtectedRoute>
            <MyRequests />
          </ProtectedRoute>
        } />

        {/* Secured Admin Only Route */}
        <Route path="/admin-panel" element={
          <ProtectedRoute allowAdminOnly={true}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;