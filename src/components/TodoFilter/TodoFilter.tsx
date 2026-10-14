import React from 'react';
import { Filter } from '../../types/Filter';
import classNames from 'classnames';

type TodoFilterProps = {
  selectedFilter: Filter;
  onFilterChange: (filter: Filter) => void;
};

export const TodoFilter: React.FC<TodoFilterProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: selectedFilter === 'all',
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: selectedFilter === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: selectedFilter === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterChange('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
