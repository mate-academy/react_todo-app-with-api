import React from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../TodosContext';
import { Filter } from '../../types/Filter';

export const TodoFooter: React.FC = () => {
  const {
    todos,
    setStatusFilter,
    statusFilter,
    setTodos,
  } = React.useContext(TodosContext);

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const hasSomeCompletedTodos = todos.some(todo => todo.completed);

  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${activeTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: statusFilter === Filter.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setStatusFilter(Filter.ALL)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: statusFilter === Filter.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setStatusFilter(Filter.ACTIVE)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: statusFilter === Filter.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setStatusFilter(Filter.COMPLETED)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!hasSomeCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
