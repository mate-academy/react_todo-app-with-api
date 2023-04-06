import React from 'react';
import classnames from 'classnames';
import { FilterType } from '../../types/FilterTypes';
import { Todo } from '../../types/Todo';

type Props = {
  selectedFilter: FilterType;
  activeTodos: Todo[];
  completedTodos: Todo[];
  handleFilterSelect: (filterType: FilterType) => void;
  handleClearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = React.memo(({
  selectedFilter,
  activeTodos,
  completedTodos,
  handleFilterSelect,
  handleClearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>
      <nav className="filter">
        <a
          href="#/"
          className={classnames('filter__link', {
            selected: selectedFilter === FilterType.ALL,
          })}
          onClick={() => {
            handleFilterSelect(FilterType.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classnames('filter__link', {
            selected: selectedFilter === FilterType.ACTIVE,
          })}
          onClick={() => {
            handleFilterSelect(FilterType.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classnames('filter__link', {
            selected: selectedFilter === FilterType.COMPLETED,
          })}
          onClick={() => {
            handleFilterSelect(FilterType.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classnames('todoapp__clear-completed', {
          'is-invisible': !completedTodos.length,
        })}
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>

    </footer>
  );
});
