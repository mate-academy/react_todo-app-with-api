/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { GlobalContextProvider } from './components/GlobalContextProvider';
import { TodoApp } from './components/TodoApp';

export const App: React.FC = () => {
  return (
    <GlobalContextProvider>
      <TodoApp />
    </GlobalContextProvider>
  );
};
