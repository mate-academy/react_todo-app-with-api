import React, { memo } from 'react';
import cn from 'classnames';

import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  activeTodosAmount: number;
  hasCompletedTodos: boolean;
  filterType: FilterStatus;
  onChangeType: React.Dispatch<React.SetStateAction<FilterStatus>>;
  deleteCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = memo((props) => {
  const {
    activeTodosAmount,
    hasCompletedTodos,
    filterType: filterStatus,
    onChangeType,
    deleteCompletedTodos,
  } = props;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosAmount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            { selected: filterStatus === FilterStatus.All },
          )}
          onClick={() => onChangeType(FilterStatus.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filterStatus === FilterStatus.Active },
          )}
          onClick={() => onChangeType(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filterStatus === FilterStatus.Completed },
          )}
          onClick={() => onChangeType(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      {hasCompletedTodos && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={deleteCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
