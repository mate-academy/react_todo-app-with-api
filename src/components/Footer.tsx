import React from 'react';
import cn from 'classnames';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  filterType: FilterType;
  handleFilter: (filterType: FilterType) => void;
  handleDeleteTodo: (id: number) => void;
}

export const Footer: React.FC<Props> = React.memo(({
  todos,
  filterType,
  handleFilter,
  handleDeleteTodo,
}) => {
  const completedTodos = (
    todos.filter(todo => todo.completed)
  );

  const clearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length - completedTodos.length} left todo`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => handleFilter(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => handleFilter(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => handleFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length > 0 && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={() => clearCompleted()}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
