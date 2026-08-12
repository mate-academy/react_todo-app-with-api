import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Filter } from '../../types/Filter';

type FilterItem = {
  label: string;
  value: Filter;
  href: string;
  dataCy: string;
};

type Props = {
  todos: Todo[];
  filter: Filter;
  filters: FilterItem[];
  setFilter: (filter: Filter) => void;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filter,
  filters,
  setFilter,
  clearCompleted,
}) => {
  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todos.filter(todo => !todo.completed).length} items left
          </span>

          <nav className="filter" data-cy="Filter">
            {filters.map(({ label, value, href, dataCy }) => (
              <a
                key={value}
                href={href}
                className={classNames('filter__link', {
                  selected: filter === value,
                })}
                data-cy={dataCy}
                onClick={() => setFilter(value)}
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
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
