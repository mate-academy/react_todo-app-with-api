/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import { useCallback, useContext, useMemo } from 'react';
import { TodosContext } from '../../contexts/TodosContext';
import { deleteTodo } from '../../api/todos';
import { Status } from '../../types/Status';
import { Errors } from '../../types/Errors';

export const Footer = () => {
  const {
    filterBy,
    setFilterBy,
    todos,
    setTodos,
    setEditedTodos,
    setErrorMessage,
  } = useContext(TodosContext);

  const todosToDelete = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const deleteComletedTodos = useCallback(() => {
    setEditedTodos(todosToDelete);

    todosToDelete.map(deletedTodo => deleteTodo(deletedTodo.id)
      .then(() => setTodos(currentTodos => currentTodos
        .filter(currentTodo => currentTodo.id !== deletedTodo.id)))
      .catch(() => setErrorMessage(Errors.onDelete))
      .finally(() => setEditedTodos([])));
  }, [todosToDelete]);

  const todosLeft = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${todosLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          onClick={() => setFilterBy(Status.All)}
          className={classNames('filter__link', {
            selected: filterBy === Status.All,
          })}
          data-cy="FilterLinkAll"
        >
          All
        </a>

        <a
          href="#/active"
          onClick={() => setFilterBy(Status.Active)}
          className={classNames('filter__link', {
            selected: filterBy === Status.Active,
          })}
          data-cy="FilterLinkActive"
        >
          Active
        </a>

        <a
          href="#/completed"
          onClick={() => setFilterBy(Status.Completed)}
          className={classNames('filter__link', {
            selected: filterBy === Status.Completed,
          })}
          data-cy="FilterLinkCompleted"
        >
          Completed
        </a>
      </nav>

      <button
        onClick={deleteComletedTodos}
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={todosLeft === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
