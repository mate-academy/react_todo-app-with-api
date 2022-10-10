import classNames from 'classnames';
import React, { useCallback, useMemo } from 'react';
import { deleteTodo } from '../../api/todos';
import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

type Props = {
  filterTypes: (arg: FilterType) => void;
  filterType: FilterType;
  todos: Todo[];
  completedTodos: Todo[];
  setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  errorMessage: string | null;
  selectedIds: number[];
};

export const Footer: React.FC<Props> = ({
  filterTypes,
  filterType,
  todos,
  completedTodos,
  setSelectedIds,
  setTodos,
  setErrorMessage,
  errorMessage,
  selectedIds,
}) => {
  const notCompletedTodos = useMemo(() => (
    todos.filter(({ completed }) => !completed)
  ), [todos]);

  const todosCompletedLength = useMemo(() => (
    todos.filter(todo => todo.completed).length),
  [todos]);

  const deleteCompletedTodos = useCallback(async () => {
    setSelectedIds(completedTodos.map((todo => todo.id)));

    await Promise.all(completedTodos.map(({ id }) => deleteTodo(id)))
      .then(() => setTodos((prevTodos) => prevTodos
        .filter(({ completed }) => !completed)))
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setSelectedIds([]);
      });

    setSelectedIds([]);
  }, [todos, selectedIds, errorMessage]);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${notCompletedTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          data-cy="FilterLinkAll"
          href="#/"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.All },
          )}
          onClick={() => {
            filterTypes(FilterType.All);
          }}
        >
          All
        </a>

        <a
          data-cy="FilterLinkActive"
          href="#/active"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Active },
          )}
          onClick={() => filterTypes(FilterType.Active)}
        >
          Active
        </a>
        <a
          data-cy="FilterLinkCompleted"
          href="#/completed"
          className={classNames(
            'filter__link',
            { selected: filterType === FilterType.Completed },
          )}
          onClick={() => filterTypes(FilterType.Completed)}
        >
          Completed
        </a>
      </nav>
      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={deleteCompletedTodos}
        disabled={!todosCompletedLength}
      >
        Clear completed
      </button>
    </footer>
  );
};
