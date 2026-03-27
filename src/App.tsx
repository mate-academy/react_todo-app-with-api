/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';

import { Todo } from './types/Todo';
import { Filter } from './types/Filters';

import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Footer } from './components/Footer/Footer';

import { TodoContext } from './store/TodoContext';
import { ErrorContext } from './store/ErrorContext';

import { getTodos, USER_ID } from './api/todos';
import { UserWarning } from './UserWarning';
import { useContext } from 'react';

export const App: React.FC = () => {
  const { isError, errorMessage, showError, closeError } =
    useContext(ErrorContext);
  const { todos, setTodos } = useContext(TodoContext);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>('All');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const response = await getTodos();

        if (!response) {
          throw new Error('Error 404');
        }

        setTodos(response);
      } catch (err) {
        showError('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'Active':
        return todos.filter(item => !item.completed);
      case 'Completed':
        return todos.filter(item => item.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header setTempTodo={setTempTodo} />
        <TodoList todos={filteredTodos} />
        {tempTodo !== null && <TodoItem todo={tempTodo} />}
        {todos.length > 0 && <Footer filter={filter} setFilter={setFilter} />}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !isError,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeError}
        />
        {errorMessage}
      </div>
    </div>
  );
};
