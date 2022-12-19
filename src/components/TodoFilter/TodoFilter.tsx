import classNames from 'classnames';
import React, { useContext } from 'react';
import { StatusToFilter } from '../../types/StatusToFilter';
import { FilterContext } from './FilterContext';

export const TodoFilter: React.FC = React.memo(() => {
  const { filterStatus, setFilterStatus } = useContext(FilterContext);

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: filterStatus === StatusToFilter.All },
        )}
        onClick={() => setFilterStatus(StatusToFilter.All)}
      >
        {StatusToFilter.All}
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: filterStatus === StatusToFilter.Active },
        )}
        onClick={() => setFilterStatus(StatusToFilter.Active)}
      >
        {StatusToFilter.Active}
      </a>
      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: filterStatus === StatusToFilter.Completed },
        )}
        onClick={() => setFilterStatus(StatusToFilter.Completed)}
      >
        {StatusToFilter.Completed}
      </a>
    </nav>
  );
});
