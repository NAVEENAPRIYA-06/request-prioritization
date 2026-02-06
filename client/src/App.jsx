import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewRequest from './pages/NewRequest';
import MyRequests from './pages/MyRequests';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <Routes>
      {/* 1. Root path redirects to Login by default */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* 2. Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 3. Main Dashboard Home */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* 4. Employee Features */}
      <Route path="/new-request" element={<NewRequest />} />
      <Route path="/my-requests" element={<MyRequests />} />

      {/* 5. Admin Features */}
      <Route path="/admin-panel" element={<AdminPanel />} />

      {/* 6. Catch-all: Redirect unknown paths back to Dashboard/Login */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;