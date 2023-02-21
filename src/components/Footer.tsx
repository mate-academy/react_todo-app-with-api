import React from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';

type Props = {
  itemsLeft: number,
  filterByStatus: string,
  setFilterByStatus: React.Dispatch<React.SetStateAction<Status>>,
  areTodosCompleted: boolean,
  clearCompleted: () => void,
};

export const Footer: React.FC<Props> = ({
  itemsLeft,
  filterByStatus,
  setFilterByStatus,
  areTodosCompleted,
  clearCompleted,
}) => {
  const setFilterStatus = (status: Status) => () => {
    setFilterByStatus(status);
  };

  const clearCompletedTodos = () => clearCompleted();

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterByStatus === Status.All },
          )}
          onClick={setFilterStatus(Status.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterByStatus === Status.Active },
          )}
          onClick={setFilterStatus(Status.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterByStatus === Status.Completed },
          )}
          onClick={setFilterStatus(Status.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        style={{ visibility: areTodosCompleted ? 'visible' : 'hidden' }}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
