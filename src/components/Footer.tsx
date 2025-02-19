import React from 'react';
import { Todo } from './TodoItem';

export enum FilterOptions {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

interface FooterProps {
  todos: Todo[];
  filter: FilterOptions;
  onFilterChange: (filter: FilterOptions) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => {
    return !todo.completed;
  }).length;

  const filterValues = Object.values(FilterOptions);

  const hasCompletedTodos = todos.some(todo => {
    return todo.completed;
  });

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {filterValues.map(filterValue => {
          const label =
            filterValue.charAt(0).toUpperCase() + filterValue.slice(1);

          return (
            <a
              key={filterValue}
              data-cy={`FilterLink${label}`}
              href={`#/${filterValue === FilterOptions.All ? '' : filterValue}`}
              className={`filter__link ${filter === filterValue ? 'selected' : ''}`}
              onClick={() => {
                onFilterChange(filterValue);
              }}
            >
              {label}
            </a>
          );
        })}
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={() => {
          onClearCompleted();
        }}
        disabled={!hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
