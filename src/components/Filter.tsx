import React from 'react';
import cn from 'classnames';
import { Filters } from '../constants/filter';

type Props = {
  filter: Filters;
  onFilterChange: (filter: Filters) => void;
};

export const Filter: React.FC<Props> = ({ filter, onFilterChange }) => (
  <nav className="filter" data-cy="Filter">
    <a
      href="#/"
      className={cn('filter__link', { selected: filter === Filters.All })}
      data-cy="FilterLinkAll"
      onClick={() => onFilterChange(Filters.All)}
    >
      All
    </a>

    <a
      href="#/active"
      className={cn('filter__link', { selected: filter === Filters.Active })}
      data-cy="FilterLinkActive"
      onClick={() => onFilterChange(Filters.Active)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={cn('filter__link', { selected: filter === Filters.Completed })}
      data-cy="FilterLinkCompleted"
      onClick={() => onFilterChange(Filters.Completed)}
    >
      Completed
    </a>
  </nav>
);
