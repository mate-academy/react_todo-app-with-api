import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  activeCount: number;
  completedTodos: number;
  filter: FilterStatus;
  onFilterChange: (option: FilterStatus) => void;
  onDeleteCompletedTodo: () => void;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  completedTodos,
  filter,
  onFilterChange,
  onDeleteCompletedTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.All,
          })}
          onClick={e => {
            e.preventDefault();
            onFilterChange(FilterStatus.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.Active,
          })}
          onClick={e => {
            e.preventDefault();
            onFilterChange(FilterStatus.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: filter === FilterStatus.Completed,
          })}
          onClick={e => {
            e.preventDefault();
            onFilterChange(FilterStatus.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeleteCompletedTodo}
        disabled={completedTodos === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
