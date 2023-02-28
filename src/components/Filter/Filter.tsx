import React, { useMemo } from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/FilterBy';
import { Todo } from '../../types/Todo';

interface Props {
  filterBy: FilterBy,
  setFilterBy: (param: FilterBy) => void
  todos: Todo[]
  removeCompletedTodos: () => void
}

export const Filter: React.FC<Props> = React.memo(
  ({
    filterBy,
    setFilterBy,
    todos,
    removeCompletedTodos,
  }) => {
    const leftTodos = useMemo(
      () => todos.filter(todo => !todo.completed),
      [todos],
    );

    const enableButton = todos.some(todo => todo.completed);

    return (
      <footer className="todoapp__footer">
        <span className="todo-count">
          {`${leftTodos.length} items left`}
        </span>

        <nav className="filter">
          {Object.values(FilterBy).map(filterType => (
            <a
              href="#/"
              className={cn(
                'filter__link',
                { selected: filterBy === filterType },
              )}
              onClick={() => setFilterBy(filterType)}
            >
              {filterType}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          disabled={!enableButton}
          onClick={() => removeCompletedTodos()}
        >
          Clear completed
        </button>

      </footer>
    );
  },
);
