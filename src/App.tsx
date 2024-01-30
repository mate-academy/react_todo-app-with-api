/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { UserWarning } from './UserWarning';

import { ContextProvider } from './Components/ContextProvider';
import { TodoApp } from './Components/TodoApp';

import { Context } from './Context';

export const App: React.FC = () => {
  const { USER_ID } = useContext(Context);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <ContextProvider>
      <TodoApp />
    </ContextProvider>
  );
};
