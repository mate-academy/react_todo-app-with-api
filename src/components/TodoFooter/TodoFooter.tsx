import React from 'react';
import { FilterStatus } from '../../utils/FilterStatus';
import cn from 'classnames';

type TodoFooterProps = {
  activeTodosCount: number;
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  onClearCompleted: () => Promise<void>;
  totalTodos: number;
};

export const TodoFooter: React.FC<TodoFooterProps> = ({
  activeTodosCount,
  filter,
  setFilter,
  onClearCompleted,
  totalTodos,
}) => {
  const hasCompletedTodos = totalTodos - activeTodosCount > 0;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.entries(FilterStatus).map(([key, value]) => (
          <a
            key={key}
            href={`#/${value.toLowerCase()}`}
            className={cn('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={() => {
              setFilter(value);
            }}
          >
            {value}
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
