import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filter: Filter,
  setFilter: (newFilter: Filter) => void;
};

export const TodoFilter: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filter === Filter.ALL },
        )}
        onClick={() => setFilter(Filter.ALL)}
        data-cy="FilterLinkAll"
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filter === Filter.ACTIVE },
        )}
        onClick={() => setFilter(Filter.ACTIVE)}
        data-cy="FilterLinkActive"
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filter === Filter.COMPLETED },
        )}
        onClick={() => setFilter(Filter.COMPLETED)}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
