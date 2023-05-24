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
      <button
        type="button"
        className={classNames(
          'button is-primary is-outlined is-small',
          {
            'is-primary': filterType === FilterType.All,
          },
        )}
        onClick={() => {
          if (filterType !== FilterType.All) {
            onSetFilterType(FilterType.All);
          }
        }}
      >
        All
      </button>

      <button
        type="button"
        className={classNames(
          'button is-primary is-outlined is-small',
          {
            'is-primary': filterType === FilterType.Active,
          },
        )}
        onClick={() => {
          if (filterType !== FilterType.Active) {
            onSetFilterType(FilterType.Active);
          }
        }}
      >
        Active
      </button>

      <button
        type="button"
        className={classNames(
          'button is-primary is-outlined is-small',
          {
            'is-primary': filterType === FilterType.Completed,
          },
        )}
        onClick={() => {
          if (filterType !== FilterType.Completed) {
            onSetFilterType(FilterType.Completed);
          }
        }}
      >
        Completed
      </button>
    </nav>
  );
};
