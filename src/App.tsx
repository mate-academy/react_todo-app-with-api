/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  getTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { FilterType } from './types/FooterFilter';
import { ErrorTitle } from './types/TodoErrors';

export const App: React.FC = () => {
  const [todos, setToodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [viewTodos, setViewTodos] = useState<string>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState<string>('');
  const refInput = useRef<HTMLInputElement | null>(null);

  const [loader, setLoader] = useState<Record<number, boolean>>({});
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => setToodos(data))
      .catch(() => setErrorMessage(ErrorTitle.Load));
  }, []);

  useEffect(() => {
    if (refInput.current) {
      refInput.current.focus();
    }
  }, [isSubmitting, todos.length]);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  function filterTodo() {
    const todosFilter = todos.filter((todo) => {
      switch (viewTodos) {
        case FilterType.All:
          return todo;
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });

    return todosFilter;
  }

  function handlerAddTodo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage(ErrorTitle.Title);

      return;
    }

    const fakeTodo = {
      title: query.trim(),
      completed: false,
      userId: USER_ID,
      id: 0,
    };

    setErrorMessage('');
    setLoader({ ...loader, [fakeTodo.id]: true });
    setTempTodo(fakeTodo);
    setIsSubmitting(true);
    createTodo({
      title: query.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then((newPost) => {
        setToodos((currentPost) => [...currentPost, newPost]);
        setQuery('');
      })
      .catch((err) => {
        setErrorMessage(ErrorTitle.Add);
        throw Error(err);
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
        setLoader({ ...loader, [fakeTodo.id]: false });
      });
  }

  const handlerUpdateTodo = (todo: Todo) => {
    setLoader((prevLoader) => ({
      ...prevLoader,
      [todo.id]: true,
    }));

    return updateTodo(todo)
      .then((updatedTodo) => {
        setToodos((prevTodo) => prevTodo.map((item) => (
          item.id === updatedTodo.id ? updatedTodo : item)));
      })
      .catch((err) => {
        setErrorMessage(ErrorTitle.Update);
        throw (err);
      })
      .finally(() => {
        setLoader((prevLoader) => ({
          ...prevLoader,
          [todo.id]: false,
        }));
      });
  };

  const togleAllComplited = () => {
    const isAllComplited = todos.every((todo) => todo.completed);

    const changeCompleted = todos.filter((todo) => {
      return isAllComplited ? todo.completed : !todo.completed;
    });

    changeCompleted.map((todo) => {
      return handlerUpdateTodo({
        ...todo,
        completed: !isAllComplited,
      });
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}

          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.every((todo) => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={togleAllComplited}
            />
          )}
          {/* Add a todo on form submit */}
          <form onSubmit={handlerAddTodo}>
            <input
              disabled={isSubmitting}
              ref={refInput}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodoList
          todos={filterTodo()}
          tempTodo={tempTodo}
          setToodos={setToodos}
          setErrorMessage={setErrorMessage}
          setIsSubmitting={setIsSubmitting}
          setLoader={setLoader}
          loader={loader}
          handlerUpdateTodo={handlerUpdateTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            todos={todos}
            setViewTodos={setViewTodos}
            viewTodos={viewTodos}
            setToodos={setToodos}
            setErrorMessage={setErrorMessage}
            setLoader={setLoader}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
