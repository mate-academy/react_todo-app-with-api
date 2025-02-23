/* eslint-disable jsx-a11y/control-has-associated-label */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { USER_ID, addTodo, patchTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';

type Props = {
  todos: Todo[];
  updateTodos: (todoItems: Todo[]) => void;
  addTempTodo: (todoItem: Todo | null) => void;
  errorText: Errors | null;
  addErrorText: (errorMessage: Errors | null) => void;
  clearTimeoutError: () => void;
  selectToggleAllLoader: (value: boolean | null) => void;
};

export const TodoApp: React.FC<Props> = ({
  todos,
  updateTodos,
  addTempTodo,
  errorText,
  addErrorText,
  clearTimeoutError,
  selectToggleAllLoader,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const addingTodoField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (addingTodoField.current && !isSubmitting) {
      addingTodoField.current.focus();
    }
  }, [isSubmitting, todos]);

  const isEveryTodoCompleted = useMemo(
    () => todos.every(todoItem => todoItem.completed),
    [todos],
  );

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setQuery(event.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      if (errorText) {
        addErrorText(null);
      }

      if (!query.trim()) {
        addErrorText(Errors.emptyTitle);
        clearTimeoutError();

        return;
      }

      setIsSubmitting(true);

      addTempTodo({
        id: 0,
        userId: USER_ID,
        title: query.trim(),
        completed: false,
      });

      addTodo({
        userId: USER_ID,
        title: query.trim(),
        completed: false,
      })
        .then(addedTodo => {
          updateTodos([...todos, addedTodo]);

          setQuery('');
        })
        .catch(() => {
          addErrorText(Errors.unableToAdd);
          clearTimeoutError();
        })
        .finally(() => {
          setIsSubmitting(false);
          addTempTodo(null);
        });
    },
    [
      query,
      isSubmitting,
      todos,
      updateTodos,
      errorText,
      addErrorText,
      clearTimeoutError,
      addTempTodo,
    ],
  );

  const handleToggleAllTodos = () => {
    if (errorText) {
      addErrorText(null);
    }

    let completedStatus = true;

    if (isEveryTodoCompleted) {
      completedStatus = false;
    }

    selectToggleAllLoader(!completedStatus);

    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: completedStatus,
    }));

    const notCompletedTodos = todos.filter(({ completed }) => !completed);

    const updatedTodosPromises = isEveryTodoCompleted
      ? todos.map(todo => patchTodo({ ...todo, completed: false }))
      : notCompletedTodos.map(todo => patchTodo({ ...todo, completed: true }));

    async function toggleAllOnServer() {
      try {
        await Promise.all(updatedTodosPromises);
        updateTodos(updatedTodos);
      } catch (error) {
        addErrorText(Errors.unableToUpdate);
        clearTimeoutError();
      } finally {
        selectToggleAllLoader(null);
      }
    }

    toggleAllOnServer();
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isEveryTodoCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={addingTodoField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleQueryChange}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
