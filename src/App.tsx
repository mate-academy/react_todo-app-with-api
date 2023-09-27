/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect, useMemo, useRef, useState,
} from 'react';
import cn from 'classnames';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import * as todoService from './api/todos';
import { TodosFilter } from './types/TodosFilter';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoContext } from './Context/TodoContext';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
  } = useContext(TodoContext);

  const [filter, setFilter] = useState(TodosFilter.All);

  useEffect(() => {
    todoService.getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const timerId = useRef(0);

  useEffect(() => {
    if (timerId.current) {
      window.clearTimeout(timerId.current);
    }

    timerId.current = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm />
        <TodoList
          todos={filteredTodos}
        />
        {Boolean(todos.length) && (
          <TodoFilter
            filter={filter}
            onFilterChange={setFilter}
          />
        )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal', {
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
        {/* Unable to load todos
        <br />
        Title should not be empty
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
