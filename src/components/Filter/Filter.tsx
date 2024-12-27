import { FC } from 'react';
import cn from 'classnames';
import { FilterOption } from '../../types';
import { getFilterLink } from '../../utils';

type Props = {
  filterOption: FilterOption;
  onFilter: (option: FilterOption) => void;
};

const filterOptionsArray = Object.values(FilterOption);

export const Filter: FC<Props> = ({ filterOption, onFilter }) => {
  return (
    <nav className="filter" data-cy="Filter">
      {filterOptionsArray.map(option => {
        return (
          <a
            key={option}
            data-cy={`FilterLink${option}`}
            href={getFilterLink(option)}
            className={cn('filter__link', {
              selected: filterOption === option,
            })}
            onClick={() => onFilter(option)}
          >
            {option}
          </a>
        );
      })}
    </nav>
  );
};
