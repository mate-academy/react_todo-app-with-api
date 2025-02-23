import React from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  status: Status;
  setStatus: (status: Status) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  setStatus,
  onClearCompleted,
}) => {
  const todosLeft = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  const links = Object.entries(Status);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {links.map(([key, value]) => (
          <a
            href={`#/${value === Status.All ? '' : `${value}`}`}
            className={classNames('filter__link', {
              selected: status === value,
            })}
            data-cy={`FilterLink${key}`}
            key={key}
            onClick={() => setStatus(value)}
          >
            {key}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
