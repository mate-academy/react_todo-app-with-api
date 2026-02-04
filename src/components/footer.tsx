import * as React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../utils/filterStatus';


interface Props {
  uncompletedCount: number;
  completedCount: number;
  onClearCompleted: () => void;
  setFilter: (filter: FilterStatus) => void;
  filter: FilterStatus;
}

export const FooterComponent: React.FC<Props> = ({
  uncompletedCount,
  completedCount,
  onClearCompleted,
  setFilter,
  filter,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === FilterStatus.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === FilterStatus.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
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
