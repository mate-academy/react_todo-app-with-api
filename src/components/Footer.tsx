import React from 'react';
import { Filter } from '../types/Filter';

type Props = {
  todosLeft: number;
  hasCompleted: boolean;
  currentFilter: Filter;
  setFilter: (f: Filter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todosLeft,
  hasCompleted,
  currentFilter,
  setFilter,
  onClearCompleted,
}) => {
  const filters = [
    {
      label: 'All',
      value: Filter.All,
      href: '#/',
      dataCy: 'FilterLinkAll',
    },
    {
      label: 'Active',
      value: Filter.Active,
      href: '#/active',
      dataCy: 'FilterLinkActive',
    },
    {
      label: 'Completed',
      value: Filter.Completed,
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(filter => (
          <a
            key={filter.value}
            href={filter.href}
            data-cy={filter.dataCy}
            className={`filter__link ${
              currentFilter === filter.value ? 'selected' : ''
            }`}
            onClick={() => setFilter(filter.value)}
          >
            {filter.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
