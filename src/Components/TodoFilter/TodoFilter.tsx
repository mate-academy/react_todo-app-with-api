import { FC } from 'react';
import cn from 'classnames';
import { FilterOption } from '../../enums/FilterOption';

interface Props {
  filterOption: FilterOption;
  setFilterOption: (filterOption: FilterOption) => void;
}

export const TodoFilter: FC<Props> = ({
  filterOption,
  setFilterOption,
}) => {
  const filterOptions = Object.entries(FilterOption);

  return (
    <nav className="filter">
      {filterOptions.map(([key, value]) => {
        const selectedOption = value;

        return (
          <a
            key={key}
            href={`#/${key}`}
            className={cn('filter__link', {
              selected: filterOption === selectedOption,
            })}
            onClick={() => setFilterOption(selectedOption)}
          >
            {selectedOption}
          </a>
        );
      })}
    </nav>
  );
};
