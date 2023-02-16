import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  status: Status,
  setStatus: (status: Status) => void,
  clearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  status,
  setStatus,
  todos,
  clearCompleted,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: status === 'all',
          })}
          onClick={() => setStatus('all')}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: status === 'active',
          })}
          onClick={() => setStatus('active')}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: status === 'completed',
          })}
          onClick={() => setStatus('completed')}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
