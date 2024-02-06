import React from 'react';
import { TodoApp } from './utils/TodoApp';
import { TodosProvider } from './utils/TodoContext/TodoContext';

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  );
};
