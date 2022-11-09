import React, { useContext } from 'react';
import classNames from 'classnames';
import { Sort } from '../../../types/enums/Sort';
import { FilterContext } from '../../FilterContext';

export const Navigation: React.FC = React.memo(() => {
  const { filterBy, changeFilterBy } = useContext(FilterContext);

  return (
    <nav className="filter" data-cy="Filter">
      {(Object.values(Sort)).map((current) => (
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: current as Sort === filterBy },
          )}
          key={current}
          onClick={() => changeFilterBy(current)}
        >
          {current}
        </a>
      ))}
    </nav>
  );
});
