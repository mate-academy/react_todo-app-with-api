import React, { useCallback } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  uncompletedTodos: Todo[];
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  completedTodos: Todo[];
  handleClearAllCompletedTodos: () => Promise<void>;
};

export const Footer: React.FC<Props> = ({
  uncompletedTodos,
  filterStatus,
  setFilterStatus,
  completedTodos,
  handleClearAllCompletedTodos,
}) => {
  const makeSetFilterStatus = useCallback(
    (filter: FilterStatus) => () => setFilterStatus(filter), [],
  );

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">{`${uncompletedTodos?.length} items left`}</span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.ALL,
          })}
          onClick={makeSetFilterStatus(FilterStatus.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.ACTIVE,
          })}
          onClick={makeSetFilterStatus(FilterStatus.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterStatus === FilterStatus.COMPLETED,
          })}
          onClick={makeSetFilterStatus(FilterStatus.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ opacity: completedTodos.length > 0 ? '1' : '0' }}
        disabled={!completedTodos}
        onClick={handleClearAllCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
