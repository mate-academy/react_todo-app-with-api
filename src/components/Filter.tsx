import React from 'react';
import classNames from 'classnames';
import { FILTERS } from '../utils/constants';

type Props = {
  filter: string;
  onFilterChange: (filter: string) => void;
};

export const Filter: React.FC<Props> = ({ filter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === FILTERS.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(FILTERS.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FILTERS.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange(FILTERS.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FILTERS.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterChange(FILTERS.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
