/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
} from 'react';
import cn from 'classnames';
import { TodoContext } from '../../TodoContext';

enum TodoFilter {
  All = 'all',
  Completed = 'completed',
  Active = 'active',
}

export const Footer: React.FC = React.memo(() => {
  const {
    filter,
    nonCompletedTodos,
    existingCompleted,
    setFilter,
    handleCompletedDelete,
  } = useContext(TodoContext);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${nonCompletedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filter === TodoFilter.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilter(TodoFilter.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filter === TodoFilter.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilter(TodoFilter.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filter === TodoFilter.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setFilter(TodoFilter.Completed);
          }}
        >
          Completed
        </a>
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => {
          handleCompletedDelete();
        }}
        disabled={!existingCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
});
