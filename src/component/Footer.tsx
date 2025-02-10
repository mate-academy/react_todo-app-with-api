import React from 'react';
import { Todo } from '../types/Todo';
import { Status } from '../types/statys';
import classNames from 'classnames';

interface Props {
  itemLeft: number;
  filter: Status;
  setFilter: (filter: Status) => void;
  todos: Todo[];
  clearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  itemLeft,
  filter,
  setFilter,
  todos,
  clearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {itemLeft} items left
    </span>

    {/* Active link should have the 'selected' class */}
    <nav className="filter" data-cy="Filter">
      {Object.values(Status).map(status => (
        <a
          key={status}
          href={`#/${status.toLowerCase()}`}
          className={classNames('filter__link', {
            selected: filter === status,
          })}
          data-cy={`FilterLink${status.charAt(0).toUpperCase() + status.slice(1)}`}
          onClick={() => setFilter(status)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </a>
      ))}
    </nav>

    {/* this button should be disabled if there are no completed todos */}
    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      disabled={!todos.some(todo => todo.completed)}
      onClick={clearCompleted}
    >
      Clear completed
    </button>
  </footer>
);
