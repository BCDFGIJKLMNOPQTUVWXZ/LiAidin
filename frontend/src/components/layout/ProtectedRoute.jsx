import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userRole, loading } = useAuth();

  if (loading) return null; // or a spinner

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
