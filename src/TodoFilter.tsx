import React from 'react';
import cn from 'classnames';
import { FilterBy } from './types/FilterBy';
import { TodoFilterProps } from './types/TodoFilterProps';

export const TodoFilter: React.FC<TodoFilterProps> = ({
  filterBy,
  handleFilterClick,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FilterBy).map(filterType => (
        <a
          key={filterType}
          href={`#/${filterType}`}
          onClick={handleFilterClick(filterType)}
          className={cn('filter__link', { selected: filterBy === filterType })}
          data-cy={`FilterLink${filterType}`}
        >
          {filterType}
        </a>
      ))}
    </nav>
  );
};
