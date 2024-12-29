/* eslint-disable react/display-name */
import React, { memo } from 'react';
import cn from 'classnames';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';

type Props = {
  filter: Status;
  onFilterChange: (newFilter: Status) => void;
  todos: Todo[];
  onDelete: () => void;
};

const STATUSES = [
  { key: Status.All, label: 'All', dataCy: 'FilterLinkAll' },
  { key: Status.Active, label: 'Active', dataCy: 'FilterLinkActive' },
  {
    key: Status.Completed,
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFilter: React.FC<Props> = memo(
  ({ filter, onFilterChange, todos, onDelete }) => {
    const handleLinkClick = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      status: Status,
    ) => {
      e.preventDefault();
      onFilterChange(status);
    };

    const uncompletedTodosCount = todos.reduce((acc, todo) => {
      return todo.completed ? acc : acc + 1;
    }, 0);

    const hasCompleted = todos.some(todo => todo.completed);

    return (
      <>
        <span className="todo-count" data-cy="TodosCounter">
          {`${uncompletedTodosCount} items left`}
        </span>

        <nav className="filter" data-cy="Filter">
          {STATUSES.map(({ key, label, dataCy }) => (
            <a
              key={key}
              href={`#/${key}`}
              data-cy={dataCy}
              onClick={e => handleLinkClick(e, key)}
              className={cn('filter__link', { selected: filter === key })}
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          disabled={!hasCompleted}
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={onDelete}
        >
          Clear completed
        </button>
      </>
    );
  },
);
