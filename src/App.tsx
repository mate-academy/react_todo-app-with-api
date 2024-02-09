import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { ErrorType, Filter } from './types/type';

const USER_ID = 52;

export const App: React.FC = () => {
  const [posts, setPosts] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [error, setError] = useState<ErrorType>({
    load: false,
    titleEmpty: false,
    addTodo: false,
    deleteTodo: false,
    updateTodo: false,
  });

  const hasAnyError = Object.values(error).some(value => value === true);

  const resetError = () => {
    setTimeout(() => {
      setError((prevState) => ({
        ...prevState,
        load: false,
        titleEmpty: false,
        deleteTodo: false,
        updateTodo: false,
        addTodo: false,
      }));
    }, 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setPosts)
      .catch(() => {
        setError((prevState) => ({
          ...prevState,
          load: true,
        }));
        resetError();
      });
  }, []);

  const visibleTodos = useMemo(() => {
    return posts.filter(todo => {
      switch (filter) {
        case Filter.Active:
          return !todo.completed;

        case Filter.Completed:
          return todo.completed;

        default: return true;
      }
    });
  }, [posts, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          posts={posts}
          setError={setError}
          USER_ID={USER_ID}
          setPosts={setPosts}
          resetError={resetError}
        />
        <Main
          posts={visibleTodos}
          setPosts={setPosts}
          setError={setError}
          resetError={resetError}
        />
        {!!posts.length && (
          <Footer
            posts={posts}
            setPosts={setPosts}
            filter={filter}
            setFilter={setFilter}
            setError={setError}
            resetError={resetError}
          />
        )}
      </div>

      {hasAnyError && (
        <div
          data-cy="ErrorNotification"
          className={
            classNames(
              'notification is-danger is-light has-text-weight-normal',
              {
                hidden: !hasAnyError,
              },
            )
          }
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            aria-label="Clear Completed"
          />
          {error.load && 'Unable to load todos'}

          {error.titleEmpty && 'Title should not be empty'}

          {error.addTodo && ' Unable to add a todo'}

          {error.deleteTodo && 'Unable to delete a todo'}

          {error.updateTodo && 'Unable to update a todo'}
        </div>
      )}
    </div>
  );
};
