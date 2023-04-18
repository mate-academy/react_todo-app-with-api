import React, { useCallback, useContext, useEffect } from 'react';
import { UserWarning } from './components/UserWarning';
import { getTodos } from './api/todos';
import { AppTodoContext } from './contexts/AppTodoContext';
import { NewTodoForm } from './components/NewTodoForm/NewTodoForm';
import { TodoAppError } from './components/Error/TodoAppError';
import { ErrorType } from './components/Error/Error.types';
import { USER_ID } from './react-app-env';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFilter } from './components/TodoFilter/TodoFilter';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    uncompletedTodos,
    setVisibleTodos,
  } = useContext(AppTodoContext);

  const getAllTodos = useCallback(async () => {
    try {
      const allTodos = await getTodos(USER_ID);

      setTodos(allTodos);
      setVisibleTodos(allTodos);
    } catch {
      setErrorMessage(ErrorType.GetAllTodosError);
    }
  }, []);

  useEffect(() => {
    getAllTodos();
  }, []);

  useEffect(() => {
    let timerID: NodeJS.Timeout;

    if (errorMessage !== ErrorType.NoError) {
      timerID = setTimeout(() => {
        setErrorMessage(ErrorType.NoError);
      }, 3000);
    }

    return () => {
      clearTimeout(timerID);
    };
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          <NewTodoForm />

        </header>

        {todos.length !== 0 && <TodoList />}

      </div>

      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${uncompletedTodos.length} items left`}
        </span>

        <TodoFilter />
      </footer>

      {errorMessage !== ErrorType.NoError && <TodoAppError />}
    </div>
  );
};
