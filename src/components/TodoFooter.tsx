import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

import { FilterQuery } from '../App';

interface TodoFooterProps {
  itemsLeft: Todo[];
  query: FilterQuery;
  setQuery: (query: FilterQuery) => void;
  clearCompleted: () => void;
  visibleTodos: Todo[];
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  itemsLeft,
  query,
  setQuery,
  clearCompleted,
  visibleTodos,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {itemsLeft.length} items left
    </span>
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: query === FilterQuery.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setQuery(FilterQuery.All)}
      >
        All
      </a>
      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: query === FilterQuery.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setQuery(FilterQuery.Active)}
      >
        Active
      </a>
      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: query === FilterQuery.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setQuery(FilterQuery.Completed)}
      >
        Completed
      </a>
    </nav>
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={clearCompleted}
      disabled={!visibleTodos.find(todo => todo.completed === true)}
    >
      Clear completed
    </button>
  </footer>
);
