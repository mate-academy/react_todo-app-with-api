import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type Props = {
  count: number;
  selectedFilter: Filter;
  isAnyCompleted: boolean;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};
const FILTERS = [
  { value: Filter.All, label: 'All', href: '#/' },
  { value: Filter.Active, label: 'Active', href: '#/active' },
  { value: Filter.Completed, label: 'Completed', href: '#/completed' },
];
export const Footer: React.FC<Props> = ({
  count,
  selectedFilter,
  isAnyCompleted,
  onFilterChange,
  onClearCompleted,
}) => (
  <footer className="todoapp__footer" data-cy="Footer">
    <span className="todo-count" data-cy="TodosCounter">
      {count} items left
    </span>

    <nav className="filter" data-cy="Filter">
      {FILTERS.map(({ value, label, href }) => (
        <a
          key={value}
          href={href}
          data-cy={`FilterLink${label}`}
          className={classNames('filter__link', {
            selected: selectedFilter === value,
          })}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </a>
      ))}
    </nav>

    <button
      type="button"
      className="todoapp__clear-completed"
      data-cy="ClearCompletedButton"
      onClick={onClearCompleted}
      disabled={!isAnyCompleted}
    >
      Clear completed
    </button>
  </footer>
);
