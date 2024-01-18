import React from 'react';

import { TodoProvider } from './components/context/TodosContext';
import { TodoApp } from './components/TodoApp/TodoApp';

export const App: React.FC = () => (
  <TodoProvider>
    <TodoApp />
  </TodoProvider>
);
