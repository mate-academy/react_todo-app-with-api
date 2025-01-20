import React, { Dispatch, SetStateAction } from 'react';
import { TodoFilter } from '../../types/TodoFilter';

interface TodoFilterProps {
  filterType: string;
  deleteCompletedTodos: () => void;
  onFilterChange: Dispatch<SetStateAction<TodoFilter>>;
  todosLeft: number;
  completedTodos: number;
}

export const TodoFooter: React.FC<TodoFilterProps> = ({
  filterType,
  deleteCompletedTodos,
  onFilterChange,
  todosLeft,
  completedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filterType === 'All' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(TodoFilter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filterType === 'Active' ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(TodoFilter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filterType === 'Completed' ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(TodoFilter.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => deleteCompletedTodos()}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
