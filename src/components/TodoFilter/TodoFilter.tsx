import React, { memo } from 'react';
import cN from 'classnames';
import { FilterBy } from '../../utils/enums';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  statusFilter: FilterBy,
  onFilterChange: (filter: FilterBy) => void,
  onDeleteTodo: (todoId: number) => void
};

export const TodoFilter: React.FC<Props> = memo(
  ({
    todos,
    statusFilter,
    onFilterChange,
    onDeleteTodo,
  }) => {
    const activeTodosNumber = todos.filter(todo => !todo.completed).length;
    const hasCompletedTodos = todos.length !== activeTodosNumber;

    const clearCompleted = () => {
      const completedTodosId = todos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      completedTodosId.forEach(onDeleteTodo);
    };

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodosNumber} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={cN('filter__link', {
              selected: statusFilter === FilterBy.All,
            })}
            onClick={() => onFilterChange(FilterBy.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={cN('filter__link', {
              selected: statusFilter === FilterBy.Active,
            })}
            onClick={() => onFilterChange(FilterBy.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={cN('filter__link', {
              selected: statusFilter === FilterBy.Completed,
            })}
            onClick={() => onFilterChange(FilterBy.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className={cN('todoapp__clear-completed', {
            'is-invisible': !hasCompletedTodos,
          })}
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
