/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect } from 'react';
import { getTodos } from './api/todos';
import { ErrorMessage } from './components/ErrorMessage';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodosContext, USER_ID } from './TodoProvider';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
  } = useContext(TodosContext);

  useEffect(() => {
    if (errorMessage) {
      const timeoutId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    return () => {};
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage('');
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Failed to load list of todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <TodoHeader />
        <TodoList />
        {todos.length && <TodoFooter />}
        {errorMessage && <ErrorMessage />}
      </div>
    </div>
  );
};
