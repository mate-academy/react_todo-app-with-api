import React from 'react';
import cn from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  setFilter,
  filter,
  activeCount,
  completedCount,
  onClearCompleted,
}) => {
  const itemsLeftText = `${activeCount} item${activeCount === 1 ? '' : 's'} left`;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeftText}
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(filterValue => (
          <a
            key={filterValue}
            href={`#/${filterValue.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filter === filterValue,
            })}
            data-cy={`FilterLink${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}`}
            onClick={() => setFilter(filterValue)}
          >
            {filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
