import React from 'react';
import cn from 'classnames';

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const FILTERS = [
  { value: Filter.All, label: 'All', href: '#/', dataCy: 'FilterLinkAll' },
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

interface Props {
  filter: Filter;
  activeTodosCount: number;
  completedTodosCount: number;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  filter,
  activeTodosCount,
  completedTodosCount,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {FILTERS.map(({ value, label, href, dataCy }) => (
          <a
            key={value}
            href={href}
            className={cn('filter__link', {
              selected: filter === value,
            })}
            data-cy={dataCy}
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
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};

export { Filter };
