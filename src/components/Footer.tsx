import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  todos: Todo[];
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = React.memo(
  ({ todos, filter, setFilter, onClearCompleted }) => {
    const hasCompletedTodos = useMemo(
      () => !todos.some(todo => todo.completed),
      [todos],
    );

    const activeTodosCount = useMemo(
      () => todos.filter(todo => !todo.completed).length,
      [todos],
    );

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodosCount} items left
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filter === FilterStatus.All,
            })}
            data-cy="FilterLinkAll"
            onClick={() => setFilter(FilterStatus.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: filter === FilterStatus.Active,
            })}
            data-cy="FilterLinkActive"
            onClick={() => setFilter(FilterStatus.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: filter === FilterStatus.Completed,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => setFilter(FilterStatus.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={onClearCompleted}
          disabled={hasCompletedTodos}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);

Footer.displayName = 'Footer';
