import React, { useContext } from 'react';
import cn from 'classnames';
import { ActionNames, FilterBy, TodoContext, errors } from './TodoContext';
import { deleteTodo } from '../api/todos';

export const Footer = () => {
  const {
    todos,
    originalTodos,
    filteredBy,
    setFilteredBy,
    dispatch,
    handleError,
    handleLoading,
  } = useContext(TodoContext);

  const activeTodos = originalTodos.filter(
    todo => !todo.completed && todo.id !== 0,
  ).length;
  const disabled = todos.some(todo => todo.completed);

  const handleFilter = (
    event: React.MouseEvent<HTMLAnchorElement>,
    type: FilterBy,
  ) => {
    event.preventDefault();

    setFilteredBy(type);
  };

  const handleClearTodos = () => {
    const done = todos.filter(({ completed }) => completed);

    handleLoading(done.map(({ id }) => id));

    done.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          dispatch({ type: ActionNames.Delete, payload: todo.id });
        })
        .catch(() => handleError(errors.DeleteTodo));
    });
  };

  return (
    <>
      {originalTodos.length > 0 && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${activeTodos} ${activeTodos === 1 ? 'item' : 'items'} left`}
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={cn('filter__link', {
                selected: filteredBy === FilterBy.All,
              })}
              data-cy="FilterLinkAll"
              onClick={event => handleFilter(event, FilterBy.All)}
            >
              All
            </a>

            <a
              href="#/active"
              className={cn('filter__link', {
                selected: filteredBy === FilterBy.Active,
              })}
              data-cy="FilterLinkActive"
              onClick={event => handleFilter(event, FilterBy.Active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={cn('filter__link', {
                selected: filteredBy === FilterBy.Completed,
              })}
              data-cy="FilterLinkCompleted"
              onClick={event => handleFilter(event, FilterBy.Completed)}
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
