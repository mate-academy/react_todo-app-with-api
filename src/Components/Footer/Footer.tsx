import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { FilterParams } from '../../types/FilteredParams';

type Props = {
  todos: Todo[];
  filterValue: FilterParams,
  setFilterValue: (filterValue: FilterParams) => void;
  removeCompletedTodos: () => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterValue,
  setFilterValue,
  removeCompletedTodos,
}) => {
  const isSomeCompletedTodo = todos.some(todo => todo.completed);
  const activeTodos = todos.filter(todo => !todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: filterValue === FilterParams.All,
          })}
          data-cy="FilterLinkAll"
          onClick={() => {
            setFilterValue(FilterParams.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: filterValue === FilterParams.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => {
            setFilterValue(FilterParams.ACTIVE);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: filterValue === FilterParams.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => {
            setFilterValue(FilterParams.COMPLETED);
          }}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!isSomeCompletedTodo}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
