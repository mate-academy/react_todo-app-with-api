import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type FilterStatus = 'All' | 'Active' | 'Completed';

type Props = {
  activeTodos: Todo[];
  todos: Todo[];
  filter: FilterStatus;
  setFilter: (filter: FilterStatus) => void;
  handleClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodos,
  todos,
  filter,
  setFilter,
  handleClearCompleted,
}) => {
  return (
    <footer
      className="todoapp__footer"
      data-cy="Footer"
    >
      <span
        className="todo-count"
        data-cy="TodosCounter"
      >
        {activeTodos.length} items left
      </span>

      <nav
        className="filter"
        data-cy="Filter"
      >
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === 'All',
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter('All')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === 'Active',
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter('Active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === 'Completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter('Completed')}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
