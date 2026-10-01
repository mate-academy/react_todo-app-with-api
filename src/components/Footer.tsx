import React from 'react';
import cn from 'classnames';
import { Status, Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  setStatus: (value: Status) => void;
  status: Status;
  handleCleareComplite: () => void;
};

export const Footer = ({
  todos,
  setStatus,
  handleCleareComplite,
  status,
}: Props) => {
  const filters = [
    {
      href: '#/',
      dataCy: 'FilterLinkAll',
      status: Status.All,
      title: 'All',
    },
    {
      href: '#/active',
      dataCy: 'FilterLinkActive',
      status: Status.Active,
      title: 'Active',
    },
    {
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
      status: Status.Completed,
      title: 'Completed',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      {/* Active link should have the 'selected' class */}

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.status}
            href={filter.href}
            className={cn('filter__link', {
              selected: status === filter.status,
            })}
            data-cy={filter.dataCy}
            onClick={() => setStatus(filter.status)}
          >
            {filter.title}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={handleCleareComplite}
      >
        Clear completed
      </button>
    </footer>
  );
};
