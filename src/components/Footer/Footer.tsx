import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todosLength: number;
  tempTodo: Todo | null;
  activeTodos: number;
  completedTodosCount: number;
  filter: string;

  onFilterChange: (value: 'all' | 'active' | 'completed') => void;

  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todosLength,
  tempTodo,
  activeTodos,
  completedTodosCount,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    (todosLength || tempTodo) && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodos} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
            onClick={() => onFilterChange('all')}
            data-cy="FilterLinkAll"
          >
            All
          </a>

          <a
            href="#/active"
            className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
            onClick={() => onFilterChange('active')}
            data-cy="FilterLinkActive"
          >
            Active
          </a>

          <a
            href="#/completed"
            className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
            onClick={() => onFilterChange('completed')}
            data-cy="FilterLinkCompleted"
          >
            Completed
          </a>
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={!completedTodosCount}
          onClick={onClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    )
  );
};
