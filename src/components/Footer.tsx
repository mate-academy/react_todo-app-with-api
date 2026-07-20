import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

interface Props {
  activeTodosCount: number;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  todos: Todo[];
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  activeTodosCount,
  filter,
  setFilter,
  todos,
  onClearCompleted,
}) => {
  const filterOptions: {
    type: FilterType;
    label: string;
    href: string;
    cy: string;
  }[] = [
    { type: 'all', label: 'All', href: '#/', cy: 'FilterLinkAll' },
    {
      type: 'active',
      label: 'Active',
      href: '#/active',
      cy: 'FilterLinkActive',
    },
    {
      type: 'completed',
      label: 'Completed',
      href: '#/completed',
      cy: 'FilterLinkCompleted',
    },
  ];

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(({ type, label, href, cy }) => (
          <a
            key={type}
            href={href}
            className={classNames('filter__link', {
              selected: filter === type,
            })}
            onClick={() => setFilter(type)}
            data-cy={cy}
          >
            {label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!todos.some(todo => todo.completed)}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
