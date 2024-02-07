import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { TodosContext } from '../../TodosContext/TodosContext';
import { FilteringBy } from '../../types/FilteringBy';

export const Footer: React.FC = () => {
  const {
    todos, handleClearCompleted, filteringBy, setFilteringBy,
  } = useContext(TodosContext);

  const [countOfComplitedTodos, setCountOfComplitedTodos] = useState(0);
  const [isAnyCompletedTodo, setIsAnyCompletedTodo] = useState(false);

  useEffect(() => {
    const complitedTodos = todos.filter((todo) => !todo.completed)
      .length;

    setCountOfComplitedTodos(complitedTodos);

    const isAnyCompleted = todos.some((todo) => todo.completed);

    setIsAnyCompletedTodo(isAnyCompleted);
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countOfComplitedTodos} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filteringBy === FilteringBy.default,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilteringBy(FilteringBy.default)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filteringBy === FilteringBy.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilteringBy(FilteringBy.active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filteringBy === FilteringBy.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilteringBy(FilteringBy.completed)}
        >
          Completed
        </a>
      </nav>

      {/* don't show this button if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!isAnyCompletedTodo}
      >
        Clear completed
      </button>

    </footer>
  );
};
