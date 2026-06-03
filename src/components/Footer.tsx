import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

type Props = {
  todos: Todo[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

const FILTER_OPTIONS: { value: Filter; href: string; label: string }[] = [
  { value: Filter.All, href: '#/', label: 'All' },
  { value: Filter.Active, href: '#/active', label: 'Active' },
  { value: Filter.Completed, href: '#/completed', label: 'Completed' },
];

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.some(todo => todo.completed);

  const handleFilterClick =
    (value: Filter) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      onFilterChange(value);
    };

  return (
    <footer className="todoapp__footer" data-cy="TodosFooter">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} item{activeTodosCount !== 1 ? 's' : ''} left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_OPTIONS.map(({ value, href, label }) => (
          <a
            key={value}
            href={href}
            data-cy={`FilterLink${capitalize(value)}`}
            className={classNames('filter__link', {
              selected: filter === value,
            })}
            onClick={handleFilterClick(value)}
          >
            {label}
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
