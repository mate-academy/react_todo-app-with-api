import React from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

interface Props {
  todos: Todo[];
  filter: Filter;
  onSelect: (filter: Filter) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onSelect,
  onClearCompleted,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer">
      <span className="todo-count">
        {`${activeTodosCount.length} ${activeTodosCount.length > 1 ? 'items' : 'item'} left`}
      </span>

      <nav className="filter">
        <a
          href="#/"
          className={cn(
            'filter__link',
            { selected: filter === Filter.ALL },
          )}
          onClick={() => onSelect(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn(
            'filter__link', {
              selected: filter === Filter.ACTIVE,
            },
          )}
          onClick={() => onSelect(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn(
            'filter__link', {
              selected: filter === Filter.COMPLETED,
            },
          )}
          onClick={() => onSelect(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
