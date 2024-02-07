import React from 'react';
import { UserWarning } from './components/UserWarning';
import { TodoApp } from './components/TodoApp';
import { USER_ID } from './constants/USER_ID';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoApp />
  );
};
