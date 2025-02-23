import React from 'react';
import cn from 'classnames';
import { FILTER } from '../../types/Filter';
import { Todo } from '../../types/Todo';

interface Props {
  selectedStatus: FILTER;
  setSelectedStatus: (filter: FILTER) => void;
  todos: Todo[];
  activeTodosCount: number;
  onClearCompleted: () => void;
}

export const TodoFilter: React.FC<Props> = ({
  selectedStatus,
  setSelectedStatus,
  todos,
  activeTodosCount,
  onClearCompleted,
}) => {
  const completedTodosCount = todos.length - activeTodosCount;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedStatus === FILTER.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedStatus(FILTER.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedStatus === FILTER.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedStatus(FILTER.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedStatus === FILTER.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedStatus(FILTER.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompleted}
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
