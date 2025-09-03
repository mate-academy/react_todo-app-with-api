import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  activeTodos: Todo[];
  completedTodos: Todo[];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<"all" | "active" | "completed">>
  handleClearAllCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  activeTodos,
  completedTodos,
  filter,
  setFilter,
  handleClearAllCompleted,
}) => {
  if (todos.length === 0) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('all')}
        >
          All
        </a>
        <a
          href="#/active"
          className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('active')}
        >
          Active
        </a>
        <a
          href="#/completed"
          className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={handleClearAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
