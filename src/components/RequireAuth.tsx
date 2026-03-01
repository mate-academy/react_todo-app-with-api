import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

export const RequireAuth: React.FC = () => {
  const location = useLocation();

  const isAuthenticated = Boolean(localStorage.getItem('accessToken'));

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
