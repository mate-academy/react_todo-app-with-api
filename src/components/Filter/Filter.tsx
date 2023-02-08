import React from 'react';
import cn from 'classnames';
import { FilterTypes } from '../../types/Enums';

type Props = {
  filterType: string,
  setFilterType: (value: FilterTypes) => void,
};

export const Filter: React.FC<Props> = ({
  filterType,
  setFilterType,

}) => (
  <nav className="filter" data-cy="Filter">
    <a
      data-cy="FilterLinkAll"
      href="#/"
      className={cn(
        'filter__link',
        { selected: filterType === FilterTypes.All },
      )}
      onClick={() => setFilterType(FilterTypes.All)}
    >
      All
    </a>

    <a
      data-cy="FilterLinkActive"
      href="#/active"
      className={cn(
        'filter__link',
        { selected: filterType === FilterTypes.ACTIVE },
      )}
      onClick={() => setFilterType(FilterTypes.ACTIVE)}
    >
      Active
    </a>
    <a
      data-cy="FilterLinkCompleted"
      href="#/completed"
      className={cn(
        'filter__link',
        { selected: filterType === FilterTypes.COMPLETED },
      )}
      onClick={() => setFilterType(FilterTypes.COMPLETED)}
    >
      Completed
    </a>
  </nav>
);
