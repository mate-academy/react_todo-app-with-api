import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../../types/Filtertype';

type Props = {
  filterType: FilterType;
  setFilterType: (type: FilterType) => void;
};

export const Filter: React.FC<Props> = ({
  filterType,
  setFilterType,
}) => {
  const arrFilterType = [{
    data: 'FilterLinkAll',
    href: '#/',
    type: FilterType.all,
    text: 'All',
  }, {
    data: 'FilterLinkActive',
    href: '#/active',
    type: FilterType.active,
    text: 'Active',
  }, {
    data: 'FilterLinkCompleted',
    href: '#/completed',
    type: FilterType.completed,
    text: 'Completed',
  }];

  return (
    <nav className="filter" data-cy="Filter">
      {arrFilterType.map(filter => (
        <a
          key={filter.text}
          data-cy={filter.data}
          href={filter.href}
          className={classNames('filter__link',
            { selected: filter.type === filterType })}
          onClick={() => setFilterType(filter.type)}
        >
          {filter.text}
        </a>
      ))}
    </nav>
  );
};
