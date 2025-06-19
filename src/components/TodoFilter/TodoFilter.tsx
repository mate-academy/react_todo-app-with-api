import React from 'react';
import { FilterType, FilterTypeValues } from '../../types/FilterType';
import cn from 'classnames';

interface Props {
  filter: FilterTypeValues;
  setFilter: (filter: FilterTypeValues) => void;
}

export const TodoFilter: React.FC<Props> = ({ filter, setFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.entries(FilterType).map(([text, value]) => (
        <a
          key={value}
          href="#/"
          className={cn('filter__link', {
            selected: filter === value,
          })}
          data-cy={`FilterLink${text}`}
          onClick={() => setFilter(value)}
        >
          {text}
        </a>
      ))}
    </nav>
  );
};
