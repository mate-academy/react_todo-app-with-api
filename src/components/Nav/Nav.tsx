import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  filterType: FilterType,
  onSetFilterType: (filter: FilterType) => void,
};

export const Nav: React.FC<Props> = ({ filterType, onSetFilterType }) => {
  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames(
          'filter__link',
          {
            selected: filterType === FilterType.All,
          },
        )}
        onClick={() => {
          if (filterType !== FilterType.All) {
            onSetFilterType(FilterType.All);
          }
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames(
          'filter__link',
          {
            selected: filterType === FilterType.Active,
          },
        )}
        onClick={() => {
          if (filterType !== FilterType.Active) {
            onSetFilterType(FilterType.Active);
          }
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames(
          'filter__link',
          {
            selected: filterType === FilterType.Completed,
          },
        )}
        onClick={() => {
          if (filterType !== FilterType.Completed) {
            onSetFilterType(FilterType.Completed);
          }
        }}
      >
        Completed
      </a>
    </nav>
  );
};
