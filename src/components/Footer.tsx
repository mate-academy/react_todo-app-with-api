import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../hooks/useTodos';

interface FooterProps {
  activeCount: number;
  filterStatus: FilterStatus;
  setFilterStatus: React.Dispatch<React.SetStateAction<FilterStatus>>;
  someCompleted: boolean;
  clearCompleted: () => Promise<void>;
}

export const Footer: React.FC<FooterProps> = ({
  activeCount,
  filterStatus,
  setFilterStatus,
  someCompleted,
  clearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(value => (
          <a
            key={value}
            href="#/"
            className={classNames('filter__link', {
              selected: filterStatus === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => setFilterStatus(value)}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={clearCompleted}
        disabled={!someCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
