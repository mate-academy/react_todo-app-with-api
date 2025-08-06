/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { ToDoHeader } from './components/ToDoHeader';
import { ToDoList } from './components/ToDoList';
import { ToDoFooter } from './components/ToDoFooter';
import { getTodos } from './api/todos';
import { DispatchContext, StateContext } from './components/StateContext';
import { ErrorNotification } from './components/ErrorNotification';
import { EnumedError } from './types/EnumedError';

const USER_ID = 1008;

export const App: React.FC = () => {
  const dispatch = useContext(DispatchContext);
  const { errorMessage } = useContext(StateContext);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        dispatch({
          type: 'GET_TODOS',
          todos: todosFromServer,
        });
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR',
          message: EnumedError.LoadError,
        });
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        dispatch({ type: 'SHOW_ERROR', message: '' });
      }, 3000);

      return () => clearTimeout(timeoutId);
    }

    return;
  }, [dispatch, errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <>
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <ToDoHeader />
        <ToDoList />
        <ToDoFooter />
      </div>
      <ErrorNotification />
    </>
  );
};
