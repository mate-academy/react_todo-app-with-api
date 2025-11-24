import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

interface Props {
  filterBy: Filter;
  onFilterBy: (filter: Filter) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  filterBy,
  onFilterBy,
  activeCount,
  completedCount,
  onClearCompleted,
}) => {
  return (
    <footer className="footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeCount} items left`}
      </span>

      <ul className="filters" data-cy="Filter">
        <li>
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filterBy === Filter.ALL,
            })}
            data-cy="FilterLinkAll"
            onClick={() => onFilterBy(Filter.ALL)}
          >
            All
          </a>
        </li>

        <li>
          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: filterBy === Filter.ACTIVE,
            })}
            data-cy="FilterLinkActive"
            onClick={() => onFilterBy(Filter.ACTIVE)}
          >
            Active
          </a>
        </li>

        <li>
          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: filterBy === Filter.COMPLETED,
            })}
            data-cy="FilterLinkCompleted"
            onClick={() => onFilterBy(Filter.COMPLETED)}
          >
            Completed
          </a>
        </li>
      </ul>

      {completedCount > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
