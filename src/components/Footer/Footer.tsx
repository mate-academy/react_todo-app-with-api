import classNames from 'classnames';
import React, { useContext, useEffect, useState } from 'react';
import { getTodos, removeTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todos: Todo[];
  onTodosChange: (value: Todo[]) => void;
  onShowFooterChange: (value: boolean) => void;
  onClearCompletedLoader: (value: boolean) => void;
};

enum SortBy {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const Footer: React.FC<Props> = ({
  todos,
  onTodosChange,
  onShowFooterChange,
  onClearCompletedLoader,
}) => {
  const [filterBy, setFilterBy] = useState<SortBy>();
  const [hasCompletedTodos, setHasCompletedTodos] = useState<boolean>();
  const user = useContext(AuthContext);

  useEffect(() => {
    const hasTodos = todos.filter(todo => todo.completed).length > 0;
    const noTodos = todos.filter(todo => todo.completed).length === 0;

    if (hasTodos) {
      setHasCompletedTodos(true);
    }

    if (noTodos) {
      setHasCompletedTodos(false);
    }
  }, [todos]);

  const handleFilter = async (sortBy: SortBy) => {
    const todosFromServer = user && await getTodos(user.id);

    if (todosFromServer) {
      switch (sortBy) {
        case SortBy.All:
          return onTodosChange(todosFromServer);

        case SortBy.Active:
          return onTodosChange(todosFromServer.filter(todo => !todo.completed));

        case SortBy.Completed:
          return onTodosChange(todosFromServer.filter(todo => todo.completed));

        default:
          return onTodosChange(todosFromServer);
      }
    }

    return todosFromServer;
  };

  const handleClearCompleted = async () => {
    onClearCompletedLoader(true);
    const todosFromServer = user && await getTodos(user.id);
    const onlyActiveTodos = todos.filter(todo => !todo.completed);

    onTodosChange(onlyActiveTodos);

    if (todosFromServer) {
      todosFromServer.map(
        todo => todo.completed === true && removeTodo(todo.id),
      );
    }

    if (user && (await getTodos(user.id)).length === 0) {
      onShowFooterChange(false);
    }

    setHasCompletedTodos(false);
    onClearCompletedLoader(false);
  };

  const { All, Active, Completed } = SortBy;
  const activeTodos = todos.filter(todo => todo.completed === false).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterBy === All },
          )}
          onClick={() => {
            handleFilter(All);
            setFilterBy(All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterBy === Active },
          )}
          onClick={() => {
            handleFilter(Active);
            setFilterBy(Active);
          }}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterBy === Completed },
          )}
          onClick={() => {
            handleFilter(Completed);
            setFilterBy(Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => handleClearCompleted()}
      >

        {hasCompletedTodos ? 'Clear completed' : ''}

      </button>
    </footer>
  );
};
