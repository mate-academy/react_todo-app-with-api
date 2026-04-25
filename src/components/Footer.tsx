import React from 'react';
import classNames from 'classnames';
import { FILTERS } from '../constants';
import type { FilterStatus } from '../types/Todo';

interface Props {
  activeTodosCount: number;
  completedTodosCount: number;
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  onClearCompleted: () => void;
}

const FILTER_LINKS: FilterStatus[] = [
  FILTERS.ALL,
  FILTERS.ACTIVE,
  FILTERS.COMPLETED,
];

const FILTER_LABELS: Record<FilterStatus, string> = {
  [FILTERS.ALL]: 'All',
  [FILTERS.ACTIVE]: 'Active',
  [FILTERS.COMPLETED]: 'Completed',
};

const FILTER_DATA_CY: Record<FilterStatus, string> = {
  [FILTERS.ALL]: 'FilterLinkAll',
  [FILTERS.ACTIVE]: 'FilterLinkActive',
  [FILTERS.COMPLETED]: 'FilterLinkCompleted',
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  currentFilter,
  onFilterChange,
  onClearCompleted,
}) => {
  const itemsLeftLabel = `${activeTodosCount} item${activeTodosCount === 1 ? '' : 's'} left`;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeftLabel}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_LINKS.map(filter => (
          <a
            key={filter}
            href={`#/${filter === FILTERS.ALL ? '' : filter}`}
            className={classNames('filter__link', {
              selected: currentFilter === filter,
            })}
            data-cy={FILTER_DATA_CY[filter]}
            onClick={() => {
              onFilterChange(filter);
            }}
          >
            {FILTER_LABELS[filter]}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
