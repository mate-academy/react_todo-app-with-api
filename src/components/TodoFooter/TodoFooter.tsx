import React from 'react';
import cn from 'classnames';

import { FilterStatus } from '../../types';

type Props = {
  haveTodos: boolean;
  activeTodosCount: number;
  filter: FilterStatus;
  setFilter: (value: FilterStatus) => void;
  completedTodosCount: number;
  handleClearCompleted: () => void;
};

export const TodoFooter: React.FC<Props> = ({
  haveTodos,
  activeTodosCount,
  filter,
  setFilter,
  completedTodosCount,
  handleClearCompleted,
}) => {
  return (
    <footer
      className={cn('todoapp__footer', { hidden: !haveTodos })}
      data-cy="Footer"
    >
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(FilterStatus).map(status => (
          <a
            key={status}
            href={`#/${status}`}
            className={cn('filter__link', {
              selected: filter === status,
            })}
            onClick={() => setFilter(status)}
            data-cy={`FilterLink${status}`}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
