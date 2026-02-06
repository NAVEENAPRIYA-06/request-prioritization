import ProtectedRoute from './components/ProtectedRoute';

// Update your Routes inside the return statement:
<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  {/* Secured Routes */}
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } />

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

  {/* Admin Only Route */}
  <Route path="/admin-panel" element={
    <ProtectedRoute allowAdminOnly={true}>
      <AdminPanel />
    </ProtectedRoute>
  } />

  <Route path="*" element={<Navigate to="/login" />} />
</Routes>