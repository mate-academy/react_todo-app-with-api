import classNames from 'classnames';
import { FC } from 'react';
import { FilterType } from '../../enums/FilterType';

type Props = {
  title: string;
  filterType: FilterType;
  isActive: boolean;
  changeFilterType: (filterType: FilterType) => void;
};

export const FilterTypeButton: FC<Props> = ({
  title,
  filterType,
  isActive,
  changeFilterType,
}) => {
  return (
    <button
      type="button"
      className={classNames(
        'btn',
        'btn-sm',
        'btn-secondary',
        'grow',
        {
          'btn-active': isActive,
        },
      )}
      onClick={() => changeFilterType(filterType)}
    >
      <a href="#/">{title}</a>
    </button>
  );
};
