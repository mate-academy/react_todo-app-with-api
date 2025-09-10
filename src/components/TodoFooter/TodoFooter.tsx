import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  filterBy: Filter;
  setFilterBy: (filter: Filter) => void;
  activeTodosCount: number;
  completedTodosCount: number;
  onClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  filterBy,
  setFilterBy,
  activeTodosCount,
  completedTodosCount,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {activeTodosCount} items left
    </span>
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterBy === Filter.All,
        })}
        data-cy="FilterLinkAll"
        onClick={() => setFilterBy(Filter.All)}
      >
        All
      </a>
      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterBy === Filter.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={() => setFilterBy(Filter.Active)}
      >
        Active
      </a>
      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterBy === Filter.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={() => setFilterBy(Filter.Completed)}
      >
        Completed
      </a>
    </nav>
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={completedTodosCount === 0}
      onClick={onClearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
