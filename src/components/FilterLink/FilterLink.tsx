import React from 'react';
import cn from 'classnames';

import { FilterType } from '../../types';

interface FilterLinkProps {
  type: FilterType;
  filterType: FilterType;
  onChangeType: (type: FilterType) => void;
}

export const FilterLink: React.FC<FilterLinkProps> = ({
  type,
  filterType,
  onChangeType,
}) => {
  const handleClick = () => {
    onChangeType(type);
  };

  return (
    <a
      href={`#/${type.toLowerCase()}`}
      className={cn('filter__link', {
        selected: filterType === type,
      })}
      data-cy={`FilterLink${type}`}
      onClick={handleClick}
    >
      {type}
    </a>
  );
};
