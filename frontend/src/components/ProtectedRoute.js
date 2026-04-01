import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userData = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  if (!userData || !token) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(userData);

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their default dashboard if role doesn't match
    const defaultPaths = {
      system_admin: '/admin',
      university_admin: '/dashboard',
      student: `/student/${user.username}`
    };
    return <Navigate to={defaultPaths[user.role] || '/'} replace />;
  }

  return (
    <DashboardLayout role={user.role}>
      {children}
    </DashboardLayout>
  );
};

export default ProtectedRoute;
