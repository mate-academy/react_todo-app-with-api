import { memo, useState } from 'react';
import classNames from 'classnames';
import { Status } from '../types/Status';

interface FilterProps {
  onFilterStatusChange: (filterStatus: Status) => void
}

export const Filter = memo(({ onFilterStatusChange }:FilterProps) => {
  const [filterStatus, setFilterStatus] = useState<Status>('all');

  const pickFilterStatus = (chosenFilter: Status) => {
    setFilterStatus(chosenFilter);
    onFilterStatusChange(chosenFilter);
  };

  return (
    <nav className="filter">
      <a
        href="#/"
        className={classNames('filter__link', {
          selected: filterStatus === 'all',
        })}
        onClick={() => pickFilterStatus('all')}
      >
        All
      </a>

      <a
        href="#/active"
        className={classNames('filter__link', {
          selected: filterStatus === 'active',
        })}
        onClick={() => pickFilterStatus('active')}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={classNames('filter__link', {
          selected: filterStatus === 'completed',
        })}
        onClick={() => pickFilterStatus('completed')}
      >
        Completed
      </a>
    </nav>
  );
});
