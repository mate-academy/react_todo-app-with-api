import React from 'react';
import { UserWarning } from './UserWarning';
// eslint-disable-next-line import/no-cycle
import { AppBody } from './components/AppBody';
// eslint-disable-next-line import/no-cycle
import { TodosProvider } from './context/TodosContext';

export const USER_ID = 11224;

export const App: React.FC = () => {
  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <TodosProvider>
      <AppBody />
    </TodosProvider>
  );
};
