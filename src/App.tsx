import React, { useContext, useEffect, useMemo } from 'react';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Notifications } from './components/Errors';
import { getTodos } from './api/todos';
import { filterTodo } from './helpers/filterTodo';
import { UserWarning } from './UserWarning';
import { ErrorType } from './types/Errors';
import { USER_ID } from './utils/userId';
import { AppContext } from './AppContext';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    filterBy,
    shouError,
  } = useContext(AppContext);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => shouError(ErrorType.UnableToLoadTodo));
  }, [shouError, setTodos]);

  const preparedTodos = useMemo(
    () => filterTodo(todos, filterBy),
    [todos, filterBy],
  );

  const isEveryTodosCompleted = preparedTodos.every(
    todo => todo.completed,
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header isEveryTodosCompleted={isEveryTodosCompleted} />

        <TodoList todos={preparedTodos} />

        {todos.length > 0 && (
          <Footer />
        )}
      </div>

      <Notifications />
    </div>
  );
};
