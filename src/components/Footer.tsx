import React from 'react';
import { FilterBy } from '../types/FilterBy';
import cn from 'classnames';

type Props = {
  handleFilterChange: React.Dispatch<React.SetStateAction<FilterBy>>;
  filterBy: FilterBy;
  totalActiveTodos: number;
  onDeleteCompleted: () => void;
  hasCompletedTodos: number;
};

export const Footer: React.FC<Props> = ({
  handleFilterChange,
  filterBy,
  onDeleteCompleted,
  totalActiveTodos,
  hasCompletedTodos,
}) => {
  const links = Object.entries(FilterBy);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {totalActiveTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {links.map(([key, value]) => (
          <a
            href={`#/${value === FilterBy.All ? '' : `${value}`}`}
            className={cn('filter__link', { selected: filterBy === value })}
            data-cy={`FilterLink${key}`}
            key={key}
            onClick={() => handleFilterChange(value)}
          >
            {key}
          </a>
        ))}
      </nav>

      <button
        disabled={!hasCompletedTodos}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
