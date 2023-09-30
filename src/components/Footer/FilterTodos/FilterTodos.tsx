

import React from 'react';
import { FilterLink } from './FilterLink';
import { Filter } from '../../../types/Filter';

export const FilterTodos: React.FC = () => {
  return (
    <nav className="filter" data-cy="Filter">
      <FilterLink filter={Filter.All}>All</FilterLink>
      <FilterLink filter={Filter.Active}>Active</FilterLink>
      <FilterLink filter={Filter.Completed}>Completed</FilterLink>
    </nav>
  );
};
