import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

interface Props {
  activeTodosCount: number;
  completedTodosCount: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  clearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filter,
  setFilter,
  clearCompleted,
  completedTodosCount,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {`${activeTodosCount} items left`}
    </span>

    <nav className="filter" data-cy="Filter">
      {(['All', 'Active', 'Completed'] as const).map(item => {
        const filterValue = item.toLowerCase() as Filter;

        return (
          <a
            href={`#/${filterValue}`}
            className={classNames('filter__link', {
              selected: filter === filterValue,
            })}
            onClick={() => setFilter(filterValue)}
            data-cy="FilterLinkAll"
            key={item}
          >
            {item}
          </a>
        );
      })}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={completedTodosCount === 0}
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
