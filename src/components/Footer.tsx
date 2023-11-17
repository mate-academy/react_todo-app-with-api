import React, { useContext } from 'react';
import { FilterBy, TodosContext } from '../TodoContext';

export const Footer: React.FC = () => {
  const {
    allTodos,
    activeTodos,
    handleFilterClick,
    filterBy,
    clearCompleted,
    completedTodos,
  } = useContext(TodosContext);

  if (allTodos.length > 0) {
    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${activeTodos.length} items left`}
        </span>
        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={`filter__link ${filterBy === 'all' ? 'selected' : ''}`}
            data-cy="FilterLinkAll"
            onClick={handleFilterClick(FilterBy.All)}
          >
            All
          </a>

          <a
            href="#/"
            className={`filter__link ${filterBy === 'active' ? 'selected' : ''}`}
            data-cy="FilterLinkActive"
            onClick={handleFilterClick(FilterBy.Active)}
          >
            Active
          </a>

          <a
            href="#/"
            className={`filter__link ${filterBy === 'completed' ? 'selected' : ''}`}
            data-cy="FilterLinkCompleted"
            onClick={handleFilterClick(FilterBy.Completed)}
          >
            Completed
          </a>
        </nav>
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompleted}
          disabled={completedTodos.length === 0}
        >
          Clear completed
        </button>
      </footer>
    );
  }

  return null;
};
