/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoApp } from './components/TodoApp/TodoApp';
import { USER_ID } from './constants/constants';

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return <TodoApp />;
};
