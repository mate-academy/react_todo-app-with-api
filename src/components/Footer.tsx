import React from 'react';
import { Filter } from '../types/Filter';
import classNames from 'classnames';

interface FooterProps {
  activeTodos: number[];
  completedTodos: number[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  handlClearAll: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeTodos,
  completedTodos,
  filter,
  setFilter,
  handlClearAll,
}) => {
  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {activeTodos.length} items left
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filter === Filter.ALL,
            })}
            data-cy="FilterLinkAll"
            onClick={e => {
              e.preventDefault();
              setFilter(Filter.ALL);
            }}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: filter === Filter.ACTIVE,
            })}
            data-cy="FilterLinkActive"
            onClick={e => {
              e.preventDefault();
              setFilter(Filter.ACTIVE);
            }}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: filter === Filter.COMPLETED,
            })}
            data-cy="FilterLinkCompleted"
            onClick={e => {
              e.preventDefault();
              setFilter(Filter.COMPLETED);
            }}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={completedTodos.length === 0}
          onClick={() => {
            handlClearAll();
          }}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
