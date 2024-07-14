import { FC } from 'react';
import cn from 'classnames';
import pluralize from 'pluralize';

import { Status } from '../../types/statusTypes';

interface Props {
  activeTodosCount: number;
  filter: Status;
  setFilter: (status: Status) => void;
  onClear: () => void;
  canClearAllVisible: boolean;
}

export const Footer: FC<Props> = ({
  activeTodosCount,
  filter: filter,
  setFilter: setFilter,
  onClear,
  canClearAllVisible,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} ${pluralize('item', activeTodosCount)} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === Status.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === Status.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClear}
        disabled={!canClearAllVisible}
      >
        Clear completed
      </button>
    </footer>
  );
};
