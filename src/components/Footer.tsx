import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/FilterStatus';
import { Todo } from '../types/Todo';

interface FooterProps {
  counter: number;
  statusFilter: FilterStatus;
  setStatusFilter: (filter: FilterStatus) => void;
  filteredTodos: Todo[];
  clearCompletedTodos: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  counter,
  statusFilter,
  setStatusFilter,
  filteredTodos,
  clearCompletedTodos,
}) => {
  const filterOptions = [
    { label: 'All', value: FilterStatus.All, href: '#/' },
    { label: 'Active', value: FilterStatus.Active, href: '#/active' },
    { label: 'Completed', value: FilterStatus.Completed, href: '#/completed' },
  ];

  const completedTodosCount = filteredTodos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(({ label, value, href }) => (
          <a
            key={value}
            href={href}
            className={classNames('filter__link', { selected: statusFilter === value })}
            data-cy={`FilterLink${label}`}
            onClick={() => setStatusFilter(value)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodosCount === 0}
        onClick={clearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
