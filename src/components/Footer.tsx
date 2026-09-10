import React from 'react';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  activeCount: number;
  filter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  onClearCompleted: () => void;
  hasCompletedTodos: boolean;
};

const filterOptions = [
  {
    status: FilterStatus.All,
    label: 'All',
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    status: FilterStatus.Active,
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    status: FilterStatus.Completed,
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  activeCount,
  filter,
  onFilterChange,
  onClearCompleted,
  hasCompletedTodos,
}) => {
  const handleFilterClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    status: FilterStatus,
  ) => {
    event.preventDefault();
    onFilterChange(status);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(({ status, label, href, dataCy }) => (
          <a
            key={status}
            href={href}
            className={`filter__link ${filter === status ? 'selected' : ''}`}
            data-cy={dataCy}
            onClick={e => handleFilterClick(e, status)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
