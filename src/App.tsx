import React from 'react';
import { UserWarning } from './components/UserWarning';
import { TodoApp } from './components/TodoApp';

const USER_ID = 'https://mate.academy/users/91';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodoApp />
  );
};
