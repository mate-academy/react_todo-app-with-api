import React from 'react';
import cn from 'classnames';
import { FilterType } from '../types/FilterTypes';

type Props = {
  unCompletedCount: number;
  filterType: FilterType;
  setFilterType: (filter: FilterType) => void;
  completedTodosCount: number;
  deleteAllCompleted: () => void;
};

const Footer: React.FC<Props> = ({
  unCompletedCount,
  filterType,
  setFilterType,
  completedTodosCount,
  deleteAllCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {unCompletedCount} items left
    </span>

    <nav className="filter" data-cy="Filter">
      {Object.values(FilterType).map(type => (
        <a
          key={type}
          href="#/"
          className={cn('filter__link', {
            selected: type === filterType,
          })}
          data-cy={`FilterLink${type}`}
          onClick={() => setFilterType(type)}
        >
          {type}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={completedTodosCount === 0}
      onClick={deleteAllCompleted}
    >
      Clear completed
    </button>
  </footer>
);

export default Footer;
