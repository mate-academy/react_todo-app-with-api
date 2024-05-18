import React, { useContext } from 'react';
import cn from 'classnames';
import { TodoContext } from '../context/TodoContext';
import { Filter } from '../types/Filter';

export const Footer = () => {
  const {
    todos,
    originalTodos,
    filteredBy,
    setFilteredBy,
    handleClearCompleted,
  } = useContext(TodoContext);

  const activeTodos = originalTodos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;
  const disabled = todos.some(todo => todo.completed);

  const handleFilter = (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: Filter,
  ) => {
    event.preventDefault();

    setFilteredBy(type);
  };

  const handleClearTodos = () => {
    const done = todos.filter(({ completed }) => completed);

    handleClearCompleted(done.map(({ id }) => id));
  };

  return (
    <>
      {originalTodos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${activeTodos} items left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={cn('filter__link', {
                selected: filteredBy === Filter.All,
              })}
              data-cy="FilterLinkAll"
              onClick={event => handleFilter(event, Filter.All)}
            >
              All
            </a>

            <a
              href="#/active"
              className={cn('filter__link', {
                selected: filteredBy === Filter.Active,
              })}
              data-cy="FilterLinkActive"
              onClick={event => handleFilter(event, Filter.Active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={cn('filter__link', {
                selected: filteredBy === Filter.Completed,
              })}
              data-cy="FilterLinkCompleted"
              onClick={event => handleFilter(event, Filter.Completed)}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={!disabled}
            onClick={handleClearTodos}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
