import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../../types/FilterType';

type Props = {
  type: FilterType,
  currentType: FilterType,
  setCurrentType: (type: FilterType) => void
};

export const FilterLink: React.FC<Props> = ({
  type,
  currentType,
  setCurrentType,
}) => (
  <a
    href="#/"
    className={classNames(
      'filter__link',
      {
        selected: currentType === type,
      },
    )}
    onClick={() => {
      if (currentType !== type) {
        setCurrentType(type);
      }
    }}
  >
    {type}
  </a>
);
