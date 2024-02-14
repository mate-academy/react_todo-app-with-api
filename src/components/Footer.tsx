/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../types/Status';
import { TodoContext } from '../context/TodoContext';
import { deleteTodos } from '../api/todos';
import { Error } from '../types/Errors';

export const Footer: React.FC = () => {
  const {
    todos,
    setStatus,
    status,
    setChangedTodos,
    setTodos,
    setErrorMessage,
  } = useContext(TodoContext);

  const unCompletedTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const deletedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const removeCompletedTodos = useCallback(() => {
    setChangedTodos(deletedTodos);

    deletedTodos.map(deletedTodo => deleteTodos(deletedTodo.id)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(currentTodo => currentTodo.id !== deletedTodo.id)))
      .catch(() => setErrorMessage(Error.DELETE_ERROR))
      .finally(() => setChangedTodos([])));
  }, [deletedTodos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${unCompletedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          data-cy="FilterLinkAll"
          className={classNames(
            'filter__link',
            { selected: status === FilterStatus.All },
          )}
          onClick={() => setStatus(FilterStatus.All)}
        >
          All
        </a>

        <a
          href="#/active"
          data-cy="FilterLinkActive"
          className={classNames(
            'filter__link',
            { selected: status === FilterStatus.Active },
          )}
          onClick={() => setStatus(FilterStatus.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          data-cy="FilterLinkCompleted"
          className={classNames(
            'filter__link',
            { selected: status === FilterStatus.Completed },
          )}
          onClick={() => setStatus(FilterStatus.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={removeCompletedTodos}
        disabled={unCompletedTodos === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
