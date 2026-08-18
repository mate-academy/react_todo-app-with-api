import React from 'react';

type Filter = 'All' | 'Active' | 'Completed';

interface Props {
  filter: Filter;
  activeTodosCount: number;
  hasCompletedTodos: boolean;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
}

export const TodoFooter: React.FC<Props> = ({
  filter,
  activeTodosCount,
  hasCompletedTodos,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === 'All' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === 'Active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === 'Completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
