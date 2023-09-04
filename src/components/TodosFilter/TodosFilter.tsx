import React, { useContext } from 'react';
import classNames from 'classnames';

import { FilterType } from '../../types/FilterType';
import { AppContext } from '../AppContext';

const filterTypes = Object.values(FilterType);

export const TodosFilter: React.FC = React.memo(() => {
  const {
    currentFilterType,
    setCurrentFilterType,
  } = useContext(AppContext);

  return (
    <nav className="filter">
      {filterTypes.map(filterType => {
        const filterTypeLowercased = filterType.toLowerCase();
        const isCurrentFilterType = filterType === currentFilterType;

        return (
          <a
            key={filterType}
            href={`#/${filterTypeLowercased}`}
            className={classNames(
              'filter__link',
              { selected: isCurrentFilterType },
            )}
            onClick={() => setCurrentFilterType(filterType)}
          >
            {filterType}
          </a>
        );
      })}
    </nav>
  );
});
