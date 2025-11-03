import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterType, FILTERS } from '../filtersAll/filters';

interface FooterProps {
  todos: Todo[];
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleFilterClick =
    (newFilter: FilterType) => (event: React.MouseEvent) => {
      event.preventDefault();
      onFilterChange(newFilter);
    };

  const handleClearCompletedClick = () => {
    onClearCompleted();
  };

  const filterLinks = [
    { type: FILTERS.all, label: 'All', href: '#/' },
    { type: FILTERS.active, label: 'Active', href: '#/active' },
    { type: FILTERS.completed, label: 'Completed', href: '#/completed' },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} item${activeTodos.length !== 1 ? 's' : ''} left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(({ type, label, href }) => (
          <a
            key={type}
            href={href}
            className={classNames('filter__link', {
              selected: filter === type,
            })}
            data-cy={`FilterLink${label}`}
            onClick={handleFilterClick(type)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={handleClearCompletedClick}
      >
        Clear completed
      </button>
    </footer>
  );
};
