import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { UserTodos } from './components/UserTodos/UserTodos';
import { TodoError } from './components/TodoError/TodoError';
import { wait } from './utils/fetchClient';

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  wait(3000).then(() => setErrorMessage(''));

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <UserTodos userId={USER_ID} onError={setErrorMessage} />

      <TodoError
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
