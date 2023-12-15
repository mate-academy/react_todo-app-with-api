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
        {status === 'completed' ? (
          `${completedTodos.length} items left`
        ) : (
          `${activeTodos.length} items left`
        )}
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

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
        )}
        onClick={clearCompleted}
        style={{
          visibility: completedTodos.length
            ? ('visible')
            : ('hidden'),
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
