import React from 'react';
import { Filters } from '../../types/enums/Filters';
import cn from 'classnames';

interface TodoFilterProps {
  currentFilter: Filters;
  onFilterChange: (filter: Filters) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  currentFilter,
  onFilterChange = () => {},
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: currentFilter === Filters.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(Filters.All)}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={cn('filter__link', {
          selected: currentFilter === Filters.Active,
        })}
        onClick={() => onFilterChange(Filters.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: currentFilter === Filters.Completed,
        })}
        onClick={() => onFilterChange(Filters.Completed)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
