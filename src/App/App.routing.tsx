import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
// Selectors
import { selectIsAuthorization } from 'store/auth/authSelectors';
import { selectCurrentUser } from 'store/users/usersSelectors';
// Modeels
import IUser from 'models/User';
// Components
import PublicRoute from 'components/PublicRoute';
import PrivateRoute from 'components/PrivateRoute';
// Pages
import AuthPage from 'pages/AuthPage';
import TodosPage from 'pages/Todos';

const AppRouting:React.FC = () => {
  const isAuthorization: boolean | null = useSelector(selectIsAuthorization);
  const currentUser: IUser | null = useSelector(selectCurrentUser);
  const navigateTo = isAuthorization && currentUser ? '/todos' : '/sign-in';

  return (
    <Routes>
      <Route
        path="/sign-in"
        element={(
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        )}
      />

      <Route
        path="/todos"
        element={(
          <PrivateRoute>
            <TodosPage />
          </PrivateRoute>
        )}
      />

      <Route path="*" element={<Navigate to={navigateTo} />} />
    </Routes>
  );
};

export default AppRouting;
