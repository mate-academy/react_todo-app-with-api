import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types';

type Props = {
  selectedFilter: FilterBy,
  onFilterSelect: (filterBy: FilterBy) => void,
};

export const Filter: React.FC<Props> = React.memo(({
  selectedFilter,
  onFilterSelect,
}) => (
  <nav className="filter">
    <a
      href="#/"
      className={cn(
        'filter__link',
        { selected: selectedFilter === FilterBy.ALL },
      )}
      onClick={() => onFilterSelect(FilterBy.ALL)}
    >
      All
    </a>

    <a
      href="#/active"
      className={cn(
        'filter__link',
        { selected: selectedFilter === FilterBy.ACTIVE },
      )}
      onClick={() => onFilterSelect(FilterBy.ACTIVE)}
    >
      Active
    </a>

    <a
      href="#/completed"
      className={cn(
        'filter__link',
        { selected: selectedFilter === FilterBy.COMPLETED },
      )}
      onClick={() => onFilterSelect(FilterBy.COMPLETED)}
    >
      Completed
    </a>
  </nav>
));
