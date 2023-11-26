/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

import { TodoApp } from './components/TodoApp';
import { TodoProvider } from './TodoContext';

export const App: React.FC = () => (
  <TodoProvider>
    <TodoApp />
  </TodoProvider>
);
