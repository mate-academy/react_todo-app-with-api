import classNames from 'classnames';
import React from 'react';
import { FilterStatus } from '../types/FilterStatus';

type Props = {
  status: FilterStatus;
  setStatus: (status: FilterStatus) => void;
};

export const Filter: React.FC<Props> = ({ status, setStatus }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        data-cy="FilterLinkAll"
        className={classNames('filter__link', {
          selected: status === FilterStatus.all,
        })}
        onClick={() => setStatus(FilterStatus.all)}
      >
        All
      </a>

      <a
        href="#/active"
        data-cy="FilterLinkActive"
        className={classNames('filter__link', {
          selected: status === FilterStatus.active,
        })}
        onClick={() => setStatus(FilterStatus.active)}
      >
        Active
      </a>

      <a
        href="#/completed"
        data-cy="FilterLinkCompleted"
        className={classNames('filter__link', {
          selected: status === FilterStatus.completed,
        })}
        onClick={() => setStatus(FilterStatus.completed)}
      >
        Completed
      </a>
    </nav>
  );
};
