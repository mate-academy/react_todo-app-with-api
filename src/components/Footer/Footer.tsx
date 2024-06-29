import classNames from 'classnames';
import React from 'react';
import { Filter } from '../../types/Filter';

interface Props {
  activeTodosQTY: number;
  completedTodosQTY: number;
  selectedFilter: Filter;
  onDeleteCompletedTodos: () => void;
  onFilterSelect: (selectedFilter: Filter) => void;
}

export const Footer: React.FC<Props> = ({
  activeTodosQTY,
  completedTodosQTY,
  selectedFilter,
  onDeleteCompletedTodos,
  onFilterSelect,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosQTY} items left
    </span>

    {/* Active link should have the 'selected' class */}
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: selectedFilter === Filter.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterSelect(Filter.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: selectedFilter === Filter.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterSelect(Filter.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: selectedFilter === Filter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterSelect(Filter.Completed)}
      >
        Completed
      </a>
    </nav>

    {/* this button should be disabled if there are no completed todos */}
    <button
      type="button"
      className="todoapp__clear-completed"
      disabled={!completedTodosQTY}
      data-cy="ClearCompletedButton"
      onClick={onDeleteCompletedTodos}
    >
      Clear completed
    </button>
  </footer>
);
