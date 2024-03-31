import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { FilterOptions } from '../types/FilterOptions';
import { deleteTodo } from '../api/todos';
import { Errors } from '../types/Errors';

type Props = {
  todos: Todo[];
  updateTodos: (todoItems: Todo[]) => void;
  filterOption: FilterOptions;
  selectFilterOption: (option: FilterOptions) => void;
  errorText: Errors | null;
  addErrorText: (errorMessage: Errors | null) => void;
  clearTimeoutError: () => void;
  selectIsCompletedTodosDeleting: (value: boolean) => void;
};

export const TodosFilter: React.FC<Props> = ({
  todos,
  updateTodos,
  filterOption,
  selectFilterOption,
  errorText,
  addErrorText,
  clearTimeoutError,
  selectIsCompletedTodosDeleting,
}) => {
  const handleClearCompletedTodos = () => {
    selectIsCompletedTodosDeleting(true);

    if (errorText) {
      addErrorText(null);
    }

    async function clearCompleted() {
      try {
        const completedTodos = todos.filter(todo => todo.completed);
        const completedTodosToDeleteIds = completedTodos.map(todo => todo.id);
        const completedTodosToDelete = completedTodos.map(({ id }) =>
          deleteTodo(id),
        );

        const results = await Promise.allSettled(completedTodosToDelete);

        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            completedTodosToDeleteIds.splice(index, 1);
          }
        });

        const updatedTodos = todos.filter(
          todo => !completedTodosToDeleteIds.includes(todo.id),
        );

        updateTodos(updatedTodos);

        if (results.some(result => result.status === 'rejected')) {
          throw new Error();
        }
      } catch (error) {
        addErrorText(Errors.unableToDelete);
        clearTimeoutError();
      } finally {
        selectIsCompletedTodosDeleting(false);
      }
    }

    clearCompleted();
  };

  const notCompletedTodosCount = useCallback((): number => {
    let count = 0;

    todos.forEach(todo => {
      if (!todo.completed) {
        count += 1;
      }
    });

    return count;
  }, [todos]);

  const completedTodosQuantity = useMemo(
    () => todos.length - notCompletedTodosCount(),
    [todos, notCompletedTodosCount],
  );

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {notCompletedTodosCount()} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={classNames('filter__link', {
            selected: filterOption === FilterOptions.all,
          })}
          data-cy="FilterLinkAll"
          onClick={() => selectFilterOption(FilterOptions.all)}
        >
          {FilterOptions.all}
        </a>

        <a
          href="#/active"
          className={classNames('filter__link', {
            selected: filterOption === FilterOptions.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => selectFilterOption(FilterOptions.active)}
        >
          {FilterOptions.active}
        </a>

        <a
          href="#/completed"
          className={classNames('filter__link', {
            selected: filterOption === FilterOptions.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => selectFilterOption(FilterOptions.completed)}
        >
          {FilterOptions.completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!completedTodosQuantity}
        onClick={handleClearCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
