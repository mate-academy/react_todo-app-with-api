import React from 'react';
import classNames from 'classnames';
import { Status } from '../../../types/Status';

type Props = {
  selectedStatus: Status;
  onSelectedStatus: (status: Status) => void;
};

export const TodosFilter: React.FC<Props> = React.memo(({
  selectedStatus,
  onSelectedStatus,
}) => {
  const handleSelectedStatus = (status: Status) => {
    onSelectedStatus(status);
  };

  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames(
          'filter__link',
          { selected: selectedStatus === Status.All },
        )}
        onClick={() => handleSelectedStatus(Status.All)}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames(
          'filter__link',
          { selected: selectedStatus === Status.Active },
        )}
        onClick={() => handleSelectedStatus(Status.Active)}
      >
        Active
      </a>

      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames(
          'filter__link',
          { selected: selectedStatus === Status.Completed },
        )}
        onClick={() => handleSelectedStatus(Status.Completed)}
      >
        Completed
      </a>
    </nav>
  );
});
