import React, { useContext } from 'react';
import { AppContext } from './AppContext';
import { LoginForm } from './Components/LoginForm';
import { App } from './App';

export const AuthApp: React.FC = () => {
  const { user } = useContext(AppContext);

  if (user === 0) {
    return (
      <LoginForm />
    );
  }

  return (
    <App />
  );
};
