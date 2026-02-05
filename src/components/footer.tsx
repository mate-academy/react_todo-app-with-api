import * as React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../utils/filterStatus';

interface Props {
  uncompletedCount: number;
  completedCount: number;
  handleClearCompleted: () => void;
  setFilter: (filter: FilterStatus) => void;
  filter: FilterStatus;
}

export const FooterComponent: React.FC<Props> = ({
  uncompletedCount,
  completedCount,
  handleClearCompleted,
  setFilter,
  filter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map((status) => (
      <a
        key={status}
        href={`#/${status === FilterStatus.All ? '' : status.toLowerCase()}`}
        className={cn('filter__link', {
          selected: filter === status,
        })}
        data-cy={`FilterLink${status}`}
        onClick={() => setFilter(status)}
      >
        {status}
      </a>
    ))}

      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={completedCount === 0}
        style={{
          visibility: completedCount > 0 ? 'visible' : 'hidden',
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};

export const Footer = React.memo(FooterComponent);
