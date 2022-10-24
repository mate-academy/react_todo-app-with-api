import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  filteredType: number,
  completedTodos: Todo[],
  notCompletedTodos: Todo[],
  setFilteredType: (value: number) => void,
  handleClearCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = React.memo(
  ({
    filteredType,
    completedTodos,
    notCompletedTodos,
    setFilteredType,
    handleClearCompletedTodos,
  }) => {
    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {`${notCompletedTodos.length} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          <a
            data-cy="FilterLinkAll"
            href="#/"
            className={classNames(
              'filter__link',
              { selected: filteredType === FilterType.All },
            )}
            onClick={() => setFilteredType(FilterType.All)}
          >
            All
          </a>

          <a
            data-cy="FilterLinkActive"
            href="#/active"
            className={classNames(
              'filter__link',
              { selected: filteredType === FilterType.Active },
            )}
            onClick={() => setFilteredType(FilterType.Active)}
          >
            Active
          </a>
          <a
            data-cy="FilterLinkCompleted"
            href="#/completed"
            className={classNames(
              'filter__link',
              { selected: filteredType === FilterType.Completed },
            )}
            onClick={() => setFilteredType(FilterType.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompletedTodos}
        >
          {completedTodos.length > 0 && 'Clear completed'}
        </button>
      </footer>
    );
  },
);
