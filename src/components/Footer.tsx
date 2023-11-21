import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterTodos } from '../types/FilterTodos';

type Props = {
  todos: Todo[];
  isOneTodoCompleted: boolean;
  filtredTodos: FilterTodos;
  setFiltredTodos: (newValue: FilterTodos) => void;
  handleClearCompletedTodos: () => void,
};

export const Footer: React.FC<Props> = ({
  todos,
  isOneTodoCompleted,
  filtredTodos,
  setFiltredTodos,
  handleClearCompletedTodos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames('filter__link', {
            selected: filtredTodos === FilterTodos.All,
          })}
          onClick={(event) => {
            event.preventDefault();
            setFiltredTodos(FilterTodos.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={classNames('filter__link', {
            selected: filtredTodos === FilterTodos.Active,
          })}
          onClick={(event) => {
            event.preventDefault();
            setFiltredTodos(FilterTodos.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames('filter__link', {
            selected: filtredTodos === FilterTodos.Completed,
          })}
          onClick={(event) => {
            event.preventDefault();
            setFiltredTodos(FilterTodos.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      {isOneTodoCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
