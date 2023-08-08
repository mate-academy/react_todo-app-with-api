import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../../types/FilterType';

interface Props {
  todosCount: number;
  completedCount: number;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todosCount,
  completedCount,
  filter,
  setFilter,
  onClearCompleted,
}) => {
  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const activeTodosCount = todosCount - completedCount;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === 'all',
          })}
          onClick={() => handleFilterChange('all')}
        >
          All
        </a>
        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'active',
          })}
          onClick={() => handleFilterChange('active')}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'completed',
          })}
          onClick={() => handleFilterChange('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{
          visibility: (completedCount === 0) ? 'hidden' : 'visible',
        }}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
