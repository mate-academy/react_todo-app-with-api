import React from 'react';
import cn from 'classnames';
import { FilterStatus } from '../../types/FilterStatus';
import { useTodos } from '../TodosProvider';

export const Filter: React.FC = () => {
  const { filterStatus, setFilterStatus } = useTodos();

  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FilterStatus).map(status => (
        <a
          key={status}
          href={`#/${status}`}
          className={cn('filter__link', {
            selected: filterStatus === status,
          })}
          data-cy={`FilterLink${status}`}
          onClick={() => setFilterStatus(status as FilterStatus)}
        >
          {status}
        </a>
      ))}
    </nav>
  );
};
