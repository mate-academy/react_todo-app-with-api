import React from 'react';
import cn from 'classnames';
import { Filters } from '../types/Filters';
import { Todo } from '../types/Todo';

interface Props {
  currentFilter: Filters;
  onFilterChange: (filter: Filters) => void;
  todos: Todo[];
  activeTodosCount: number;
  onClearCompleted: () => void;
}

export const TodoFilter: React.FC<Props> = ({
  currentFilter,
  onFilterChange,
  todos,
  activeTodosCount,
  onClearCompleted,
}) => {
  const completedTodosCount = todos.length - activeTodosCount;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: currentFilter === Filters.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(Filters.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: currentFilter === Filters.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: currentFilter === Filters.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompleted}
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
