import React from 'react';
import { FilterType } from '../types/FilterType';
import classNames from 'classnames';

type Props = {
  itemsCounterText: string;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  hasCompletedTodos: boolean;
  handleClearCompleted: () => void;
};

type FilterLink = {
  value: FilterType;
  label: string;
  href: string;
  dataCy: string;
};

const filters: FilterLink[] = [
  {
    value: 'all',
    label: 'All',
    href: '#/',
    dataCy: 'FilterLinkAll',
  },
  {
    value: 'active',
    label: 'Active',
    href: '#/active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: 'completed',
    label: 'Completed',
    href: '#/completed',
    dataCy: 'FilterLinkCompleted',
  },
];

export const TodoFooter: React.FC<Props> = ({
  itemsCounterText,
  filter,
  setFilter,
  hasCompletedTodos,
  handleClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsCounterText}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {filters.map(item => (
          <a
            key={item.value}
            href={item.href}
            data-cy={item.dataCy}
            className={classNames('filter__link', {
              selected: filter === item.value,
            })}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
