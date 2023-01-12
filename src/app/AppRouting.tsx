import { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../pages/Auth';
import Todos from '../pages/Todos';
import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';

const AppRouting:FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={(
          <PrivateRoute>
            <Todos />
          </PrivateRoute>
        )}
      />
      <Route
        path="/login"
        element={(
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        )}
      />

      <Route
        path="*"
        element={<Navigate to="/" />}
      />
    </Routes>
  );
};

export default AppRouting;
