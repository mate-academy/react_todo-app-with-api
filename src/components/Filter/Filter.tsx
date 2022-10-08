import classNames from 'classnames';
import React from 'react';
import { Filters } from '../../types/Filters';

type Props = {
  filterStatus: Filters
  onFilter: (filterStatus: Filters) => void;
};

export const Filter: React.FC<Props> = React.memo(
  ({ filterStatus, onFilter }) => {
    const handleFilter = (newFilterStatus: Filters) => {
      if (filterStatus !== newFilterStatus) {
        onFilter(newFilterStatus);
      }
    };

    const handleFilterAll = () => {
      handleFilter(Filters.ALL);
    };

    const handleFilterActive = () => {
      handleFilter(Filters.ACTIVE);
    };

    const handleFilterCompleted = () => {
      handleFilter(Filters.COMPLETED);
    };

    return (
      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterStatus === 'all' },
          )}
          onClick={handleFilterAll}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterStatus === 'active' },
          )}
          onClick={handleFilterActive}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterStatus === 'completed' },
          )}
          onClick={handleFilterCompleted}
        >
          Completed
        </a>
      </nav>
    );
  },
);
