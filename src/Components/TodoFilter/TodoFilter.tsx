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
  const filterOptions = Object.keys(FilterOption);

  return (
    <nav className="filter">
      {filterOptions.map((option) => {
        const filterOptionKey = option as keyof typeof FilterOption;
        const selectedOption = FilterOption[filterOptionKey];

        return (
          <a
            key={option}
            href={`#/${option}`}
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
