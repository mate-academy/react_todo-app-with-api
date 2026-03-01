import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainHeader } from './components/MainHeader';
import { RegistrationPage } from './Pages/RegistrationPage';
import { LoginPage } from './Pages/LoginPage';
import { RequireAuth } from './components/RequireAuth';
import { TodoPage } from './Pages/TodoPage';
import { HomePage } from './Pages/HomePage';

export const App: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null);

  return (
    <>
      <MainHeader />
      <main className="section">
        <div className="container">
          {error && <p className="notification is-danger is-light">{error}</p>}

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="registration" element={<RegistrationPage />} />
            <Route path="login" element={<LoginPage />} />

            <Route element={<RequireAuth />}>
              <Route path="todos" element={<TodoPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </>
  );
};
