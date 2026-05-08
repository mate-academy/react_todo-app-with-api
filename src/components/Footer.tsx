import React from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { FilterStatus } from '../types/types';
import { FILTERS } from '../constants';

type Props = {
  todos: Todo[];
  filter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  if (todos.length === 0) {
    return null;
  }

  const activeTodos = todos.filter(todo => !todo.completed).length;

  const handleFilterClick =
    (status: FilterStatus) => (event: React.MouseEvent) => {
      event.preventDefault();
      onFilterChange(status);
    };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(({ id, title, url, cy }) => (
          <a
            key={id}
            href={url}
            className={cn('filter__link', { selected: filter === id })}
            data-cy={cy}
            onClick={handleFilterClick(id)}
          >
            {title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos.length - activeTodos === 0}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
