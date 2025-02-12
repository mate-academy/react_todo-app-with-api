import classNames from 'classnames';
import React from 'react';
import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

type Props = {
  activeFilter: FilterType;
  handleFilter: (filter: FilterType) => void;
  todos: Todo[] | null;
  filteredTodos: Todo[];
  handleDeleteCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  activeFilter,
  handleFilter,
  todos,
  filteredTodos,
  handleDeleteCompleted,
}) => {
  return (
    <>
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {(todos ?? []).filter(todo => !todo.completed).length} items left
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          {Object.values(FilterType).map(filter => (
            <a
              key={filter}
              href={`#/${filter.toLowerCase()}`}
              className={classNames('filter__link', {
                selected: activeFilter === filter,
              })}
              data-cy={`FilterLink${filter}`}
              onClick={() => handleFilter(filter)}
            >
              {filter}
            </a>
          ))}
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleDeleteCompleted}
          disabled={
            (filteredTodos ?? []).filter(todo => todo.completed).length === 0
          }
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
