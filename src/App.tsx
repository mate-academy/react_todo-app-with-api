/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { DataContextProvider, TodosProvider } from './TodosContext';
import { TodoApp } from './components/TodoApp';

export const App: React.FC = () => (
  <DataContextProvider>
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  </DataContextProvider>
);
