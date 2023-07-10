import React from 'react';
import classNames from 'classnames';
import { FilterBy } from '../types/FilterBy';

type Props = {
  todosLeft: number;
  filterBy: FilterBy;
  setFilterBy: (value: FilterBy) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todosLeft,
  filterBy,
  setFilterBy,
  handleClearCompleted,
}) => (
  <footer className="todoapp__footer">
    <span className="todo-count">
      {todosLeft}
      {' '}
      items left
    </span>

    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link',
          { selected: filterBy === FilterBy.ALL })}
        onClick={() => setFilterBy(FilterBy.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link',
          { selected: filterBy === FilterBy.ACTIVE })}
        onClick={() => setFilterBy(FilterBy.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link',
          { selected: filterBy === FilterBy.COMPLETED })}
        onClick={() => setFilterBy(FilterBy.COMPLETED)}
      >
        Completed
      </a>
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      onClick={() => handleClearCompleted()}
    >
      Clear completed
    </button>
  </footer>
);
