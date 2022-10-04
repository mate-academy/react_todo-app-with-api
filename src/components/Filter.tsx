import React from 'react';
import classNames from 'classnames';

type Props = {
  sortFilter: string
  handleChangeSortFilter: (sort:string) => void;
};

export const Filter: React.FC<Props> = ({
  sortFilter,
  handleChangeSortFilter,
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
        onClick={() => handleChangeSortFilter(FILTERS.all)}
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
        onClick={() => handleChangeSortFilter(FILTERS.active)}
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
        onClick={() => handleChangeSortFilter(FILTERS.completed)}
      >
        Completed
      </a>
    </nav>

  );
};
