import { memo, useState } from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';

interface FilterProps {
  onFilterStatusChange: (filterStatus: Status) => void
}

export const Filter = memo(({ onFilterStatusChange }:FilterProps) => {
  const [filterStatus, setFilterStatus] = useState<Status>(Status.ALL);

  const pickFilterStatus = (chosenFilter: Status) => {
    setFilterStatus(chosenFilter);
    onFilterStatusChange(chosenFilter);
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterStatus === Status.ALL,
        })}
        onClick={() => pickFilterStatus(Status.ALL)}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterStatus === Status.ACTIVE,
        })}
        onClick={() => pickFilterStatus(Status.ACTIVE)}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterStatus === Status.COMPLETED,
        })}
        onClick={() => pickFilterStatus(Status.COMPLETED)}
      >
        Completed
      </a>
    </nav>
  );
});
