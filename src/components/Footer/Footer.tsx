import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type Props = {
  todos: Todo[];
  filterStatus: Filter;
  setFilterStatus: (value: Filter) => void;
  completedTodos: Todo[];
  handleDeleteCompletedTodo: () => void;
};

const filterLinks = [
  { label: 'All', value: Filter.All, href: '#/' },
  { label: 'Active', value: Filter.Active, href: '#/active' },
  { label: 'Completed', value: Filter.Completed, href: '#/completed' },
];

export const Footer: React.FC<Props> = ({
  todos,
  filterStatus,
  setFilterStatus,
  completedTodos,
  handleDeleteCompletedTodo,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(todo => !todo.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterLinks.map(link => (
          <a
            key={link.value}
            href={link.href}
            className={`filter__link ${
              filterStatus === link.value ? 'selected' : ''
            }`}
            data-cy={`FilterLink${link.label}`}
            onClick={() => setFilterStatus(link.value)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => handleDeleteCompletedTodo()}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
