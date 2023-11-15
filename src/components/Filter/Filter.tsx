import React, { useContext } from 'react';
import classNames from 'classnames';
import { FILTER } from '../../types/FILTER';
import { TodosContext } from '../../TodosContext';

export const Filter: React.FC = () => {
  const { currentFilter, setCurrentFilter } = useContext(TodosContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={classNames('filter__link', {
          selected: currentFilter === FILTER.ALL,
        })}
        onClick={() => setCurrentFilter(FILTER.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={classNames('filter__link', {
          selected: currentFilter === FILTER.ACTIVE,
        })}
        onClick={() => setCurrentFilter(FILTER.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={classNames('filter__link', {
          selected: currentFilter === FILTER.COMPLETED,
        })}
        onClick={() => setCurrentFilter(FILTER.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
};
