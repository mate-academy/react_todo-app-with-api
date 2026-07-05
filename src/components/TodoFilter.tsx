import React from 'react';
import classNames from 'classnames';

type FilterValue = 'all' | 'active' | 'completed';

interface Props {
  filter: FilterValue;
  onChange: (filter: FilterValue) => void;
}

export const TodoFilter: React.FC<Props> = ({ filter, onChange }) => {
  return (
    <nav className="filter" data-cy="Filter">
      <a
        data-cy="FilterLinkAll"
        href="#/"
        className={classNames('filter__link', {
          selected: filter === 'all',
        })}
        onClick={e => {
          e.preventDefault();
          onChange('all');
        }}
      >
        All
      </a>

      <a
        data-cy="FilterLinkActive"
        href="#/active"
        className={classNames('filter__link', {
          selected: filter === 'active',
        })}
        onClick={e => {
          e.preventDefault();
          onChange('active');
        }}
      >
        Active
      </a>

      <a
        data-cy="FilterLinkCompleted"
        href="#/completed"
        className={classNames('filter__link', {
          selected: filter === 'completed',
        })}
        onClick={e => {
          e.preventDefault();
          onChange('completed');
        }}
      >
        Completed
      </a>
    </nav>
  );
};

export type { FilterValue };
