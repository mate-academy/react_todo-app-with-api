import React, { useMemo } from 'react';
import cn from 'classnames';
import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';

interface FooterProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  todos: Todo[];
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentFilter,
  onFilterChange,
  todos,
  onClearCompleted,
}) => {
  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const hasCompletedTodos = useMemo(
    () => todos.some(todo => todo.completed),
    [todos],
  );
  const filterOpions = Object.values(FilterStatus);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOpions.map(filter => (
          <a
            key={filter}
            href={`#/${filter.toLowerCase()}`}
            data-cy={`FilterLink${filter}`}
            className={cn('filter__link', {
              selected: currentFilter === filter,
            })}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
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
