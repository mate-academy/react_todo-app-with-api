import React from 'react';
import classNames from 'classnames';
import { TodoFilters } from '../enums/TodoFilters';

type Props = {
  activeCount: number;
  filter: TodoFilters;
  onFilterChange: (filter: TodoFilters) => void;
  onClearCompleted: () => void;
  isClearCompletedDisabled: boolean;
};

export const Footer: React.FC<Props> = ({
  activeCount,
  filter,
  onFilterChange,
  onClearCompleted,
  isClearCompletedDisabled,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {[
          { type: TodoFilters.All, href: '#/', label: 'All' },
          { type: TodoFilters.Active, href: '#/active', label: 'Active' },
          {
            type: TodoFilters.Completed,
            href: '#/completed',
            label: 'Completed',
          },
        ].map(({ type, href, label }) => (
          <a
            key={type}
            href={href}
            className={classNames('filter__link', {
              selected: filter === type,
            })}
            data-cy={`FilterLink${label}`}
            onClick={e => {
              e.preventDefault();
              onFilterChange(type);
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isClearCompletedDisabled}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
