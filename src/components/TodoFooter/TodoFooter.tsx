import React, { useContext, useMemo } from 'react';
import cn from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';

import { TodosContext } from '../../context/todosContext';

type Props = {
  filterStatus: FilterStatus;
  filterTodos: (filterStatus: FilterStatus) => void;
  deleteAllCompletedTodos: () => void;
};

export const TodoFooter: React.FC<Props> = React.memo(
  ({ filterStatus, filterTodos, deleteAllCompletedTodos }) => {
    const todos = useContext(TodosContext);

    const countOfLeftTodos = useMemo(
      () => todos.filter((todo) => !todo.completed).length,
      [todos],
    );

    const hasComplited = useMemo(
      () => todos.some((todo) => todo.completed),
      [todos],
    );

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {`${countOfLeftTodos} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            data-cy="FilterLinkAll"
            href="#/"
            className={cn('filter__link', {
              selected: filterStatus === FilterStatus.All,
            })}
            onClick={() => filterTodos(FilterStatus.All)}
          >
            All
          </a>

          <a
            data-cy="FilterLinkActive"
            href="#/active"
            className={cn('filter__link', {
              selected: filterStatus === FilterStatus.Active,
            })}
            onClick={() => filterTodos(FilterStatus.Active)}
          >
            Active
          </a>
          <a
            data-cy="FilterLinkCompleted"
            href="#/completed"
            className={cn('filter__link', {
              selected: filterStatus === FilterStatus.Completed,
            })}
            onClick={() => filterTodos(FilterStatus.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteAllCompletedTodos}
          disabled={hasComplited}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
