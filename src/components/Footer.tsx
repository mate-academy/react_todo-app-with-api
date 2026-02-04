import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

interface FooterProps {
  activeTodosCount: number;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

const formatStatus = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export const Footer: React.FC<FooterProps> = ({
  activeTodosCount,
  filter,
  setFilter,
  hasCompleted,
  onClearCompleted,
}) => {
  const filterStatuses = Object.values(FilterStatus);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterStatuses.map(status => {
          const label = formatStatus(status);

          return (
            <a
              key={status}
              href={`#/${status === FilterStatus.All ? '' : status}`}
              className={classNames('filter__link', {
                selected: filter === status,
              })}
              data-cy={`FilterLink${label}`}
              onClick={() => setFilter(status)}
            >
              {label}
            </a>
          );
        })}
      </nav>

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
