import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  currentFilter: Filter;
  setCurrentFilter: (status: Filter) => void
};

export const TodoFilter: React.FC<Props> = ({
  currentFilter,
  setCurrentFilter,
}) => {
  return (
    <nav className="Filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={classNames('filter__link', {
          selected: currentFilter === Filter.All,
        })}
        onClick={() => setCurrentFilter(Filter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={classNames('filter__link', {
          selected: currentFilter === Filter.Active,
        })}
        onClick={() => setCurrentFilter(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={classNames('filter__link', {
          selected: currentFilter === Filter.Completed,
        })}
        onClick={() => setCurrentFilter(Filter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};
