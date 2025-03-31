import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { FilterValue } from '../types/Filters';

type Props = {
  setFilter: (filter: FilterValue) => void;
  filter: FilterValue;
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
          selected: filter === FilterValue.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilter(FilterValue.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === FilterValue.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilter(FilterValue.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === FilterValue.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilter(FilterValue.Completed)}
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
