import React, { memo } from 'react';
import classNames from 'classnames';
import { FilterTypes } from '../../types/FilterTypes';
import { Todo } from '../../types/Todo';

interface Props {
  uncompletedTodosAmount: number,
  filterType: FilterTypes,
  setFilterType: (filterType: FilterTypes) => void,
  completedTodos: Todo[],
  onDeleteCompletedTodos: () => void,
}

export const Footer: React.FC<Props> = memo((props) => {
  const {
    uncompletedTodosAmount,
    filterType,
    setFilterType,
    completedTodos,
    onDeleteCompletedTodos,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedTodosAmount} item${uncompletedTodosAmount > 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterTypes.All },
          )}
          onClick={() => setFilterType(FilterTypes.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterTypes.Active },
          )}
          onClick={() => setFilterType(FilterTypes.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterTypes.Completed },
          )}
          onClick={() => setFilterType(FilterTypes.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={onDeleteCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
