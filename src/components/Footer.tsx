import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  status: Status
  setStatus: (sortBy: Status) => void,
  clearCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  status,
  todos,
  setStatus,
  clearCompletedTodos,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {activeTodosCount === 1 ? `${activeTodosCount} item left` : `${activeTodosCount} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: status === Status.All },
          )}
          onClick={() => setStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: status === Status.Active },
          )}
          onClick={() => setStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: status === Status.Completed },
          )}
          onClick={() => setStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        onClick={() => clearCompletedTodos()}
        className={classNames('todoapp__clear-completed')}
        hidden={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
