import React, { useMemo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

type Props = {
  todos: Todo[],
  filterType: FilterType
  handleFilter: (filterType: FilterType) => void,
  handleRemoveTodo: (id: number) => void,
};

export const Footer: React.FC<Props> = React.memo(({
  todos,
  filterType,
  handleFilter,
  handleRemoveTodo,
}) => {
  const completedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  const handleClear = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleRemoveTodo(todo.id);
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${todos.length - completedTodos.length} items left`}
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

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleClear}
        disabled={completedTodos.length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
});
