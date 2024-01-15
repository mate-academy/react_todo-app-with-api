import React from 'react';
import cn from 'classnames';
import { Filter } from './types/Filter';

type Props = {
  setFilter: (filter: Filter) => void;
  filter: Filter;
};

export const TodoFilter: React.FC<Props> = ({ setFilter, filter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', { selected: filter === Filter.All })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(Filter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', { selected: filter === Filter.Active })}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filter === Filter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(Filter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
