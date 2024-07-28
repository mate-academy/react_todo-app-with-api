import React from 'react';
import classNames from 'classnames';
import { Status } from '../separate/Status';
import { Todo } from '../types/Todo';

export type Props = {
  filter: Status;
  todos: Todo[];
  statusChange: (newStatus: Status) => void;
  handleClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  filter,
  todos,
  statusChange,
  handleClearCompleted,
}) => {
  const completedTodos = todos.filter(todo => todo.completed).length;
  const avtiveTodos = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {avtiveTodos} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {Object.values(Status).map(value => (
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            data-cy={`FilterLink${value}`}
            onClick={event => {
              event.preventDefault();
              statusChange(value);
            }}
            key={value}
          >
            {value}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!completedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
