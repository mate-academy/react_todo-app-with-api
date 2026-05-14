import React from 'react';
import classNames from 'classnames';
import {
  FILTER_DATA_CY,
  FILTER_HREFS,
  FILTER_TITLES,
  FILTERS,
} from '../../constants/todos';
import { Filter as FilterType } from '../../types/Filter';

type Props = {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
};

export const Filter: React.FC<Props> = ({ selectedFilter, onFilterChange }) => (
  <nav className="filter" data-cy="Filter">
    {FILTERS.map(filter => (
      <a
        key={filter}
        href={FILTER_HREFS[filter]}
        className={classNames('filter__link', {
          selected: selectedFilter === filter,
        })}
        data-cy={FILTER_DATA_CY[filter]}
        onClick={() => onFilterChange(filter)}
      >
        {FILTER_TITLES[filter]}
      </a>
    ))}
  </nav>
);
