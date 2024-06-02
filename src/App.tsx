/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { TodoApp } from './components/TodoApp';
import { TodoContextProvider } from './components/Todos-Context';

export const App: React.FC = () => {
  return (
    <TodoContextProvider>
      <TodoApp />
    </TodoContextProvider>
  );
};
