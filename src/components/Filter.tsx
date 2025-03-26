import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  setFilter: (filter: string) => void;
  filter: string;
  todos: Todo[];
  handleDelete: (id: number | undefined) => void;
  activeCount: number;
};

export const Filter: React.FC<Props> = ({
  setFilter,
  filter,
  todos,
  handleDelete,
  activeCount,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeCount} items left`}
    </span>

    {/* Active link should have the 'selected' class */}
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filter === 'all',
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === 'active',
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilter('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === 'completed',
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter('completed')}
      >
        Completed
      </a>
    </nav>

    {/* this button should be disabled if there are no completed todos */}
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={() => handleDelete(undefined)}
      disabled={activeCount === todos.length}
    >
      Clear completed
    </button>
  </footer>
);
