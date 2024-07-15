import React from 'react';
import { FilterType } from '../types/FilterTodos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  clearCompleted: () => void;
  setFilter: (filter: FilterType) => void;
  filter: string;
};

export const Footer: React.FC<Props> = ({
  todos,
  clearCompleted,
  setFilter,
  filter,
}) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const isDisabled = !todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filter === FilterType.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterType.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filter === FilterType.Active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterType.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filter === FilterType.Completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={isDisabled}
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
