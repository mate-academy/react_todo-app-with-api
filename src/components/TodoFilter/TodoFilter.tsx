import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

interface Props {
  todos: Todo[],
  completedTodos: Todo[],
  filterType: FilterType,
  setFilterType: (type: FilterType) => void,
  clearAllCompletedTodos: () => void,
}

export const TodoFilter: React.FC<Props> = ({
  todos,
  completedTodos,
  filterType,
  setFilterType,
  clearAllCompletedTodos,
}) => {
  const leftTodos = todos.length - completedTodos.length;
  const filterTypeArray = Object.values(FilterType);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${leftTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        {filterTypeArray.map(type => (
          <a
            key={type}
            data-cy={`FilterLink${type}`}
            href={`#/${type.toLowerCase()}`}
            className={classNames('filter__link', {
              selected: filterType === type,
            })}
            onClick={() => setFilterType(type)}
          >
            {type}
          </a>
        ))}
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        onClick={clearAllCompletedTodos}
        className={classNames('todoapp__clear-completed', {
          hidden: completedTodos.length === 0,
        })}
      >
        Clear completed
      </button>
    </footer>
  );
};
