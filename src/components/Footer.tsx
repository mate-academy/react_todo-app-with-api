import classNames from 'classnames';
import React from 'react';

import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  filterBy: Filter;
  onFilterChange: (newFilter: Filter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterBy,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterBy === Filter.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterBy === Filter.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterBy === Filter.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.every(todo => !todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
