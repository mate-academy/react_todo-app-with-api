import { FC } from 'react';
import classNames from 'classnames';
import { FilteringMethod } from '../../types/FilteringStatus';

type Props = {
  name: FilteringMethod;
  filterStatus: FilteringMethod;
  onStatusChange: (status: FilteringMethod) => void;
};

export const FooterFilterLink: FC<Props> = ({
  name,
  filterStatus,
  onStatusChange,
}) => (
  <a
    href="#/"
    className={classNames(
      'Footer__filter-link',
      { selected: filterStatus === name },
    )}
    onClick={() => onStatusChange(name)}
  >
    {name}
  </a>
);
