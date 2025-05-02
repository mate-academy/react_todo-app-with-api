import React from 'react';
import { FilterStatus } from '../../types/Todo';

type Props = {
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
};

export const Filter: React.FC<Props> = ({ filter, setFilter }) => (
  <nav className="filter" data-cy="Filter">
    {Object.values(FilterStatus).map(filterType => (
      <a
        key={filterType}
        href={`#/${filterType === FilterStatus.ALL ? '' : filterType}`}
        className={`filter__link ${filter === filterType ? 'selected' : ''}`}
        data-cy={`FilterLink${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
        onClick={() => setFilter(filterType)}
      >
        {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
      </a>
    ))}
  </nav>
);
