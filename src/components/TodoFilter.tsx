import React from 'react';
import classNames from 'classnames';
import { Filter, FilterType } from '../types/FilterType';
import { MAIN_PHRASES } from '../constants';
import { MainPhrasesKeys } from '../types/Phrases';

interface Props {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const getFilterOptions = () => {
  const filterOptions = Object.entries(Filter).map(([label, value]) => ({
    label,
    translatedLabel: MAIN_PHRASES[`filter${label}` as MainPhrasesKeys],
    value,
    href: value === Filter.All ? '#/' : `#/${value}`,
  }));

  return filterOptions;
};

export const TodoFilter: React.FC<Props> = ({ filter, onFilterChange }) => {
  const filterOptions = getFilterOptions();

  const handleFilterClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    value: FilterType,
  ) => {
    e.preventDefault();
    onFilterChange(value);
  };

  return (
    <nav className="filter" data-cy="Filter">
      {filterOptions.map(option => (
        <a
          key={option.value}
          href={option.href}
          className={classNames('filter__link', {
            selected: filter === option.value,
          })}
          data-cy={`FilterLink${option.label}`}
          onClick={e => handleFilterClick(e, option.value)}
        >
          {option.translatedLabel}
        </a>
      ))}
    </nav>
  );
};
