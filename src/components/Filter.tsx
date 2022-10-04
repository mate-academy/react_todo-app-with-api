import React from 'react';
import classNames from 'classnames';

type Props = {
  sortFilter: string
  setSortFilter: (sortFilter:string) => void;
};

export const Filter: React.FC<Props> = ({
  sortFilter,
  setSortFilter,
}) => {
  const FILTERS = {
    all: 'all',
    completed: 'completed',
    active: 'active',
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: sortFilter === FILTERS.all },
        )}
        onClick={() => (
          sortFilter !== FILTERS.all
          && setSortFilter(FILTERS.all)
        )}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: sortFilter === FILTERS.active },
        )}
        onClick={() => (
          sortFilter !== FILTERS.active
          && setSortFilter(FILTERS.active)
        )}
      >
        Active
      </a>
      {}
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: sortFilter === FILTERS.completed },
        )}
        onClick={() => (
          sortFilter !== FILTERS.completed
          && setSortFilter(FILTERS.completed)
        )}
      >
        Completed
      </a>
    </nav>

  );
};
