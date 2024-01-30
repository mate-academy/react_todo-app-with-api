import React from 'react';
import { TodoApp } from './api/utils/TodoApp';
import { TodosProvider } from './api/utils/TodoContext';

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  );
};
