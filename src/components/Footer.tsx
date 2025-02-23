import React from 'react';
import { FilterBy } from '../types/FilterBy';
import cn from 'classnames';

type Props = {
  setFilterBy: React.Dispatch<React.SetStateAction<FilterBy>>;
  filterBy: FilterBy;
  totalTodosActive: number;
  onDeleteCompleted: () => void;
  hasTodoCompleted: number;
};

export const Footer: React.FC<Props> = ({
  setFilterBy,
  filterBy,
  onDeleteCompleted,
  totalTodosActive,
  hasTodoCompleted,
}) => {
  const links = Object.entries(FilterBy);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {totalTodosActive} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {links.map(([key, value]) => (
          <a
            href={`#/${value === FilterBy.All ? '' : `${value}`}`}
            className={cn('filter__link', { selected: filterBy === value })}
            data-cy={`FilterLink${key}`}
            key={key}
            onClick={() => setFilterBy(value)}
          >
            {key}
          </a>
        ))}
      </nav>

      <button
        disabled={!hasTodoCompleted}
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
