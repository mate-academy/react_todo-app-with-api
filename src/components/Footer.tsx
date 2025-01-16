import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

interface FooterProps {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  activeTodosCount: number;
  completedTodosCount: number;
  handleClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  filter,
  setFilter,
  activeTodosCount,
  completedTodosCount,
  handleClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      {Object.values(Filter).map(filterType => (
        <a
          key={filterType}
          href={`#/${filterType}`}
          className={classNames('filter__link', {
            selected: filter === filterType,
          })}
          data-cy={`FilterLink${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`}
          onClick={() => setFilter(filterType)}
        >
          {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={completedTodosCount === 0}
      onClick={handleClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
