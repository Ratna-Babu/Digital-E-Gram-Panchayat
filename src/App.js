import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './components/landing/LandingPage';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Protected Components
import UserDashboard from './components/user/UserDashboard';
import ServiceApplication from './components/user/ServiceApplication';
import UserApplicationManagement from './components/user/ApplicationStatus';

import StaffDashboard from './components/staff/StaffDashboard';
import ApplicationManagement from './components/staff/ApplicationManagement';
import ReviewApplications from './components/staff/ReviewApplications';

import AdminDashboard from './components/admin/AdminDashboard';
import ServiceManagement from './components/admin/ServiceManagement';
import UserManagement from './components/admin/UserManagement';
import DatabaseSetup from './components/admin/DatabaseSetup';
import AdminApplicationManagement from './components/admin/ApplicationManagement';

// Common Components
import ProtectedRoute from './components/common/ProtectedRoute';
import Unauthorized from './components/common/Unauthorized';

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/" element={<Navigate to="/login" />} />

            {/* User Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/apply"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <ServiceApplication />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/applications"
              element={
                <ProtectedRoute allowedRoles={['user']}>
                  <UserApplicationManagement />
                </ProtectedRoute>
              }
            />

            {/* Staff Routes */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/dashboard"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/applications"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <ApplicationManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff/review-applications"
              element={
                <ProtectedRoute allowedRoles={['staff']}>
                  <ReviewApplications />
                </ProtectedRoute>
              }
            />

            {/* Admin/Officer Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin', 'officer']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'officer']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute allowedRoles={['admin', 'officer']}>
                  <ServiceManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['admin', 'officer']}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/database-setup"
              element={
                <ProtectedRoute allowedRoles={['admin', 'officer']}>
                  <DatabaseSetup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <ProtectedRoute allowedRoles={['admin', 'officer']}>
                  <AdminApplicationManagement />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
