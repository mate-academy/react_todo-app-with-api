import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../App';

type Props = {
  activeTodos: Todo[];
  completedTodos: boolean;
  status: Status;
  setStatus: (v: Status) => void;
  clearCompleted: () => void;
  handleSetDelete: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodos,
  completedTodos,
  status,
  setStatus,
  clearCompleted,
  handleSetDelete,
}) => {
  const statuses = Object.values(Status);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos.length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {statuses.map(statusValue => (
          <a
            key={statusValue}
            href={`#/${statusValue === 'all' ? '' : statusValue}`}
            className={classNames('filter__link', {
              selected: status === statusValue,
            })}
            data-cy={`FilterLink${statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}`}
            onClick={() => setStatus(statusValue)}
          >
            {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={completedTodos}
        data-cy="ClearCompletedButton"
        onClick={() => {
          handleSetDelete();
          clearCompleted();
        }}
      >
        Clear completed
      </button>
    </footer>
  );
};
