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
      <a
        href="#/"
        onClick={handleFilterClick(FilterBy.All)}
        className={cn('filter__link',
          { selected: filterBy === FilterBy.All })}
        data-cy="FilterLinkAll"
      >
        All
      </a>
      <a
        href="#/active"
        onClick={handleFilterClick(FilterBy.Active)}
        className={cn('filter__link',
          { selected: filterBy === FilterBy.Active })}
        data-cy="FilterLinkActive"
      >
        Active
      </a>
      <a
        href="#/completed"
        onClick={handleFilterClick(FilterBy.Completed)}
        className={cn('filter__link',
          { selected: filterBy === FilterBy.Completed })}
        data-cy="FilterLinkCompleted"
      >
        Completed
      </a>
    </nav>
  );
};
