/* eslint-disable func-names */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { useContext, useEffect, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';

import { deleteTodo, getTodos, patchTodo } from './api/todos';
import { ErrorType } from './types';

import { AppContext } from './components/AppProvider/AppProvider';
import { Filter } from './components/Filter';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const {
    userId,
    todos,
    error,
    setTodos,
    setError,
    setIsLoadingMany,
    setIsDeleting,
  } = useContext(AppContext);

  useEffect(() => {
    let timerId = 0;

    if (error) {
      timerId = window.setTimeout(
        setError, 3000, ErrorType.None,
      );
    } else {
      window.clearTimeout(timerId);
    }
  }, [error]);

  useEffect(() => {
    (async function () {
      setTodos(await getTodos(userId || 0));
    }());
  }, []);

  const activeTodos = useMemo(() => (
    todos.filter(({ completed }) => !completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(({ completed }) => completed)
  ), [todos]);

  const isActive = completedTodos.length === todos.length;

  const clearCompleted = async () => {
    setIsDeleting(true);

    await Promise.all(completedTodos.map(({ id }) => (
      deleteTodo(id)
        .then(() => setTodos(activeTodos))
        .catch(() => setError(ErrorType.Delete))
        .then(() => setIsDeleting(false))
    )));
  };

  const toggleAll = async () => {
    setIsLoadingMany(true);
    const status = Boolean(activeTodos.length);
    const newProp = { completed: status };
    const updatedTodos = todos.map(todo => ({
      ...todo,
      ...newProp,
    }));

    await Promise.all(todos.map(({ completed, id }) => {
      if (completed !== status) {
        return patchTodo(id, newProp)
          .then(() => setTodos(updatedTodos))
          .catch(() => setError(ErrorType.Update))
          .then(() => setIsLoadingMany(false));
      }

      return new Promise(res => res);
    }));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {Boolean(todos.length) && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={cn('todoapp__toggle-all', {
                active: isActive,
              })}
              onClick={toggleAll}
            />
          )}

          <NewTodo />
        </header>

        <section
          className="todoapp__main"
          data-cy="TodoList"
        >
          <Routes>
            <Route
              path="/"
              element={<TodoList todos={todos} />}
            />

            <Route
              path="/active"
              element={<TodoList todos={activeTodos} />}
            />

            <Route
              path="/completed"
              element={<TodoList todos={completedTodos} />}
            />
          </Routes>
        </section>

        {Boolean(todos.length) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <Filter />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={clearCompleted}
              disabled={!completedTodos.length}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(ErrorType.None)}
        />

        {error === ErrorType.Add && (
          <>
            Unable to add a todo
            <br />
          </>
        )}

        {error === ErrorType.Delete && (
          <>
            Unable to delete a todo
            <br />
          </>
        )}

        {error === ErrorType.Update && (
          <>
            Unable to update a todo
            <br />
          </>
        )}

        {error === ErrorType.Title && (
          'Title can\'t be empty'
        )}
      </div>
    </div>
  );
};
