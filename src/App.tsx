/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, deletePost, getTodos } from './api/todos';
import classNames from 'classnames';
import { TodoContext } from './contexts/TodoContext';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { ErrorContext } from './contexts/ErrorContext';
import { Header } from './components/Header';
import { ActionType } from './contexts/types/Actions';
import { DeletingContext } from './contexts/DeletingContext';

export enum FilterType {
  ALL = 'All',
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
}

export const App: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);
  const inputRef = useRef<HTMLInputElement>(null);

  const { todos, dispatch } = useContext(TodoContext);
  const { error, setError } = useContext(ErrorContext);
  const { setIsDeleteActive } = useContext(DeletingContext);

  useEffect(() => {
    getTodos()
      .then(response => {
        dispatch({ type: ActionType.SET, payload: response });
      })
      .catch(() => {
        setError('Unable to load todos');
      });

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [dispatch, setError]);

  const getFormedTodos = useMemo(() => {
    switch (filter) {
      case FilterType.ALL: {
        return todos;
      }

      case FilterType.ACTIVE: {
        return todos.filter(todo => !todo.completed);
      }

      case FilterType.COMPLETED: {
        return todos.filter(todo => todo.completed);
      }
    }
  }, [filter, todos]);

  const deleteAll = () => {
    const promiseArr: Array<Promise<void>> = [];

    for (const todo of todos.filter(td => td.completed)) {
      if (error) {
        break;
      }

      promiseArr.push(
        deletePost(todo.id)
          .then(() => {
            dispatch({ type: ActionType.DELETE, payload: todo.id });
          })
          .catch(() => {
            setError('Unable to delete a todo');
          }),
      );
    }

    Promise.all([...promiseArr]).finally(() => {
      setIsDeleteActive(false);
    });

    inputRef.current?.focus();
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header inputRef={inputRef} />

        <section className="todoapp__main" data-cy="TodoList">
          <div>
            {todos && <TodoList todos={getFormedTodos} inputRef={inputRef} />}
          </div>
        </section>

        {!!todos.length && (
          <Footer filter={filter} setFilter={setFilter} deleteAll={deleteAll} />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {/* show only one message at a time */}
        {error}
        <br />
        {/* Title should not be empty
        <br />
        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
