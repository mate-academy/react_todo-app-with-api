import React from 'react';
import { Filter } from '../types/Filter';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  clearCompletedTodos: () => Promise<void>;
  todoClear: boolean;
  newFilter: Filter;
  setNewFilter: (newFilter: Filter) => void;
  todos: Todo[];
}

export const Footer: React.FC<Props> = ({
  clearCompletedTodos,
  todoClear,
  newFilter,
  setNewFilter,
  todos,
}) => {
  return (
    <div className="todoapp__content">
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {todos.filter(todo => !todo.completed).length} items left
        </span>
        <nav className="filter" data-cy="Filter">
          {Object.values(Filter).map(filter => (
            <a
              key={filter}
              href={`#/${filter.toLowerCase()}`}
              className={classNames('filter__link', {
                selected: newFilter === filter,
              })}
              data-cy={`FilterLink${filter}`}
              onClick={() => setNewFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className={classNames('todoapp__clear-completed', {
            hidden: !todoClear,
          })}
          disabled={!todoClear}
          onClick={clearCompletedTodos}
          data-cy="ClearCompletedButton"
        >
          Clear completed
        </button>
      </footer>
    </div>
  );
};
