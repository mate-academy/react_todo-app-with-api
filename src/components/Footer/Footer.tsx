import classNames from 'classnames';
import { useMemo } from 'react';
import { useTodos } from '../../Store';
import { Status } from '../../types/FilterStatus';
import { deleteTodo } from '../../api/todos';
import { ErrorMessages } from '../../types/ErrorMessages';

export const Footer = () => {
  const {
    todos,
    setTodos,
    filterStatus,
    setFilterStatus,
    setErrorMessage,
    clearError,
  } = useTodos();

  const remainingTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const hasCompletedTodos = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodo(todo.id)
          .then(() => {
            setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id));
          })
          .catch(() => {
            setErrorMessage(ErrorMessages.UnableToDeleteaTodo);
            clearError();
          });
      }
    });
  };

  return (
    <>
      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {remainingTodos} items left
          </span>

          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={classNames('filter__link', {
                selected: filterStatus === Status.All,
              })}
              data-cy="FilterLinkAll"
              onClick={() => setFilterStatus(Status.All)}
            >
              {Status.All}
            </a>

            <a
              href="#/active"
              className={classNames('filter__link', {
                selected: filterStatus === Status.Active,
              })}
              data-cy="FilterLinkActive"
              onClick={() => setFilterStatus(Status.Active)}
            >
              {Status.Active}
            </a>

            <a
              href="#/completed"
              className={classNames('filter__link', {
                selected: filterStatus === Status.Completed,
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => setFilterStatus(Status.Completed)}
            >
              {Status.Completed}
            </a>
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={!hasCompletedTodos}
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
