import React from 'react';

export enum FilterStatus {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

const FILTER_OPTIONS = [
  { type: FilterStatus.ALL, href: '#/', label: 'All', cy: 'FilterLinkAll' },
  {
    type: FilterStatus.ACTIVE,
    href: '#/active',
    label: 'Active',
    cy: 'FilterLinkActive',
  },
  {
    type: FilterStatus.COMPLETED,
    href: '#/completed',
    label: 'Completed',
    cy: 'FilterLinkCompleted',
  },
] as const;

interface Props {
  incompleteTodoQuantity: number;
  activeFiltering: FilterStatus;
  onFilterSelect: (filter: FilterStatus) => void;
  isAnyTodoCompleted: boolean;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  incompleteTodoQuantity,
  activeFiltering,
  onFilterSelect,
  isAnyTodoCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {incompleteTodoQuantity} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_OPTIONS.map(({ type, href, label, cy }) => (
          <a
            key={type}
            href={href}
            className={`filter__link ${activeFiltering === type ? 'selected' : ''}`}
            data-cy={cy}
            onClick={() => onFilterSelect(type)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isAnyTodoCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
