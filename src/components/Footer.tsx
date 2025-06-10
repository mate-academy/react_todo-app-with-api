import React from 'react';
import { FilterType } from '../enums/enums';
import classNames from 'classnames';

interface FooterProps {
  incompleteCount: number;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  todosCompleted: boolean;
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  incompleteCount,
  filter,
  onFilterChange,
  todosCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {incompleteCount} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map((filterOption: FilterType) => (
          <a
            key={filterOption}
            href={`#/${filterOption}`}
            className={classNames('filter__link', {
              selected: filter === filterOption,
            })}
            data-cy={`FilterLink${filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}`}
            onClick={() => onFilterChange(filterOption)}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todosCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
