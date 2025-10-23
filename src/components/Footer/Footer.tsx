import React from 'react';
import { FilterTypes } from '../../types/FilterTypes';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  activeTodos: number;
  filter: FilterTypes;
  setFilterBy: (filter: FilterTypes) => void;
  onClearCompleted: () => void;
}

export const Footer: React.FC<Props> = ({
  todos,
  activeTodos,
  filter,
  setFilterBy,
  onClearCompleted,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodos} items left
      </span>
      <nav className="filter" data-cy="Filter">
        {Object.values(FilterTypes).map(filterType => (
          <a
            key={filterType}
            href={`#/${filterType === FilterTypes.All ? '' : filterType.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filter === filterType,
            })}
            data-cy={`FilterLink${filterType}`}
            onClick={e => {
              e.preventDefault();
              setFilterBy(filterType);
            }}
          >
            {filterType}
          </a>
        ))}
      </nav>
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={onClearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};