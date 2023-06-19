import React, { memo } from 'react';
import classNames from 'classnames';
import { Filters } from '../../types/FilterEnum';

interface FilterProps {
  filter: Filters,
  activeTodos: number,
  onChange: (arg: Filters) => void,
  onDeleteCompleted: () => void,
}

export const Filter: React.FC<FilterProps> = memo(({
  filter,
  activeTodos: activeTodosCount,
  onChange,
  onDeleteCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="todosCounter">
      {`${activeTodosCount} item${activeTodosCount > 1 ? 's' : ''} left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link', {
            selected: filter === Filters.ALL,
          },
        )}
        onClick={() => onChange(Filters.ALL)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link', {
            selected: filter === Filters.ACTIVE,
          },
        )}
        onClick={() => onChange(Filters.ACTIVE)}
      >
        Active
      </a>

      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link', {
            selected: filter === Filters.COMPLETED,
          },
        )}
        onClick={() => onChange(Filters.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    <button
      data-cy="ClearCompletedButton"
      type="button"
      className="todoapp__clear-completed"
      onClick={onDeleteCompleted}
    >
      Clear completed
    </button>
  </footer>
));
