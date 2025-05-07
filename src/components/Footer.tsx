import React from 'react';
import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  uncompletedTodos: Todo[];
  filterType: FilterTypes;
  handleFilterType: (filterType: FilterTypes) => void;
  handleClearCompleted: () => void;
  todos: Todo[];
};

export const Footer: React.FC<Props> = ({
  uncompletedTodos,
  filterType,
  handleFilterType,
  handleClearCompleted,
  todos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodos?.length} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterTypes).map((type: FilterTypes) => (
          <a
            key={type}
            href={`#/${type === FilterTypes.ALL ? '' : type.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filterType === type,
            })}
            data-cy={`FilterLink${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}`}
            onClick={() => handleFilterType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
          </a>
        ))}
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todos?.every(todo => todo.completed !== true)}
        onClick={handleClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
