import React from 'react';
import { TodoApp } from './components/TodoApp';
import { UserWarning } from './components/UserWarning/UserWarning';
import { USER_ID } from './types/constants';

export const App: React.FC = () => {
  return (
    USER_ID
      ? <TodoApp />
      : <UserWarning />
  );
};
