import React, { useContext } from 'react';
import cn from 'classnames';

import { Status } from '../../types/FilterStatus';
import { TodosContext } from '../../TodosContext';

type Props = {
  filterParam: Status,
  onFilterChange: (value: Status) => void,
};

export const Footer: React.FC<Props> = ({ filterParam, onFilterChange }) => {
  const {
    todos,
    uncompletedTodosAmount,
    removeTodo,
  } = useContext(TodosContext);

  const clearAllCompleted = () => {
    const removePromises = todos
      .filter(todo => todo.completed)
      .map(todo => removeTodo(todo.id));

    Promise.all(removePromises);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodosAmount === 1
          ? '1 item left'
          : `${uncompletedTodosAmount} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterParam === Status.All,
          })}
          onClick={() => onFilterChange(Status.All)}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterParam === Status.Active,
          })}
          onClick={() => onFilterChange(Status.Active)}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterParam === Status.Completed,
          })}
          onClick={() => onFilterChange(Status.Completed)}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className={cn('todoapp__clear-completed', {
          'is-invisible': uncompletedTodosAmount === todos.length,
        })}
        data-cy="ClearCompletedButton"
        disabled={uncompletedTodosAmount === todos.length}
        onClick={clearAllCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
