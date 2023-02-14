import React, { FunctionComponent, useCallback } from 'react';
import classnames from 'classnames';
import { FilterType } from '../../types/filterType';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';
import { Errors } from '../../types/Errors';
import { useActiveTodos, useCompleteTodos } from '../../hooks/hooks';

interface FooterProps {
  todos: Todo[];
  filterBy: FilterType;
  setFilterBy: (filter: FilterType) => void;
  setSelectedTodosId: React.Dispatch<React.SetStateAction<number[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<Errors>>;
  loadingTodosFromServer: () => Promise<void>;
}
export const Footer: FunctionComponent<FooterProps> = ({
  todos,
  filterBy,
  setFilterBy,
  setSelectedTodosId,
  setErrorMessage,
  loadingTodosFromServer,
}) => {
  const completedTodos = useCompleteTodos(todos);
  const activeTodos = useActiveTodos(todos);

  const removeCompletedTodos = useCallback(async () => {
    try {
      setSelectedTodosId(prevId => ([
        ...prevId,
        ...completedTodos.map(todo => todo.id),
      ]));

      await Promise.all(completedTodos.map(async todo => {
        await deleteTodo(todo.id);
      }));

      await loadingTodosFromServer();
      setSelectedTodosId([]);
    } catch {
      setErrorMessage(Errors.Deleting);
    }
  }, [completedTodos]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classnames('filter__link', {
            selected: filterBy === FilterType.All,
          })}
          onClick={() => setFilterBy(FilterType.All)}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classnames('filter__link', {
            selected: filterBy === FilterType.Active,
          })}
          onClick={() => setFilterBy(FilterType.Active)}
        >
          Active
        </a>

        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classnames('filter__link', {
            selected: filterBy === FilterType.Completed,
          })}
          onClick={() => setFilterBy(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className={classnames(
          'todoapp__clear-completed',
          {
            'todoapp__clear-completed--hidden':
              !completedTodos.length,
          },
        )}
        onClick={removeCompletedTodos}
      >
        Clear completed
      </button>

    </footer>
  );
};
