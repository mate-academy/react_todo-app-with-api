import React from 'react';
import classNames from 'classnames';
import { FilterStatus, Todo } from '../../types/Todo';

interface Props {
  filter: string;
  handleFilterChange: (arg: FilterStatus) => void
  initialTodos: Todo[]
  removeTodo: (arg: number) => void;
  completedTodo: Todo[]
}

export const Footer: React.FC<Props> = ({
  filter,
  handleFilterChange,
  initialTodos,
  removeTodo,
  completedTodo,
}) => {
  const activeTodosQuantity = initialTodos
    .filter(todo => !todo.completed).length;
  const filterStatuses: string[] = Object.values(FilterStatus);
  const removeCompletedTodos = () => {
    completedTodo.map(todo => removeTodo(todo.id));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosQuantity} items left`}
      </span>

      <nav className="filter">
        {filterStatuses.map((status) => (
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: filter === status,
            })}
            onClick={() => handleFilterChange(status as FilterStatus)}
          >
            {status[0].toUpperCase() + status.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          'is-invisible': completedTodo.length === 0,
        })}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
