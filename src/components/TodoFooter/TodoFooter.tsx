import React from 'react';
import classNames from 'classnames';
import { Filter } from '../../types/Filter';

type Props = {
  notCompletedCount: number;
  hasCompletedTodos: boolean;
  selectedFilter: Filter;
  onFilterChange: (event: React.MouseEvent, filter: Filter) => void;
  onClearCompleted: () => void;
};

const filterOptions = [
  {
    value: Filter.All,
    label: 'All',
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    value: Filter.Active,
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: Filter.Completed,
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFooter: React.FC<Props> = ({
  notCompletedCount,
  hasCompletedTodos,
  selectedFilter,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(({ value, label, href, dataCy }) => (
          <a
            key={value}
            href={href}
            data-cy={dataCy}
            className={classNames('filter__link', {
              selected: selectedFilter === value,
            })}
            onClick={event => onFilterChange(event, value)}
          >
            {label}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
