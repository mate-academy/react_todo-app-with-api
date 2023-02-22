import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types';
import { capitalize } from '../../utils';

type Props = {
  selectedFilter: FilterBy,
  onFilterSelect: (filterBy: FilterBy) => void,
};

export const Filter: React.FC<Props> = React.memo(({
  selectedFilter,
  onFilterSelect,
}) => (
  <nav className="filter">
    {Object.values(FilterBy).map(filterBy => (
      <a
        key={filterBy}
        href="#/"
        className={cn(
          'filter__link',
          { selected: selectedFilter === filterBy },
        )}
        onClick={() => onFilterSelect(filterBy)}
      >
        {capitalize(filterBy)}
      </a>
    ))}
  </nav>
));
