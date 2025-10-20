import React from 'react';
import { StatusFilter } from '../../App';

interface FilterProps {
  statusFilter: StatusFilter;
  setStatusFilter: (filter: StatusFilter) => void;
}

export const Filter: React.FC<FilterProps> = ({
  statusFilter,
  setStatusFilter,
}) => {
  const filters = [
    { key: StatusFilter.All, label: 'All' },
    { key: StatusFilter.Active, label: 'Active' },
    { key: StatusFilter.Completed, label: 'Completed' },
  ];

  return (
    <ul className="filter" data-cy="Filter">
      {filters.map(({ key, label }) => (
        <li key={key}>
          <a
            href={`#/${key}`}
            className={`filter__link ${statusFilter === key ? 'selected' : ''}`}
            data-cy={`FilterLink${label}`}
            onClick={e => {
              e.preventDefault();
              setStatusFilter(key);
            }}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
};
