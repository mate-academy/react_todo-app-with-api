/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
} from 'react';
import classNames from 'classnames';
import './styles/App.scss';
import { TodoFilter } from './types/TodoFilter';
import { TodoList } from './components/TodoList';
import { TodoHeader } from './components/TodoHeader';
import { TodoFooter } from './components/TodoFooter';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { CurrentError } from './types/CurrentError';
import { useTodo } from './Context/TodoContext';
import { USER_ID } from './utils/constants';
import * as todoService from './api/todos';

export const App: React.FC = () => {
  const [todoFilter, setTodoFilter] = useState<TodoFilter>(TodoFilter.All);

  const {
    todos,
    setTodos,
    error,
    setError,
  } = useTodo();

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setError(CurrentError.LoadingError);
      });
  }, []);

  const timerId = useRef<number>(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setError(CurrentError.Default);
    }, 3000);
  }, [error]);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, todoFilter);
  }, [todos, todoFilter]);

  const handleSetTodoFilter = (filter: TodoFilter) => (
    setTodoFilter(filter)
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        <TodoList
          todos={filteredTodos}
        />

        {!!todos.length && (
          <TodoFooter
            filter={todoFilter}
            setFilter={handleSetTodoFilter}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(CurrentError.Default)}
        />
        {error}
      </div>
    </div>
  );
};
