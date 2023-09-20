import React from 'react';
import { UserTodoList } from './api/components/UserTodoList';
import { GlobalStateProvider } from './api/components/GlobalStateProvider';

export const App: React.FC = () => {
  return (
    <GlobalStateProvider>
      <UserTodoList />
    </GlobalStateProvider>
  );
};
