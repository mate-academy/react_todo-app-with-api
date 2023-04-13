import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Status } from '../enums/Status';

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
          <a
            href="#/"
            className={classNames(
              'filter__link bg-blue-500 text-white font-bold py-2 px-4 rounded',
              { selected: selectedStatus === Status.All },
            )}
            onClick={() => changeStatus(Status.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames(
              'filter__link',
              { selected: selectedStatus === Status.Active },
            )}
            onClick={() => changeStatus(Status.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames(
              'filter__link',
              { selected: selectedStatus === Status.Completed },
            )}
            onClick={() => changeStatus(Status.Completed)}
          >
            Completed
          </a>
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
