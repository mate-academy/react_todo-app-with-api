import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/FilterType';

type Props = {
  activeTodosCounter: number;
  completedTodosCounter: number;
  onFilterFieldChange: (filter: FilterType) => void;
  filterField: FilterType;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCounter,
  completedTodosCounter,
  onFilterFieldChange,
  filterField,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCounter} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterField === FilterType.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => onFilterFieldChange(FilterType.All)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterField === FilterType.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => onFilterFieldChange(FilterType.Active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterField === FilterType.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => onFilterFieldChange(FilterType.Completed)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!completedTodosCounter}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
