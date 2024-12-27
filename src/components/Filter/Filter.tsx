import React from 'react';
import cn from 'classnames';
import { FilterSetting } from '../../types/FilterSetting';

type Props = {
  onFilter: (v: FilterSetting) => void;
  filter: FilterSetting;
};

export const Filter: React.FC<Props> = ({ onFilter, filter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {Object.values(FilterSetting).map(value => (
        <a
          key={value}
          href="#/"
          className={cn('filter__link', {
            selected: filter === value,
          })}
          onClick={() => onFilter(value)}
          data-cy={value}
        >
          {value.slice(10)}
        </a>
      ))}
    </nav>
  );
};
