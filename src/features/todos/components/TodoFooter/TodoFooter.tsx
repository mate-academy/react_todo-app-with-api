import React from 'react';
import { QueryTodos } from '../../constants/queryTodos';
import { Todo } from '../../types/Todo';

type Props = {
  activeTodosCount: number;
  completedTodos: Todo[];
  clearCompletedTodos: () => void;
  query: QueryTodos;
  setQuery: (query: QueryTodos) => void;
};

export const TodoFooter: React.FC<Props> = ({
  activeTodosCount,
  completedTodos,
  clearCompletedTodos,
  query,
  setQuery,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      {/* Hide the footer if there are no todos */}
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodosCount} items left`}
      </span>

      {/* Active link should have the 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={
            query === QueryTodos.All ? `filter__link selected` : 'filter__link'
          }
          data-cy="FilterLinkAll"
          onClick={event => {
            event.preventDefault();
            setQuery(QueryTodos.All);
          }}
        >
          All
        </a>

        <a
          href="#/active"
          className={
            query === QueryTodos.Active
              ? `filter__link selected`
              : 'filter__link'
          }
          data-cy="FilterLinkActive"
          onClick={event => {
            event.preventDefault();
            setQuery(QueryTodos.Active);
          }}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={
            query === QueryTodos.Completed
              ? `filter__link selected`
              : 'filter__link'
          }
          data-cy="FilterLinkCompleted"
          onClick={event => {
            event.preventDefault();
            setQuery(QueryTodos.Completed);
          }}
        >
          Completed
        </a>
      </nav>

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedTodos.length === 0}
        onClick={() => clearCompletedTodos()}
      >
        Clear completed
      </button>
    </footer>
  );
};
