import React, { memo, useMemo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterCondition } from '../../types/enums';

type Props = {
  todos: Todo[],
  statusFilter: FilterCondition,
  setStatusFilter: (value: FilterCondition) => void,
  deleteCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = memo(({
  todos,
  statusFilter,
  setStatusFilter,
  deleteCompletedTodos,
}) => {
  const uncompletedTodo = useMemo(() => (
    todos.filter(todo => todo.completed === false)), [todos]);

  const isSomeCompleted = useMemo(() => (
    todos.some(todo => todo.completed)), [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${uncompletedTodo.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link',
            {
              selected: statusFilter === FilterCondition.ALL,
            })}
          onClick={() => setStatusFilter(FilterCondition.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link',
            {
              selected: statusFilter === FilterCondition.ACTIVE,
            })}
          onClick={() => setStatusFilter(FilterCondition.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link',
            {
              selected: statusFilter === FilterCondition.COMPLETED,
            })}
          onClick={() => setStatusFilter(FilterCondition.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {isSomeCompleted && (
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
