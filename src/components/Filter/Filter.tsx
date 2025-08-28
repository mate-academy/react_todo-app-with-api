// File: src/components/Filter/Filter.tsx
import React from 'react';
import cn from 'classnames';

export enum FilterBy {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

type Props = {
  filter: FilterBy;
  setFilter: (f: FilterBy) => void;
  activeCount: number; // number of NOT completed todos
  hasCompleted: boolean; // any completed exist (for clear button state)
  onClearCompleted: () => void;
};

export const Filter: React.FC<Props> = ({
  filter,
  setFilter,
  activeCount,
  hasCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="footer" data-cy="Footer">
      {/* Counter */}
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      {/* Filters */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={cn('filter__link', { selected: filter === FilterBy.All })}
          onClick={e => {
            e.preventDefault();
            setFilter(FilterBy.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={cn('filter__link', {
            selected: filter === FilterBy.Active,
          })}
          onClick={e => {
            e.preventDefault();
            setFilter(FilterBy.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={cn('filter__link', {
            selected: filter === FilterBy.Completed,
          })}
          onClick={e => {
            e.preventDefault();
            setFilter(FilterBy.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      {/* Clear completed */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
