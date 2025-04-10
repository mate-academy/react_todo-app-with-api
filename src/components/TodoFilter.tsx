import React from 'react';
import { FilterStatus } from '../types/FilterStatus';
import cn from 'classnames';

type Props = {
  filterStatus: FilterStatus;
  onChange: (status: FilterStatus) => void;
};

export const TodoFilter: React.FC<Props> = ({ filterStatus, onChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        href="#/"
        className={cn('filter__link', {
          selected: filterStatus === FilterStatus.All,
        })}
        data-cy="FilterLinkAll"
        onClick={e => {
          e.preventDefault();
          onChange(FilterStatus.All);
        }}
      >
        All
      </a>

      <a
        href="#/active"
        className={cn('filter__link', {
          selected: filterStatus === FilterStatus.Active,
        })}
        data-cy="FilterLinkActive"
        onClick={e => {
          e.preventDefault();
          onChange(FilterStatus.Active);
        }}
      >
        Active
      </a>

      <a
        href="#/completed"
        className={cn('filter__link', {
          selected: filterStatus === FilterStatus.Completed,
        })}
        data-cy="FilterLinkCompleted"
        onClick={e => {
          e.preventDefault();
          onChange(FilterStatus.Completed);
        }}
      >
        Completed
      </a>
    </nav>
  );
};
