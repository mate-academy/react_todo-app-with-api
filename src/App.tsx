import React from 'react';
import { TodoApp } from './TodoApp';
import { TodosProvider } from './TodoContext';

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  );
};
