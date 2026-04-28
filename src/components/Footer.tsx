import React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../enums/FilterStatus';

interface Props {
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  activeCount: number;
  onClearCompleted: () => void;
  hasCompleted: boolean;
}

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  activeCount,
  onClearCompleted,
  hasCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <nav className="filter" data-cy="Filter">
          {Object.values(FilterStatus).map(status => (
            <a
              key={status}
              href={status === FilterStatus.All ? '#/' : `#/${status}`}
              className={cn('filter__link', {
                selected: filter === status,
              })}
              onClick={() => setFilter(status)}
              data-cy={`FilterLink${status[0].toUpperCase() + status.slice(1)}`}
            >
              {status[0].toUpperCase() + status.slice(1)}
            </a>
          ))}
        </nav>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
