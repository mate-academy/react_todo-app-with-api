import React from 'react';
import cn from 'classnames';
import { FilterType } from '../types/FilterType';

type Props = {
  status: FilterType,
  setStatus: (filter: FilterType) => void,
};

const filters = [
  { label: FilterType.All, value: FilterType.All },
  { label: FilterType.Active, value: FilterType.Active },
  { label: FilterType.Completed, value: FilterType.Completed },
];

export const TodoFilter: React.FC<Props> = ({ status, setStatus }) => {
  return (
    <nav className="filter">
      {filters.map((filter) => (
        <a
          key={filter.value}
          href={`#/${filter.value.toLowerCase()}`}
          className={cn('filter__link', {
            selected: status === filter.value,
          })}
          onClick={() => setStatus(filter.value)}
        >
          {filter.label}
        </a>
      ))}
    </nav>
  );
};
