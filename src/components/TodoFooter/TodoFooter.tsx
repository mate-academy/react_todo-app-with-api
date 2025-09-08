import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
type Props = {
  filter: string;
  todos: Todo[];
  handleFilter: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  handleDeleteAllCompletedTodos: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void;
};

export const TodoFooter: React.FC<Props> = React.memo(function TodoFooter({
  filter,
  todos,
  handleFilter,
  handleDeleteAllCompletedTodos,
}) {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {/* eslint-disable-next-line */}
        {todos.filter(todo => !todo.completed && !todo.isTemp).length} items
        left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', { selected: filter === '' })}
          data-cy="FilterLinkAll"
          onClick={handleFilter}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === 'active',
          })}
          data-cy="FilterLinkActive"
          onClick={handleFilter}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === 'completed',
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleFilter}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleDeleteAllCompletedTodos}
        disabled={todos.every(todo => !todo.completed)}
      >
        Clear completed
      </button>
    </footer>
  );
});
