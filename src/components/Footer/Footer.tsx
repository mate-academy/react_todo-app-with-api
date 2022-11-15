import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

type Props = {
  todos: Todo[];
  filterType: FilterType;
  setFilterType: React.Dispatch<React.SetStateAction<FilterType>>;
  clearCompleted: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterType,
  setFilterType,
  clearCompleted,
}) => {
  const hasCompleted = todos.some(todo => todo.completed);
  const countOfActive = todos.filter(todo => !todo.completed).length;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${countOfActive} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={cn('filter__link', {
            selected: filterType === FilterType.ALL,
          })}
          onClick={() => setFilterType(FilterType.ALL)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={cn('filter__link', {
            selected: filterType === FilterType.ACTIVE,
          })}
          onClick={() => setFilterType(FilterType.ACTIVE)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={cn('filter__link', {
            selected: filterType === FilterType.COMPLETED,
          })}
          onClick={() => setFilterType(FilterType.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      {hasCompleted && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompleted}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
