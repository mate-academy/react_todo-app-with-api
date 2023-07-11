/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { TodoContent } from './components/TodoContent';
import { Notifications } from './components/Notifications';
import { todosApi } from './api/todos-api';
import { useTodoContext } from './context/todoContext/useTodoContext';
import { useErrorContext } from './context/errorContext/useErrorContext';

const USER_ID = 10875;

export const App: React.FC = () => {
  const { setTodos } = useTodoContext();
  const { errorMessage, notifyAboutError } = useErrorContext();

  useEffect(() => {
    todosApi.getByUser(USER_ID)
      .then(setTodos)
      .catch(() => {
        notifyAboutError('Unable to load todos');
      });
  }, []);

  const closeNotification = () => {
    notifyAboutError('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <TodoContent />
      {errorMessage && (
        <Notifications
          onClose={closeNotification}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};
