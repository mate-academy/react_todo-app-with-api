import React from 'react';
import { UserTodoList } from './components/UserTodoList';
import { StateProvider } from './components/StateProvider';

export const App: React.FC = () => {
  return (
    <StateProvider>
      <UserTodoList />
    </StateProvider>
  );
};
