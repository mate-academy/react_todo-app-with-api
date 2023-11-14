/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos, updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import TodoList from './components/TodoList';
import TodoFooter from './components/TodoFooter';
import { FilterType } from './types/FooterFilter';
import { ErrorTitle } from './types/TodoErrors';
import Header from './components/Header';

export const App: React.FC = () => {
  const [todos, setToodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [viewTodos, setViewTodos] = useState<string>(FilterType.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [query, setQuery] = useState<string>('');

  const [loader, setLoader] = useState<Record<number, boolean>>({});

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => setToodos(data))
      .catch(() => setErrorMessage(ErrorTitle.Load));
  }, []);

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
        <Header
          todos={todos}
          setToodos={setToodos}
          query={query}
          setQuery={setQuery}
          isSubmitting={isSubmitting}
          togleAllComplited={togleAllComplited}
          loader={loader}
          setLoader={setLoader}
          setErrorMessage={setErrorMessage}
          setTempTodo={setTempTodo}
          setIsSubmitting={setIsSubmitting}
        />

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

        {errorMessage}
      </div>
    </div>
  );
};
