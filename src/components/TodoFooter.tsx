import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoFilter } from '../App';

interface TodoFooterProps {
  todos: Todo[];
  itemsLeft: number;
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
  loading: boolean;
  clearCompletedTodos: () => void;
}

export const TodoFooter: React.FC<TodoFooterProps> = ({
  todos,
  itemsLeft,
  filter,
  onFilterChange,
  loading,
  clearCompletedTodos,
}) => (
  <>
    {todos.length > 0 && (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {itemsLeft} item{itemsLeft !== 1 ? 's' : ''} left
        </span>

        <nav className="filter" data-cy="Filter">
          {Object.values(TodoFilter).map(currentFilter => (
            <a
              key={currentFilter}
              href={`#/${currentFilter.charAt(0).toLowerCase() + currentFilter.slice(1, currentFilter.length)}`}
              className={classNames('filter__link', {
                selected: filter === currentFilter,
              })}
              data-cy={`FilterLink${currentFilter}`}
              onClick={() => onFilterChange(currentFilter)}
            >
              {currentFilter}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={loading || !todos.some(todo => todo.completed)}
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      </footer>
    )}
  </>
);
