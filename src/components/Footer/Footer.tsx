import React from 'react';
import cn from 'classnames';
import { FilterBy } from '../../types/FilterBy';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  onFilterBy: (filter: FilterBy) => void,
  filterBy: FilterBy,
  // notCompletedTodos:number,
  onClearCompleted: (id: number) => void,
  // isClearButtonVisible: boolean;
};

export const Footer: React.FC<Props> = React.memo(({
  todos,
  onFilterBy,
  filterBy,
  // notCompletedTodos,
  // isClearButtonVisible,
  onClearCompleted,
}) => {
  const completedTodos = todos.filter((todo) => todo.completed);
  const activeTodos = todos.filter((todo) => !todo.completed);
  const handleClearCompleted = () => {
    completedTodos.map((todo) => onClearCompleted(todo.id));
  };

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn('filter__link',
            {
              selected: filterBy === FilterBy.ALL,
            })}
          onClick={() => {
            onFilterBy(FilterBy.ALL);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            {
              selected: filterBy === FilterBy.ACTIVE,
            })}
          onClick={() => {
            onFilterBy(FilterBy.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            {
              selected: filterBy === FilterBy.COMPLETED,
            })}
          onClick={() => {
            onFilterBy(FilterBy.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      {completedTodos.length > 0 && (
        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
});
