import cn from 'classnames';
import { Dispatch, SetStateAction } from 'react';

export enum StatusFilterOptions {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

interface StatusFilterProps {
  statusFilter: StatusFilterOptions;
  onStatusFilterChange: Dispatch<SetStateAction<StatusFilterOptions>>;
}

export const StatusFilter = ({
  statusFilter,
  onStatusFilterChange,
}: StatusFilterProps) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(StatusFilterOptions).map(value => (
        <a
          key={value}
          href={`#/${value !== 'all' ? value : ''}`}
          className={cn('filter__link', {
            selected: statusFilter === value,
          })}
          data-cy={`FilterLink${value[0].toUpperCase() + value.slice(1)}`}
          onClick={() => onStatusFilterChange(value)}
        >
          {value[0].toUpperCase() + value.slice(1)}
        </a>
      ))}
    </nav>
  );
};
