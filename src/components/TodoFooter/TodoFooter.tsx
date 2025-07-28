import React from 'react';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onDeletedCompleted: () => void;
};

const FILTER_LINKS = Object.values(Filter).map(value => ({
  value,
  label: value[0].toLocaleUpperCase() + value.slice(1),
  href: `#/${value}`,
  dataCy: `FilterLink${value[0].toLocaleUpperCase() + value.slice(1)}`,
}));

export const TodoFooter: React.FC<Props> = ({
  todos,
  filter,
  onFilterChange,
  onDeletedCompleted,
}) => {
  const counterLength = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {counterLength} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTER_LINKS.map(({ label, value, href, dataCy }) => (
          <a
            key={value}
            href={href}
            className={cn('filter__link', { selected: filter === value })}
            data-cy={dataCy}
            onClick={() => onFilterChange(value)}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        disabled={todos.every(todo => !todo.completed)}
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={onDeletedCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
