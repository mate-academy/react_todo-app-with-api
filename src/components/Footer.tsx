import React from 'react';
import classNames from 'classnames';

interface FooterProps {
  remainingCount: number;
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  onClearCompleted: () => void;
  hasCompletedTodos: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  remainingCount,
  currentFilter,
  onFilterChange,
  onClearCompleted,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${remainingCount} items left`}
      </span>
      <nav className="filter" data-cy="Filter">
        {['All', 'Active', 'Completed'].map(option => (
          <a
            key={option}
            href="#/"
            className={classNames('filter__link', {
              selected: currentFilter === option,
            })}
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
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
