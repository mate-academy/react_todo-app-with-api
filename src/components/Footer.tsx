import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { SelectStatus } from '../types/SelectStatus';

type Props = {
  todosFromServer: Todo[],
  selectedStatus: string,
  setSelectedStatus: (value: SelectStatus) => void;
  deleteCompletedTodos: () => void,
  allCompletedTodos: Todo[],
  allActiveTodos: Todo[],
};

export const Footer: React.FC<Props> = ({
  todosFromServer,
  selectedStatus,
  setSelectedStatus,
  deleteCompletedTodos,
  allCompletedTodos,
  allActiveTodos,
}) => {
  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${todosFromServer.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === SelectStatus.All },
          )}
          onClick={() => setSelectedStatus(SelectStatus.All)}
        >
          {SelectStatus.All}
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === SelectStatus.Active },
          )}
          onClick={() => {
            if (allActiveTodos.length > 0) {
              setSelectedStatus(SelectStatus.Active);
            } else {
              setSelectedStatus(SelectStatus.All);
            }
          }}
        >
          {SelectStatus.Active}
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: selectedStatus === SelectStatus.Completed },
          )}
          onClick={() => {
            if (allCompletedTodos.length > 0) {
              setSelectedStatus(SelectStatus.Completed);
            } else {
              setSelectedStatus(SelectStatus.All);
            }
          }}
        >
          {SelectStatus.Completed}
        </a>
      </nav>

      <button
        type="button"
        className={classNames(
          'todoapp__clear-completed',
          { 'is-invisible': !allCompletedTodos },
        )}
        onClick={deleteCompletedTodos}
      >
        Clear completed
      </button>

    </footer>
  );
};
