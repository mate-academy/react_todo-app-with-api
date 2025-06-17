import React from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { FILTERS } from '../../constants/filters';

type Props = {
  filterField: Filter;
  setFilterField: (filterField: Filter) => void;
};

export const TodoFilter: React.FC<Props> = ({
  filterField,
  setFilterField,
}) => {
  return (
    <nav className="filter" data-cy="Filter">
      {FILTERS.map(({ label, value, href, dataCy }) => {
        return (
          <a
            key={value}
            href={href}
            className={cn('filter__link', {
              selected: filterField === value,
            })}
            data-cy={dataCy}
            onClick={() => setFilterField(value)}
          >
            {label}
          </a>
        );
      })}
    </nav>
  );
};
