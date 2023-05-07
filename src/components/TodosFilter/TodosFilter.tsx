import React, { useContext } from 'react';
import classNames from 'classnames';

import { Filter } from '../../types/Filter';
import { AppContext } from '../AppContext/AppContext';

const Filters = Object.values(Filter);

export const TodosFilter: React.FC = React.memo(() => {
  const {
    currentFilterMode,
    setCurrentFilterMode,
  } = useContext(AppContext);

  return (
    <nav className="filter">
      {Filters.map(FilterType => {
        const FilterLowercased = FilterType.toLowerCase();
        const isCurrentFilter = FilterType === currentFilterMode;

        return (
          <a
            key={FilterType}
            href={`#/${FilterLowercased}`}
            className={classNames(
              'filter__link',
              { selected: isCurrentFilter },
            )}
            onClick={() => setCurrentFilterMode(FilterType)}
          >
            {FilterType}
          </a>
        );
      })}
    </nav>
  );
});
