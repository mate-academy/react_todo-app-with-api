/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import { useCallback, useContext, useMemo } from 'react';
import { TodosContext } from '../../contexts/TodosContext';
import { deleteTodo } from '../../api/todos';
import { Status } from '../../types/Status';
import { Errors } from '../../types/Errors';

export const Footer = () => {
  const {
    filterField,
    setFilterField,
    todos,
    setTodos,
    setChangedTodos,
    setErrorMessage,
  } = useContext(TodosContext);

  const deletedTodos = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const removeCompletedTodos = useCallback(() => {
    setChangedTodos(deletedTodos);

    deletedTodos.map(deletedTodo => deleteTodo(deletedTodo.id)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(currentTodo => currentTodo.id !== deletedTodo.id)))
      .catch(() => setErrorMessage(Errors.UnableToDelete))
      .finally(() => setChangedTodos([])));
  }, [deletedTodos]);

  const counterOfNonCompletedTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${counterOfNonCompletedTodos} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          onClick={() => setFilterField(Status.All)}
          className={classNames('filter__link', {
            selected: filterField === Status.All,
          })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          onClick={() => setFilterField(Status.Active)}
          className={classNames('filter__link', {
            selected: filterField === Status.Active,
          })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          onClick={() => setFilterField(Status.Completed)}
          className={classNames('filter__link', {
            selected: filterField === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        onClick={removeCompletedTodos}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={counterOfNonCompletedTodos === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
