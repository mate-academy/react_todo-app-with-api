import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';

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

type Props = {
  filter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
};

export const TodoFilter: React.FC<Props> = ({ filter, onFilterChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {filterOptions.map(({ status, label, href, dataCy }) => (
        <a
          key={status}
          href={href}
          className={classNames('filter__link', {
            selected: filter === status,
          })}
          data-cy={dataCy}
          onClick={() => onFilterChange(status)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
};
