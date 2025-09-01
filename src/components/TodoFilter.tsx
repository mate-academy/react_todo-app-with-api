import React from 'react';
import classNames from 'classnames';

type FilterType = 'all' | 'active' | 'completed';

interface TodoFilterProps {
  filterType: FilterType;
  setFilterType: (filter: FilterType) => void;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  filterType,
  setFilterType,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={classNames('filter__link', {
          selected: filterType === 'all',
        })}
        onClick={() => setFilterType('all')}
      >
        All
      </a>
      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={classNames('filter__link', {
          selected: filterType === 'active',
        })}
        onClick={() => setFilterType('active')}
      >
        Active
      </a>
      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={classNames('filter__link', {
          selected: filterType === 'completed',
        })}
        onClick={() => setFilterType('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
