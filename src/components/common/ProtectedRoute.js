import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole } = useAuth();

  console.log('Protected Route Check:', {
    currentUser: currentUser?.email,
    userRole,
    allowedRoles
  });

  if (!currentUser) {
    // Not logged in
    console.log('Access denied: User not logged in');
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    // User's role is not authorized
    console.log('Access denied: Role not authorized', {
      userRole,
      allowedRoles
    });
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;