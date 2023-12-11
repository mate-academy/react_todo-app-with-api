import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../types/Enums';

type Props = {
  filter: (filter: FilterBy) => void,
  filterValue: string,
  completedTodos: number,
  uncompletedTodos: number,
  handleMultipleDelete: () => void;
};

export const Footer: React.FC<Props> = React.memo(({
  filter,
  filterValue,
  completedTodos,
  uncompletedTodos,
  handleMultipleDelete,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodos === 1 ? (
          // would make item but test doesnt allow
          `${uncompletedTodos} items left`
        ) : (
          `${uncompletedTodos} items left`
        )}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn(
            'filter__link', { selected: filterValue === 'all' },
          )}
          data-cy="FilterLinkAll"
          onClick={() => filter(FilterBy.all)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link', { selected: filterValue === 'active' },
          )}
          data-cy="FilterLinkActive"
          onClick={() => filter(FilterBy.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link', { selected: filterValue === 'completed' },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => filter(FilterBy.completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos}
        onClick={() => {
          handleMultipleDelete();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
});
