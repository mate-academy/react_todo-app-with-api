import classNames from 'classnames';
import React from 'react';
import { Status } from '../types/Status';

type Props = {
  filterBy: Status,
  onFilterChange: (filterBy: Status) => void,
  activeTodosCount: number,
  hasCompletedTodosCount: boolean,
  handleClearCompleted: () => void;
};

export const TodoFilter: React.FC<Props> = ({
  filterBy,
  onFilterChange,
  activeTodosCount,
  hasCompletedTodosCount,
  handleClearCompleted,
}) => {
  const itemsLeftMessage = activeTodosCount === 1
    ? `${activeTodosCount} item left`
    : `${activeTodosCount} items left`;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeftMessage}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filterBy === Status.All,
          })}
          onClick={() => onFilterChange(Status.All)}
        >
          All
        </a>

        <a
          href="#/"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: filterBy === Status.Active,
          })}
          onClick={() => onFilterChange(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: filterBy === Status.Completed,
          })}
          onClick={() => onFilterChange(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        data-cy="ClearCompletedButton"
        className="todoapp__clear-completed"
        disabled={!hasCompletedTodosCount}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
