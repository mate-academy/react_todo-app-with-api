import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Filter } from '../App';

type Props = {
  todos: Todo[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onClearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(Filter).map(value => {
          const href = value === Filter.All ? '#/' : `#/${value}`;

          const label = value.charAt(0).toUpperCase() + value.slice(1);

          return (
            <a
              key={value}
              href={href}
              data-cy={`FilterLink${label}`}
              className={classNames('filter__link', {
                selected: filter === value,
              })}
              onClick={() => onFilterChange(value)}
            >
              {label}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
