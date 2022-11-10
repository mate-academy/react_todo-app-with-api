import classNames from 'classnames';
import React, { useMemo } from 'react';
import { Status } from '../../../types/Status';
import { Todo } from '../../../types/Todo';

interface Props {
  todos: Todo[];
  selected: string;
  setStatus: (status: Status) => void;
  removeCompleted: (completedTodos: Todo[]) => void;
}

export const Filter: React.FC<Props> = ({
  todos,
  selected,
  setStatus,
  removeCompleted,
}) => {
  const statuses = [Status.All, Status.Active, Status.Completed];

  const getCompletedTodos = () => todos.filter(todo => (
    todo.completed
  ));

  const completedTodos = useMemo(getCompletedTodos, [todos, selected]);

  const filterCompleted = () => (
    removeCompleted(completedTodos)
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length - completedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {statuses.map(status => (
          <a
            key={status}
            data-cy="FilterLinkAll"
            href={`#${status.toLowerCase()}/`}
            className={classNames(
              'filter__link',
              { selected: selected === status },
            )}
            onClick={() => setStatus(status)}
          >
            {status}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'todoapp__clear-completed--hidden': completedTodos.length === 0 },
        )}
        onClick={() => filterCompleted()}
      >
        Clear completed
      </button>

    </footer>
  );
};
