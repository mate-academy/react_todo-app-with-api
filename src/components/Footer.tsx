import React from 'react';
import classNames from 'classnames';
import { Filters } from '../types/Filters';

type Props = {
  filter: (filter: Filters) => void,
  filterValue: string,
  completedTodos: number,
  uncompletedTodos: number,
  handleDelete: () => void;
};

export const Footer: React.FC<Props> = React.memo(({
  filter,
  filterValue,
  completedTodos,
  uncompletedTodos,
  handleDelete,
}) => {
  const handleMultipleDelete = () => {
    handleDelete();
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodos === 1 ? (
          `${uncompletedTodos} items left`
        ) : (
          `${uncompletedTodos} items left`
        )}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link', { selected: filterValue === 'all' },
          )}
          data-cy="FilterLinkAll"
          onClick={() => filter(Filters.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link', { selected: filterValue === 'active' },
          )}
          data-cy="FilterLinkActive"
          onClick={() => filter(Filters.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link', { selected: filterValue === 'completed' },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => filter(Filters.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodos}
        onClick={handleMultipleDelete}
      >
        Clear completed
      </button>
    </footer>
  );
});
