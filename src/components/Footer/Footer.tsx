import React from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';

type Props = {
  todos: Todo[],
  status: Status,
  setStatus: (status: Status) => void,
  deleteCompletedTodos: (todos: Todo[]) => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  deleteCompletedTodos,
}) => {
  const completedTodo = (todos.filter(todo => todo.completed));

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todos.filter(todo => !todo.completed).length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: status === Status.ALL },
          )}
          onClick={() => {
            setStatus(Status.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: status === Status.ACTIVE },
          )}
          onClick={() => {
            setStatus(Status.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: status === Status.COMPLETED },
          )}
          onClick={() => {
            setStatus(Status.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { hidden: todos.every(todo => !todo.completed) },
        )}
        onClick={() => deleteCompletedTodos(completedTodo)}
      >
        Clear completed
      </button>
    </footer>
  );
};
