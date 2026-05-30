import React from 'react';
import classNames from 'classnames';
import { FilterType } from '../types/Todo';

type FilterOption = {
  value: FilterType;
  label: string;
  dataCy: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All', dataCy: 'FilterLinkAll' },
  { value: 'active', label: 'Active', dataCy: 'FilterLinkActive' },
  { value: 'completed', label: 'Completed', dataCy: 'FilterLinkCompleted' },
];

type Props = {
  activeTodosCount: number;
  filter: FilterType;
  hasCompletedTodos: boolean;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filter,
  hasCompletedTodos,
  onFilterChange,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer">
      <span data-cy="TodosCounter">
        {`${activeTodosCount} item${activeTodosCount === 1 ? '' : 's'} left`}
      </span>

      <div data-cy="Filter" className="filter">
        {FILTER_OPTIONS.map(({ value, label, dataCy }) => (
          <button
            key={value}
            type="button"
            data-cy={dataCy}
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        data-cy="ClearCompletedButton"
        className="todoapp__clear-completed"
        disabled={!hasCompletedTodos}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
