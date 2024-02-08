/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useContext, useMemo } from 'react';
import classNames from 'classnames';
import { TodoContext } from '../contexts/TodoContext';
import { Filtering } from '../types/Filtering';
import { getItemsLeft } from '../utils/getItemsLeft';

export const Footer = () => {
  const {
    todos,
    filtering,
    setFiltering,
    handleDeleteTodo,
  } = useContext(TodoContext);

  const itemsLeft = getItemsLeft(todos);

  const completedTodosIds = useMemo(
    () => todos.filter(todo => todo.completed), [todos],
  );

  const handleDelete = useCallback(() => {
    completedTodosIds.forEach(todo => handleDeleteTodo(todo.id, todo));
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
