import React from 'react';
import classNames from 'classnames';

import { FilterBy } from '../../types/FilterBy';

type Props = {
  activeTodosLeft: number,
  hasCompletedTodos: boolean,
  filterBy: FilterBy,
  onFilterBy: (filterBy: FilterBy) => void,
  onDeleteCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  activeTodosLeft,
  hasCompletedTodos,
  filterBy,
  onFilterBy,
  onDeleteCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link',
            { selected: filterBy === FilterBy.ALL })}
          onClick={() => onFilterBy(FilterBy.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link',
            { selected: filterBy === FilterBy.ACTIVE })}
          onClick={() => onFilterBy(FilterBy.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link',
            { selected: filterBy === FilterBy.COMPLETED })}
          onClick={() => onFilterBy(FilterBy.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onDeleteCompletedTodos}
      >
        {hasCompletedTodos && 'Clear completed'}
      </button>
    </footer>
  );
};
