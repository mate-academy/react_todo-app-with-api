/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/FilterStatus';

type Props = {
  todos: Todo[];
  status: string;
  handleClick: (event: React.MouseEvent) => void;
  deleteTodos: (todos: number[], isInUpdate: boolean) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  status,
  handleClick,
  deleteTodos,
}) => {
  const filterOptions = Object.values(FilterStatus);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos?.filter(td => !td.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterOptions.map(filter => {
          const hrefMap: Record<string, string> = {
            all: '#/',
            active: '#/active',
            completed: '#/completed',
          };

          return (
            <a
              key={filter}
              href={hrefMap[filter]}
              className={`filter__link ${status === filter ? 'selected' : ''}`}
              data-cy={`FilterLink${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
              onClick={event => {
                event.preventDefault();
                handleClick(event);
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() =>
          deleteTodos(
            todos?.filter(todo => todo.completed === true).map(td => td.id),
            false,
          )
        }
        disabled={todos?.filter(todo => todo.completed === true).length === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
