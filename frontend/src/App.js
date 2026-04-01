import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CertificateVerification from './pages/CertificateVerification';
import IssueCertificate from './pages/IssueCertificate';
import StudentPortal from './pages/StudentPortal';
import AdminDashboard from './pages/AdminDashboard';
import ChangePassword from './pages/ChangePassword';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Portal Pages
import UniversityAccounts from './pages/admin/UniversityAccounts';
import StudentAccounts from './pages/admin/StudentAccounts';
import AnomalyDashboard from './pages/admin/AnomalyDashboard';

// University Portal Pages
import IssuanceHistory from './pages/university/IssuanceHistory';

// Import styles
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-on-surface">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/verify" element={<CertificateVerification />} />
          <Route path="/verify/:id" element={<CertificateVerification />} />
          
          {/* Protected Routes - Shared */}
          <Route 
            path="/change-password" 
            element={
              <ProtectedRoute allowedRoles={['university_admin', 'student', 'system_admin']}>
                <ChangePassword />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - University Admin */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['university_admin']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/issue" 
            element={
              <ProtectedRoute allowedRoles={['university_admin']}>
                <IssueCertificate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute allowedRoles={['university_admin']}>
                <IssuanceHistory />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - System Admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['system_admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/universities" 
            element={
              <ProtectedRoute allowedRoles={['system_admin']}>
                <UniversityAccounts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/students" 
            element={
              <ProtectedRoute allowedRoles={['system_admin']}>
                <StudentAccounts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/anomalies" 
            element={
              <ProtectedRoute allowedRoles={['system_admin']}>
                <AnomalyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <ProtectedRoute allowedRoles={['system_admin']}>
                <Register />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Student */}
          <Route 
            path="/student/:id" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentPortal />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#0f1c2c',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              fontSize: '10px',
              letterSpacing: '0.15em'
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
