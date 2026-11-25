import React from 'react';
import { Todo } from '../types/Todo';

type Filter = 'all' | 'active' | 'completed';

const filters: {
  value: Filter;
  href: string;
  label: string;
  dataCy: string;
}[] = [
  { value: 'all', href: '#/', label: 'All', dataCy: 'FilterLinkAll' },
  {
    value: 'active',
    href: '#/active',
    label: 'Active',
    dataCy: 'FilterLinkActive',
  },
  {
    value: 'completed',
    href: '#/completed',
    label: 'Completed',
    dataCy: 'FilterLinkCompleted',
  },
];

interface Props {
  todos: Todo[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  if (todos.length === 0) {
    return null;
  }

  const completedTodosCount = todos.filter(todo => todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.length - completedTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filters.map(({ value, href, label, dataCy }) => (
          <a
            key={value}
            href={href}
            className={`filter__link ${filter === value ? 'selected' : ''}`}
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
