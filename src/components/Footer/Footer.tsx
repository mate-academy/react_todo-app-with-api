import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  filterType: FilterType,
  setFilterType: (filter: FilterType) => void,
  completedTodos: Todo[];
  activeTodosLength: number;
  removeCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  activeTodosLength,
  filterType,
  setFilterType,
  completedTodos,
  removeCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosLength} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={
            classNames('filter__link', {
              selected: filterType === FilterType.All,
            })
          }
          onClick={() => setFilterType(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            classNames('filter__link', {
              selected: filterType === FilterType.Active,
            })
          }
          onClick={() => setFilterType(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            classNames('filter__link', {
              selected: filterType === FilterType.Completed,
            })
          }
          onClick={() => setFilterType(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed',
          { 'is-invisible': !completedTodos.length })}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
