import { FC } from 'react';
import cn from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  filter: FilterType;
  currentFilter: FilterType
  selectFilter: (filterType: FilterType) => void;
};

export const Filter: FC<Props> = ({
  filter,
  currentFilter,
  selectFilter,
}) => {
  return (
    <a
      data-cy={`FilterLink${filter}`}
      href={`#/${filter}`}
      className={cn('filter__link', {
        selected: currentFilter === filter,
      })}
      onClick={() => selectFilter(filter)}
    >
      {filter}
    </a>
  );
};
