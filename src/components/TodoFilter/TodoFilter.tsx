import React, { memo } from 'react';
import classNames from 'classnames';
import { FilterBy } from '../../utils/enums';
import { Todo } from '../../types/Todo';
import { clearCompleted } from '../../utils/clearCompleted';

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

    const handleClearCompleted = () => clearCompleted(todos, onDeleteTodo);

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${activeTodosNumber} items left`}
        </span>

        <nav className="filter">
          <a
            href="#/"
            className={classNames('filter__link', {
              selected: statusFilter === FilterBy.All,
            })}
            onClick={() => onFilterChange(FilterBy.All)}
          >
            All
          </a>

          <a
            href="#/active"
            className={classNames('filter__link', {
              selected: statusFilter === FilterBy.Active,
            })}
            onClick={() => onFilterChange(FilterBy.Active)}
          >
            Active
          </a>

          <a
            href="#/completed"
            className={classNames('filter__link', {
              selected: statusFilter === FilterBy.Completed,
            })}
            onClick={() => onFilterChange(FilterBy.Completed)}
          >
            Completed
          </a>
        </nav>

        <button
          type="button"
          className={classNames('todoapp__clear-completed', {
            'is-invisible': !hasCompletedTodos,
          })}
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);
