import React from 'react';
import { UserWarning } from './UserWarning';
// eslint-disable-next-line max-len
import { TodosProvider } from './providers/TodosContext';
import { TodoApp } from './components/TodoApp/TodoApp';

const USER_ID = 11547;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  );
};
