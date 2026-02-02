import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Check if the token exists in local storage
  const token = localStorage.getItem('token');

  // 2. If no token, kick them to Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. If token exists, let them see the page
  return <Outlet />;
};

export default ProtectedRoute;