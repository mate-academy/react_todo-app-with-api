/* eslint-disable react/display-name */
import { memo } from 'react';
import cn from 'classnames';
import { FilterOptions } from '../types/FilterOptions';

interface Props {
  activeFilter: string;
  handleFilterChange: (string: FilterOptions) => void;
}

export const Filter = memo(({ activeFilter, handleFilterChange }: Props) => (
  <nav className="filter" data-cy="Filter">
    {Object.values(FilterOptions).map(option => {
      return (
        <a
          key={option}
          href={`#/${option === 'All' ? '' : option.toLowerCase()}`}
          className={cn('filter__link', {
            selected: activeFilter === option,
          })}
          data-cy={`FilterLink${option}`}
          onClick={() => handleFilterChange(option as FilterOptions)}
        >
          {option}
        </a>
      );
    })}
  </nav>
));
