import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Default redirect: Go to dashboard (which will check auth) or login */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Protected Routes (Everything inside here requires a token) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        {/* If you add Projects/Tasks pages later, put them here! */}
      </Route>
    </Routes>
  );
}

export default App;