import React, { useContext } from 'react';
import cn from 'classnames';
import { FilterType } from '../types/FilterType';
import { TodosContext } from '../TodosContext';
import { removeTodo } from '../api/todos';
import { ErrorType } from '../types/ErrorType';

export const Footer: React.FC = () => {
  const {
    filter,
    setFilter,
    todos,
    setTodos,
    setIsLoader,
    setErrorMessage,
  } = useContext(TodosContext);
  const hasCompletedTodos = todos.some(todo => todo.completed === true);
  const uncompletedTodos = todos.filter(todo => todo.completed === false);
  const completedTodos = todos.filter(todo => todo.completed === true);

  const deleteAllCompleteTodo = () => {
    setIsLoader(true);
    completedTodos.map(todo => (
      removeTodo(todo.id)
        .then(() => setTodos(uncompletedTodos))
        .catch(() => setErrorMessage(ErrorType.deleteError))
        .finally(() => {
          setTimeout(() => setErrorMessage(ErrorType.noError), 3000);
          setIsLoader(false);
        })
    ));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${uncompletedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link ', {
            selected: filter === FilterType.ALL,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(FilterType.ALL)}
        >
          {FilterType.ALL}
        </a>

        <a
          href="#/active"
          className={cn('filter__link ', {
            selected: filter === FilterType.ACTIVE,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(FilterType.ACTIVE)}
        >
          {FilterType.ACTIVE}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link ', {
            selected: filter === FilterType.COMPLETED,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(FilterType.COMPLETED)}
        >
          {FilterType.COMPLETED}
        </a>
      </nav>

      {hasCompletedTodos && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={deleteAllCompleteTodo}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};
