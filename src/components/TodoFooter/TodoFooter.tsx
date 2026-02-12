import classNames from 'classnames';
import React from 'react';
import { FilterOption } from '../../types/FilterOption';

type Props = {
  activeTodosCount: number;
  completedTodosCount: number;
  selectedFilter: FilterOption;
  onFilterChange: (option: FilterOption) => void;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  completedTodosCount,
  selectedFilter,
  onFilterChange,
  onClearCompleted,
}) => {
  const cnFilter = (option: FilterOption) =>
    classNames('filter__link', { selected: selectedFilter === option });

  const filterOptions = Object.values(FilterOption);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount === 1
          ? '1 item left'
          : `${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(option => (
          <a
            key={option}
            href={`#/${option}`}
            className={cnFilter(option)}
            data-cy={`FilterLink${option}`}
            onClick={() => onFilterChange(option)}
          >
            {option}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!completedTodosCount}
      >
        Clear completed
      </button>
    </footer>
  );
};
