import React from 'react';
import classNames from 'classnames';
import { Filters } from '../../types/Filters';

type Props = {
  filter: Filters;
  setFilter: (v: Filters) => void;
};

export const Filter: React.FC<Props> = React.memo(({
  filter, setFilter,
}) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filter === Filters.ALL },
        )}
        onClick={() => setFilter(Filters.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filter === Filters.ACTIVE },
        )}
        onClick={() => setFilter(Filters.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filter === Filters.COMPLETED },
        )}
        onClick={() => setFilter(Filters.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
});
