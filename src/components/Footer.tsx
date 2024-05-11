import React from 'react';
import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  filter: Filter;
  onFilter: React.Dispatch<React.SetStateAction<Filter>>;
  clearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  onFilter,
  todos,
  filter,
  clearCompleted,
}) => {
  const counter = todos.filter(todo => !todo.completed).length;

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const handleFilter = (newFilter: Filter) => (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(newFilter);
  };

  if (!todos.length) {
    return null;
  }

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counter} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={`filter__link ${filter === Filter.All ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={handleFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={`filter__link ${filter === Filter.Active ? 'selected' : ''}`}
          data-cy="FilterLinkActive"
          onClick={handleFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={`filter__link ${filter === Filter.Completed ? 'selected' : ''}`}
          data-cy="FilterLinkCompleted"
          onClick={handleFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
