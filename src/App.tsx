import React from 'react';
import { TodoApp } from './components/TodoApp/TodoApp';
// eslint-disable-next-line max-len
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import { useErrorReset } from './hooks/useErrorReset';

export const App: React.FC = () => {
  const { currentError, setCurrentError } = useErrorReset();

  return (
    <>
      <ErrorNotification
        currentError={currentError}
        handleHideError={() => setCurrentError('')}
      />
      <TodoApp setCurrentError={setCurrentError} />;
    </>
  );
};
