import React from 'react';
import { FilterType } from '../../App';
import classNames from 'classnames';

interface Props {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  activeTodosCounter: number;
  deleteCompletedTodos: () => Promise<void>;
  hasCompletedTodos: boolean;
}

export const Footer: React.FC<Props> = ({
  filter,
  setFilter,
  activeTodosCounter,
  deleteCompletedTodos,
  hasCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCounter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterType).map(filterValue => (
          <a
            key={filterValue}
            href="#/"
            className={classNames('filter__link', {
              selected: filter === filterValue,
            })}
            data-cy={`FilterLink${filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}`}
            onClick={event => {
              event.preventDefault();
              setFilter(filterValue);
            }}
          >
            {filterValue.charAt(0).toUpperCase() + filterValue.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteCompletedTodos}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
