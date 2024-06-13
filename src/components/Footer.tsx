/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext } from 'react';
import classNames from 'classnames';
import { deleteTodo } from '../api/todos';
import { Filter } from '../types/Filter';
import { TodosContext } from '../TodosContext';

export const Footer = () => {
  const {
    todos,
    setTodos,
    filtering: status,
    setFiltering: setStatus,
    setErrorMessage,
  } = useContext(TodosContext);

  const completedTodos = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  const itemsLeft = todos.reduce((acc, t) => {
    if (!t.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const handleAllChange = useCallback(() => {
    setStatus(Filter.ALL);
  }, [setStatus]);

  const handleActiveChange = useCallback(() => {
    setStatus(Filter.ACTIVE);
  }, [setStatus]);

  const handleCompletedChange = useCallback(() => {
    setStatus(Filter.COMPLETED);
  }, [setStatus]);

  const handleDelete = (ids: number[]) => {
    ids.forEach(id => {
      deleteTodo(id)
        .then(() => setTodos(prev => prev.filter(todo => todo.id !== id)))
        .catch(() => setErrorMessage('Unable to delete a todo'));
    });
  };

  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: Filter.ALL === status,
          })}
          data-cy="FilterLinkAll"
          onClick={handleAllChange}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: Filter.ACTIVE === status,
          })}
          data-cy="FilterLinkActive"
          onClick={handleActiveChange}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: Filter.COMPLETED === status,
          })}
          data-cy="FilterLinkCompleted"
          onClick={handleCompletedChange}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={() => handleDelete(completedTodos)}
      >
        Clear completed
      </button>
    </footer>
  );
};
