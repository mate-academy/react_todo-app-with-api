import React from 'react';
import { FilterType } from '../types/FilterType';

type Props = {
  activeCount: number;
  filter: FilterType;
  hasCompleted: boolean;
  setFilter: (filter: FilterType) => void;
  onClearCompleted: () => void;
};

const FILTER_CONFIG = [
  {
    type: FilterType.All,
    href: '#/',
    label: 'All',
    dataCy: 'FilterLinkAll',
  },
  {
    type: FilterType.Active,
    href: '#/active',
    label: 'Active',
    dataCy: 'FilterLinkActive',
  },
  {
    type: FilterType.Completed,
    href: '#/completed',
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const Footer: React.FC<Props> = ({
  activeCount,
  filter,
  hasCompleted,
  setFilter,
  onClearCompleted,
}) => {
  //#region handles
  const handleFilter =
    (filterParam: FilterType) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setFilter(filterParam);
    };
  //#endregion

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} {activeCount === 1 ? 'item' : 'items'} left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_CONFIG.map(({ type, href, label, dataCy }) => (
          <a
            key={type}
            href={href}
            data-cy={dataCy}
            className={`filter__link ${filter === type ? 'selected' : ''}`}
            onClick={handleFilter(type)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        disabled={!hasCompleted}
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
