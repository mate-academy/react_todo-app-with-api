import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

type Props = {
  todos: Todo[];
  activeFilter: string;
  onFilterChange: (filter: Status) => void;
  deleteUncompletedtodos: () => void;
};

export const TodoFilter: React.FC<Props> = ({
  todos,
  activeFilter,
  onFilterChange,
  deleteUncompletedtodos,
}) => {
  const completedTodos = todos.filter(todo => !todo.completed).length;

  return (
    <>
      <span className="todo-count" data-cy="TodosCounter">
        { completedTodos === 1
          ? `${completedTodos} item left`
          : `${completedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: activeFilter === Status.All })}
          data-cy="FilterLinkAll"
          onClick={() => onFilterChange(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: activeFilter === Status.Active })}
          data-cy="FilterLinkActive"
          onClick={() => onFilterChange(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: activeFilter === Status.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={() => onFilterChange(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={deleteUncompletedtodos}
      >
        Clear completed
      </button>
    </>
  );
};
