import React from 'react';
import cn from 'classnames';
import { SelectFilter } from '../utils/SelectFilter';

interface FilterBarProps {
  filterOption: SelectFilter;
  onFilterChange: (filter: SelectFilter) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filterOption, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', { selected: filterOption === SelectFilter.All })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterChange(SelectFilter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', { selected: filterOption === SelectFilter.Active })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterChange(SelectFilter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', { selected: filterOption === SelectFilter.Completed })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterChange(SelectFilter.Completed)}
      >
        Completed
      </a>
    </nav>
  );
};

export default FilterBar;
