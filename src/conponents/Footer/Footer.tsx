import React from 'react';
import { Status } from '../../types/Status';

interface Props {
  selectedFilter: Status;
  setSelectedFilter: (filterBy: Status) => void;
  deleteAllCompleted: () => void;
  hasActiveTodosCount: number;
  hasCompletedTodos: boolean;
}

export const Footer: React.FC<Props> = ({
  selectedFilter,
  setSelectedFilter,
  deleteAllCompleted,
  hasActiveTodosCount,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${hasActiveTodosCount} ${hasActiveTodosCount === 1 ? 'item' : 'items'} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${selectedFilter === Status.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedFilter(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${selectedFilter === Status.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedFilter(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${selectedFilter === Status.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedFilter(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={deleteAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
