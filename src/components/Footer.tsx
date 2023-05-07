import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../enums/Status';

const statusOptions = [
  { status: Status.All, label: 'All' },
  { status: Status.Active, label: 'Active' },
  { status: Status.Completed, label: 'Completed' },
];

interface Props {
  todos: Todo[],
  onChangeStatus: React.Dispatch<React.SetStateAction<Status>>,
  selectedStatus: Status,
  onDeleteCompletedTodos: () => void,
}

export const Footer: React.FC<Props> = React.memo(
  ({
    todos,
    onChangeStatus,
    selectedStatus,
    onDeleteCompletedTodos,
  }) => {
    const activeTodos = todos.filter(todo => !todo.completed).length;

    const changeStatus = (newStatus: Status) => {
      onChangeStatus(newStatus);
    };

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodos} items left`}
        </span>

        <nav className="filter">
          {statusOptions.map(({ status, label }) => (
            <a
              key={status}
              href="#/"
              className={classNames(
                'filter__link',
                { selected: selectedStatus === status },
              )}
              onClick={() => changeStatus(status)}
            >
              {label}
            </a>
          ))}
        </nav>

        {todos.length > 0 && (
          <button
            type="button"
            className="todoapp__clear-completed"
            onClick={onDeleteCompletedTodos}
          >
            Clear completed
          </button>
        )}
      </footer>
    );
  },
);
