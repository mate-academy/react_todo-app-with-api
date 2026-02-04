import React from 'react';

import cn from 'classnames';
import { FilterOptions } from '../../type/filterOptions';

type Props = {
  filter: FilterOptions;
  setFilter: (filter: FilterOptions) => void;
  hasCompletedTodos: boolean;
  activeTodoCount: number;
  onClearCompleted?: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  hasCompletedTodos,
  activeTodoCount,
  onClearCompleted,
}) => {
  const filters: FilterOptions[] = [
    FilterOptions.All,
    FilterOptions.Active,
    FilterOptions.Completed,
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodoCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filterOption => (
          <a
            key={filterOption}
            href={`#/${filterOption}`}
            className={cn('filter__link', {
              selected: filter === filterOption,
            })}
            data-cy={`FilterLink${filterOption.charAt(0).toUpperCase()}${filterOption.slice(1)}`}
            onClick={() => setFilter(filterOption)}
          >
            {filterOption}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
