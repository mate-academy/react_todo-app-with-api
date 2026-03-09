import React from 'react';
import classNames from 'classnames';
import { Filter } from '../types/Filter';

type FooterProps = {
  activeCount: number;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  hasCompleted: boolean;
  onClearCompleted: () => void;
};

const filters = [
  { value: Filter.ALL, label: 'All', href: '#/' },
  { value: Filter.ACTIVE, label: 'Active', href: '#/active' },
  { value: Filter.COMPLETED, label: 'Completed', href: '#/completed' },
];

export const Footer: React.FC<FooterProps> = ({
  activeCount,
  filter,
  setFilter,
  hasCompleted,
  onClearCompleted,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(item => (
          <a
            key={item.value}
            href={item.href}
            className={classNames('filter__link', {
              selected: filter === item.value,
            })}
            data-cy={`FilterLink${item.label}`}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default Footer;
