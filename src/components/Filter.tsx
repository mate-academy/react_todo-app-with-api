import React from 'react';
import classNames from 'classnames';

export type FilterType = 'all' | 'active' | 'completed';

interface Props {
  filterType: FilterType;
  onChangeFilter: (type: FilterType) => void;
}

export const Filter: React.FC<Props> = ({ filterType, onChangeFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterType === 'all',
        })}
        data-cy="FilterLinkAll"
        onClick={() => onChangeFilter('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterType === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={() => onChangeFilter('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterType === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onChangeFilter('completed')}
      >
        Completed
      </a>
    </nav>
  );
};
