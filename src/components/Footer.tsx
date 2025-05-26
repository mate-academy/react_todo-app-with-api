import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

interface FooterProps {
  activeCount: Todo[];
  completedTodos: Todo[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  handleDeleteCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeCount,
  completedTodos,
  filter,
  setFilter,
  handleDeleteCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            filter === Filter.All && 'selected',
          )}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            filter === Filter.Active ? 'filter__link selected' : 'filter__link'
          }
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            filter === Filter.Completed
              ? 'filter__link selected'
              : 'filter__link'
          }
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteCompleted}
        disabled={!completedTodos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
