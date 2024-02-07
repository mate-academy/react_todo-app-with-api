/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../contexts/TodoContext';
import { deleteTodo } from '../api/todos';
import { Filtering } from '../types/Filtering';
import { Error } from '../types/Error';
import { getItemsLeft } from '../utils/getItemsLeft';

export const Footer = () => {
  const {
    todos,
    setTodos,
    filtering,
    setFiltering,
    setLoadingTodo,
    setErrorMessage,
  } = useContext(TodoContext);

  const itemsLeft = getItemsLeft(todos);

  const completedTodosIds = useMemo(
    () => todos.filter(todo => todo.completed), [todos],
  );

  const handleFinally = () => {
    setLoadingTodo(null);
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  const handleDelete = useCallback(() => {
    completedTodosIds.forEach(todo => {
      setLoadingTodo(todo);
      deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        })
        .catch(() => setErrorMessage(Error.Delete))
        .finally(() => handleFinally());
    });
  }, [completedTodosIds]);

  const hasCompleted = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${itemsLeft} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames(
            'filter__link',
            { selected: Filtering.All === filtering },
          )}
          data-cy="FilterLinkAll"
          onClick={() => setFiltering(Filtering.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: Filtering.Active === filtering },
          )}
          data-cy="FilterLinkActive"
          onClick={() => setFiltering(Filtering.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: Filtering.Completed === filtering },
          )}
          data-cy="FilterLinkCompleted"
          onClick={() => setFiltering(Filtering.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompleted}
        onClick={handleDelete}
      >
        Clear completed
      </button>
    </footer>
  );
};
